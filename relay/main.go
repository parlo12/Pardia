// T-Stream relay: accepts an H.264 push from the iPhone over WebSocket,
// transcodes to MPEG1-TS with ffmpeg (the only format the Tesla browser
// reliably plays — via JSMpeg onto a canvas, immune to Tesla's video
// element restrictions), and fans the stream out to viewer WebSockets.
//
//	POST /api/session            -> {"code","token"}  (phone creates a session)
//	WS   /ingest?code&token      <- binary H.264 Annex-B from the phone
//	WS   /ws?code                -> binary MPEG-TS chunks to viewers
//	GET  /{code}                 -> viewer page (JSMpeg + canvas)
//	GET  /healthz
package main

import (
	"crypto/rand"
	"embed"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"math/big"
	"net/http"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

//go:embed static
var staticFS embed.FS

//go:embed viewer.html
var viewerHTML string

//go:embed dashboard.html
var dashboardHTML string

const (
	listenAddr     = "127.0.0.1:8090"
	sessionTTL     = 4 * time.Hour
	ingestGrace    = 90 * time.Second // keep session alive across phone reconnects
	viewerBacklog  = 64               // chunks buffered per viewer before dropping
	codeAlphabet   = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	codeLength     = 6
	mpeg1Bitrate   = "900k"
	mpeg1GopFrames = "24"
)

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  64 * 1024,
	WriteBufferSize: 64 * 1024,
}

type session struct {
	code      string
	token     string
	premium   bool
	createdAt time.Time

	mu         sync.Mutex
	ffmpeg     *exec.Cmd
	ffmpegIn   io.WriteCloser
	viewers    map[*viewer]struct{}
	ingestLive bool
	lastIngest time.Time

	// Dashboard control channel: one phone, many car screens. JSON text
	// messages are forwarded verbatim phone->cars and car->phone.
	ctlPhone *websocket.Conn
	ctlCars  map[*websocket.Conn]struct{}
}

type viewer struct {
	conn *websocket.Conn
	send chan []byte
}

type logWriter struct{ prefix string }

func (l *logWriter) Write(p []byte) (int, error) {
	log.Printf("%s%s", l.prefix, strings.TrimSpace(string(p)))
	return len(p), nil
}

type registry struct {
	mu       sync.Mutex
	sessions map[string]*session
}

var reg = &registry{sessions: map[string]*session{}}

func newCode() string {
	b := make([]byte, codeLength)
	for i := range b {
		n, _ := rand.Int(rand.Reader, big.NewInt(int64(len(codeAlphabet))))
		b[i] = codeAlphabet[n.Int64()]
	}
	return string(b)
}

func newToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// ---------- session lifecycle ----------

func (r *registry) create(premium bool) *session {
	r.mu.Lock()
	defer r.mu.Unlock()
	for {
		code := newCode()
		if _, exists := r.sessions[code]; exists {
			continue
		}
		s := &session{
			code:      code,
			token:     newToken(),
			premium:   premium,
			createdAt: time.Now(),
			viewers:   map[*viewer]struct{}{},
			ctlCars:   map[*websocket.Conn]struct{}{},
		}
		r.sessions[code] = s
		return s
	}
}

func (r *registry) get(code string) *session {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.sessions[strings.ToUpper(code)]
}

func (r *registry) reap() {
	for range time.Tick(time.Minute) {
		r.mu.Lock()
		for code, s := range r.sessions {
			s.mu.Lock()
			expired := time.Since(s.createdAt) > sessionTTL ||
				(!s.ingestLive && !s.lastIngest.IsZero() && time.Since(s.lastIngest) > ingestGrace)
			s.mu.Unlock()
			if expired {
				s.shutdown()
				delete(r.sessions, code)
			}
		}
		r.mu.Unlock()
	}
}

func (s *session) shutdown() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.stopFfmpegLocked()
	for v := range s.viewers {
		close(v.send)
		delete(s.viewers, v)
	}
}

// ---------- ffmpeg pipeline ----------

func (s *session) startFfmpegLocked() error {
	if s.ffmpeg != nil {
		return nil
	}
	// Flags verified against real VideoToolbox streams (see repo history):
	// -fflags nobuffer silently produces ZERO output for VT-encoded H.264, and
	// VT's odd VUI timing (1200000/1) must be normalized with an fps filter —
	// plain "-r 30" on the output is not enough for mpeg1video.
	cmd := exec.Command("ffmpeg",
		"-hide_banner", "-loglevel", "error",
		"-probesize", "32", "-analyzeduration", "0",
		// Claim 30fps at input: real frames arrive slower but JSMpeg renders
		// on arrival, and skipping the fps filter removes its 1-frame hold
		// (~120ms latency) — first output drops from ~0.6s to ~0.1s.
		"-r", "30",
		"-f", "h264", "-i", "pipe:0",
		"-an",
		"-vf", "format=yuv420p",
		"-c:v", "mpeg1video",
		"-b:v", mpeg1Bitrate, "-maxrate", mpeg1Bitrate, "-bufsize", "900k",
		"-bf", "0", "-g", "15",
		"-f", "mpegts", "-muxdelay", "0.001", "-muxpreload", "0",
		// Static screens produce tiny output; without per-packet flushing the
		// mux buffer sits ~30s between flushes and viewers see nothing.
		"-flush_packets", "1",
		"pipe:1",
	)
	cmd.Stderr = &logWriter{prefix: "ffmpeg[" + s.code + "]: "}
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return err
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	if err := cmd.Start(); err != nil {
		return err
	}
	s.ffmpeg = cmd
	s.ffmpegIn = stdin

	go func() {
		// Emit only whole 188-byte TS packets so a viewer that joins
		// mid-stream always starts on a packet boundary (JSMpeg syncs
		// instantly instead of hunting for alignment).
		buf := make([]byte, 32*1024)
		pending := make([]byte, 0, 64*1024)
		for {
			n, err := stdout.Read(buf)
			if n > 0 {
				pending = append(pending, buf[:n]...)
				aligned := (len(pending) / 188) * 188
				if aligned > 0 {
					chunk := make([]byte, aligned)
					copy(chunk, pending[:aligned])
					pending = pending[:copy(pending, pending[aligned:])]
					s.broadcast(chunk)
				}
			}
			if err != nil {
				return
			}
		}
	}()
	go func() { cmd.Wait() }()
	return nil
}

func (s *session) stopFfmpegLocked() {
	if s.ffmpegIn != nil {
		s.ffmpegIn.Close()
		s.ffmpegIn = nil
	}
	if s.ffmpeg != nil {
		s.ffmpeg.Process.Kill()
		s.ffmpeg = nil
	}
}

func (s *session) broadcast(chunk []byte) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for v := range s.viewers {
		select {
		case v.send <- chunk:
		default:
			// viewer too slow — drop the connection rather than build latency
			close(v.send)
			delete(s.viewers, v)
		}
	}
}

// ---------- HTTP handlers ----------

func handleNewSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "POST only", http.StatusMethodNotAllowed)
		return
	}
	var body struct {
		Premium bool `json:"premium"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	s := reg.create(body.Premium)
	log.Printf("session created: %s", s.code)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"code":  s.code,
		"token": s.token,
		"url":   "https://stream.pardia.io/" + s.code,
	})
}

func handleIngest(w http.ResponseWriter, r *http.Request) {
	s := reg.get(r.URL.Query().Get("code"))
	if s == nil || s.token != r.URL.Query().Get("token") {
		http.Error(w, "unknown session", http.StatusForbidden)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	s.mu.Lock()
	// Fresh transcoder per ingest connection: the phone reconnects when its
	// video dimensions change (rotation), and mpeg1video can't switch
	// resolution mid-stream.
	s.stopFfmpegLocked()
	if err := s.startFfmpegLocked(); err != nil {
		s.mu.Unlock()
		log.Printf("ffmpeg start failed: %v", err)
		return
	}
	s.ingestLive = true
	stdin := s.ffmpegIn
	s.mu.Unlock()
	log.Printf("ingest connected: %s", s.code)

	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if msgType == websocket.BinaryMessage {
			if _, err := stdin.Write(data); err != nil {
				break
			}
		}
	}

	s.mu.Lock()
	s.ingestLive = false
	s.lastIngest = time.Now()
	s.mu.Unlock()
	log.Printf("ingest disconnected: %s", s.code)
}

func handleViewerWS(w http.ResponseWriter, r *http.Request) {
	s := reg.get(r.URL.Query().Get("code"))
	if s == nil {
		http.Error(w, "unknown session", http.StatusNotFound)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	v := &viewer{conn: conn, send: make(chan []byte, viewerBacklog)}
	s.mu.Lock()
	s.viewers[v] = struct{}{}
	viewerCount := len(s.viewers)
	s.mu.Unlock()
	log.Printf("viewer joined %s (%d total)", s.code, viewerCount)

	go func() {
		defer conn.Close()
		for chunk := range v.send {
			conn.SetWriteDeadline(time.Now().Add(5 * time.Second))
			if err := conn.WriteMessage(websocket.BinaryMessage, chunk); err != nil {
				return
			}
		}
	}()

	// read loop just to detect disconnect
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
	s.mu.Lock()
	if _, ok := s.viewers[v]; ok {
		close(v.send)
		delete(s.viewers, v)
	}
	s.mu.Unlock()
	conn.Close()
}

// handleCtl is the dashboard control channel. The phone connects with its
// session token (role=phone); car browsers connect with just the code
// (role=car). Text frames are relayed verbatim between the two sides.
func handleCtl(w http.ResponseWriter, r *http.Request) {
	s := reg.get(r.URL.Query().Get("code"))
	if s == nil {
		http.Error(w, "unknown session", http.StatusNotFound)
		return
	}
	role := r.URL.Query().Get("role")
	if role == "phone" && s.token != r.URL.Query().Get("token") {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	if role == "phone" {
		s.mu.Lock()
		if s.ctlPhone != nil {
			s.ctlPhone.Close()
		}
		s.ctlPhone = conn
		cars := len(s.ctlCars)
		s.mu.Unlock()
		log.Printf("ctl phone connected %s (%d cars)", s.code, cars)
		for {
			msgType, data, err := conn.ReadMessage()
			if err != nil {
				break
			}
			if msgType != websocket.TextMessage {
				continue
			}
			s.mu.Lock()
			for car := range s.ctlCars {
				car.WriteMessage(websocket.TextMessage, data)
			}
			s.mu.Unlock()
		}
		s.mu.Lock()
		if s.ctlPhone == conn {
			s.ctlPhone = nil
			for car := range s.ctlCars {
				car.WriteMessage(websocket.TextMessage, []byte(`{"type":"phoneOffline"}`))
			}
		}
		s.mu.Unlock()
		conn.Close()
		return
	}

	// role=car
	s.mu.Lock()
	s.ctlCars[conn] = struct{}{}
	phone := s.ctlPhone
	s.mu.Unlock()
	if phone != nil {
		phone.WriteMessage(websocket.TextMessage, []byte(`{"type":"carJoined"}`))
	}
	for {
		msgType, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if msgType != websocket.TextMessage {
			continue
		}
		s.mu.Lock()
		phone := s.ctlPhone
		s.mu.Unlock()
		if phone != nil {
			phone.WriteMessage(websocket.TextMessage, data)
		}
	}
	s.mu.Lock()
	delete(s.ctlCars, conn)
	s.mu.Unlock()
	conn.Close()
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	s := reg.get(strings.TrimPrefix(r.URL.Path, "/config/"))
	w.Header().Set("Content-Type", "application/json")
	if s == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{}`))
		return
	}
	s.mu.Lock()
	live := s.ingestLive
	premium := s.premium
	s.mu.Unlock()
	json.NewEncoder(w).Encode(map[string]any{
		"premium":       premium,
		"live":          live,
		"adIntervalSec": 120,
		"adDurationSec": 15,
	})
}

func handleViewerPage(w http.ResponseWriter, r *http.Request) {
	path := strings.Trim(r.URL.Path, "/")

	// /{code}/play -> interactive dashboard
	if strings.HasSuffix(path, "/play") {
		code := strings.ToUpper(strings.TrimSuffix(path, "/play"))
		if len(code) != codeLength || reg.get(code) == nil {
			http.Error(w, "That code was not found. Check the T-Stream app on your iPhone.", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		io.WriteString(w, strings.ReplaceAll(dashboardHTML, "{{CODE}}", code))
		return
	}

	code := strings.ToUpper(path)
	if len(code) != codeLength || reg.get(code) == nil {
		http.Error(w, "That stream code was not found. Check the code in your T-Stream app.", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	io.WriteString(w, strings.ReplaceAll(viewerHTML, "{{CODE}}", code))
}

func main() {
	go reg.reap()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/session", handleNewSession)
	mux.HandleFunc("/ingest", handleIngest)
	mux.HandleFunc("/ws", handleViewerWS)
	mux.HandleFunc("/ctl", handleCtl)
	mux.HandleFunc("/config/", handleConfig)
	mux.Handle("/static/", http.FileServer(http.FS(staticFS)))
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) { io.WriteString(w, "ok") })
	mux.HandleFunc("/", handleViewerPage)

	log.Printf("T-Stream relay listening on %s", listenAddr)
	log.Fatal(http.ListenAndServe(listenAddr, mux))
}
