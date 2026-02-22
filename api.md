# Pardia Telemetry API

API for the Pardia Battery Management (PBM) macOS app and other client apps to send device telemetry data to the Pardia backend.

**Base URL:** `https://api.pardia.io`

---

## Overview

The PBM app sends three types of requests:

1. **Initial Report** — sent once on first launch (and on reinstall). Registers the device and captures hardware specs + first battery snapshot.
2. **Weekly Report** — sent once per week. Captures battery health trends, CPU load, and usage patterns over the past 7 days.
3. **User Registration** — sent when a user opts in for update notifications. Registers their name, email, and device for future communications.

No authentication is required. Telemetry is anonymous — identified only by a locally-generated UUID (`device_id`). Users can later link their `device_id` to a Pardia account on the website to get personalized product recommendations.

---

## Endpoints

### 1. Initial Report

```
POST https://api.pardia.io/v1/telemetry/initial
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "report_type": "initial",
  "device_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-02-22T14:30:00Z",
  "app_version": "1.0.0",
  "os_version": "15.3",
  "os_build": "24D60",
  "hardware": {
    "model_identifier": "Mac14,2",
    "chip": "Apple M2",
    "cpu_core_count": 8,
    "cpu_performance_cores": 4,
    "cpu_efficiency_cores": 4,
    "ram_bytes": 8589934592,
    "disk_total_bytes": 245107195904
  },
  "battery": {
    "health_percent": 92.5,
    "cycle_count": 145,
    "design_capacity_mah": 5103,
    "max_capacity_mah": 4720,
    "current_capacity_mah": 3800,
    "level_percent": 80,
    "temperature_celsius": 32.5,
    "is_charging": false,
    "is_plugged_in": true
  }
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `report_type` | string | Yes | Must be `"initial"` |
| `device_id` | string (UUID v4) | Yes | Unique device identifier, generated locally on first launch and persisted |
| `timestamp` | string (ISO 8601) | Yes | When this report was generated |
| `app_version` | string | Yes | PBM app version (e.g., `"1.0.0"`) |
| `os_version` | string | No | macOS version (e.g., `"15.3"`) |
| `os_build` | string | No | macOS build number (e.g., `"24D60"`) |
| **hardware** | object | Yes | Hardware specifications |
| `hardware.model_identifier` | string | No | Mac model ID (e.g., `"Mac14,2"`, `"MacBookPro18,1"`) |
| `hardware.chip` | string | No | Chip name (e.g., `"Apple M2"`, `"Apple M1 Pro"`) |
| `hardware.cpu_core_count` | integer | No | Total CPU cores |
| `hardware.cpu_performance_cores` | integer | No | Performance core count |
| `hardware.cpu_efficiency_cores` | integer | No | Efficiency core count |
| `hardware.ram_bytes` | integer | No | Total RAM in bytes (e.g., `8589934592` = 8 GB) |
| `hardware.disk_total_bytes` | integer | No | Total disk size in bytes |
| **battery** | object | Yes | Battery state at time of report |
| `battery.health_percent` | number | No | Battery health as percentage (e.g., `92.5`) |
| `battery.cycle_count` | integer | No | Total charge cycles |
| `battery.design_capacity_mah` | integer | No | Original factory capacity in mAh |
| `battery.max_capacity_mah` | integer | No | Current maximum capacity in mAh |
| `battery.current_capacity_mah` | integer | No | Current charge level in mAh |
| `battery.level_percent` | integer (0-100) | No | Battery level as percentage |
| `battery.temperature_celsius` | number | No | Battery temperature in Celsius |
| `battery.is_charging` | boolean | No | Whether the battery is currently charging |
| `battery.is_plugged_in` | boolean | No | Whether the charger is connected |

**Success Response:**
```json
HTTP 200
{ "status": "ok" }
```

**Validation Error Response:**
```json
HTTP 422
{
  "message": "The device id field must be a valid UUID.",
  "errors": {
    "device_id": ["The device id field must be a valid UUID."]
  }
}
```

---

### 2. Weekly Report

```
POST https://api.pardia.io/v1/telemetry/weekly
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "report_type": "weekly",
  "device_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-02-22T14:30:00Z",
  "period_start": "2026-02-15T00:00:00Z",
  "period_end": "2026-02-22T00:00:00Z",
  "app_version": "1.0.0",
  "battery": {
    "health_percent": 92.3,
    "cycle_count": 147,
    "max_capacity_mah": 4715,
    "current_capacity_mah": 4000,
    "level_percent": 85,
    "temperature_celsius": 31.2
  },
  "performance": {
    "cpu_load_avg_1min": 2.5,
    "cpu_load_avg_5min": 1.8,
    "cpu_load_avg_15min": 1.2,
    "sample_count": 168
  },
  "usage": {
    "screen_on_time_seconds": 28800,
    "estimated_method": "IOKit",
    "total_plugged_in_seconds": 43200,
    "total_on_battery_seconds": 21600,
    "charge_sessions_count": 5,
    "app_uptime_seconds": 604800
  }
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `report_type` | string | Yes | Must be `"weekly"` |
| `device_id` | string (UUID v4) | Yes | Same UUID used in the initial report |
| `timestamp` | string (ISO 8601) | Yes | When this report was generated |
| `period_start` | string (ISO 8601) | Yes | Start of the reporting period |
| `period_end` | string (ISO 8601) | Yes | End of the reporting period |
| `app_version` | string | Yes | PBM app version |
| **battery** | object | Yes | Battery state at end of period |
| `battery.health_percent` | number | No | Battery health percentage |
| `battery.cycle_count` | integer | No | Total charge cycles |
| `battery.max_capacity_mah` | integer | No | Current max capacity in mAh |
| `battery.current_capacity_mah` | integer | No | Current charge in mAh |
| `battery.level_percent` | integer (0-100) | No | Battery level percentage |
| `battery.temperature_celsius` | number | No | Battery temperature in Celsius |
| **performance** | object | No | CPU performance averages over the period |
| `performance.cpu_load_avg_1min` | number | No | 1-minute load average |
| `performance.cpu_load_avg_5min` | number | No | 5-minute load average |
| `performance.cpu_load_avg_15min` | number | No | 15-minute load average |
| `performance.sample_count` | integer | No | Number of samples taken during the period |
| **usage** | object | No | Usage statistics for the period |
| `usage.screen_on_time_seconds` | integer | No | Total screen-on time in seconds |
| `usage.estimated_method` | string | No | How screen time was measured (e.g., `"IOKit"`) |
| `usage.total_plugged_in_seconds` | integer | No | Time plugged in (seconds) |
| `usage.total_on_battery_seconds` | integer | No | Time on battery (seconds) |
| `usage.charge_sessions_count` | integer | No | Number of times the charger was plugged in |
| `usage.app_uptime_seconds` | integer | No | How long the PBM app was running (seconds) |

**Success Response:**
```json
HTTP 200
{ "status": "ok" }
```

---

### 3. User Registration

```
POST https://api.pardia.io/v1/user/register
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "device_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "app_version": "1.0.0",
  "timestamp": "2026-02-22T14:30:00Z"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `device_id` | string (UUID v4) | Yes | Same UUID used in telemetry reports |
| `name` | string | Yes | User's full name |
| `email` | string (email) | Yes | User's email address for notifications |
| `phone` | string | No | User's phone number (optional) |
| `app_version` | string | Yes | PBM app version (e.g., `"1.0.0"`) |
| `timestamp` | string (ISO 8601) | Yes | When the registration was submitted |

**Behavior:**
- **Upsert** keyed by `device_id` — if a registration already exists for the device, it updates the record; otherwise it creates a new one.
- This allows users to update their contact info by re-registering from the same device.

**Success Response:**
```json
HTTP 200
{ "status": "ok" }
```

**Validation Error Response:**
```json
HTTP 422
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

---

## Device ID

The `device_id` is a UUID v4 string that uniquely identifies a Mac. The PBM app should:

1. Generate a UUID on first launch: `UUID().uuidString`
2. Persist it locally (e.g., UserDefaults or Keychain)
3. Reuse the same UUID for all subsequent reports
4. If the app is reinstalled, the server handles duplicate initial reports gracefully (upserts the device record)

This ID is also what users enter on the Pardia website to link their device to their account for personalized recommendations.

---

## When to Send Reports

| Report | Trigger |
|--------|---------|
| Initial | Once on first app launch. Also re-send on reinstall. |
| Weekly | Once every 7 days, ideally at the same time. Use a background scheduler. |

---

## Implementation Notes for the macOS App

### Swift Example — Sending the Initial Report

```swift
import Foundation

struct TelemetryService {
    static let baseURL = URL(string: "https://api.pardia.io")!

    static func sendInitialReport(deviceId: String, completion: @escaping (Bool) -> Void) {
        let url = baseURL.appendingPathComponent("v1/telemetry/initial")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let body: [String: Any] = [
            "report_type": "initial",
            "device_id": deviceId,
            "timestamp": ISO8601DateFormatter().string(from: Date()),
            "app_version": Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
            "os_version": ProcessInfo.processInfo.operatingSystemVersionString,
            "hardware": [
                "model_identifier": getModelIdentifier(),
                "chip": getChipName(),
                "cpu_core_count": ProcessInfo.processInfo.processorCount,
                "ram_bytes": ProcessInfo.processInfo.physicalMemory
            ],
            "battery": [
                "health_percent": getBatteryHealth(),
                "cycle_count": getCycleCount(),
                "level_percent": getBatteryLevel(),
                "is_charging": isCharging(),
                "is_plugged_in": isPluggedIn()
            ]
        ]

        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { _, response, error in
            let httpResponse = response as? HTTPURLResponse
            completion(error == nil && httpResponse?.statusCode == 200)
        }.resume()
    }
}
```

### Swift Example — Sending the Weekly Report

```swift
static func sendWeeklyReport(deviceId: String, periodStart: Date, periodEnd: Date, completion: @escaping (Bool) -> Void) {
    let url = baseURL.appendingPathComponent("v1/telemetry/weekly")
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    let formatter = ISO8601DateFormatter()

    let body: [String: Any] = [
        "report_type": "weekly",
        "device_id": deviceId,
        "timestamp": formatter.string(from: Date()),
        "period_start": formatter.string(from: periodStart),
        "period_end": formatter.string(from: periodEnd),
        "app_version": Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
        "battery": [
            "health_percent": getBatteryHealth(),
            "cycle_count": getCycleCount(),
            "max_capacity_mah": getMaxCapacity(),
            "current_capacity_mah": getCurrentCapacity(),
            "level_percent": getBatteryLevel(),
            "temperature_celsius": getBatteryTemperature()
        ],
        "performance": [
            "cpu_load_avg_1min": getCPULoad1Min(),
            "cpu_load_avg_5min": getCPULoad5Min(),
            "cpu_load_avg_15min": getCPULoad15Min(),
            "sample_count": sampleCount
        ],
        "usage": [
            "screen_on_time_seconds": screenOnSeconds,
            "estimated_method": "IOKit",
            "total_plugged_in_seconds": pluggedInSeconds,
            "total_on_battery_seconds": onBatterySeconds,
            "charge_sessions_count": chargeSessions,
            "app_uptime_seconds": appUptimeSeconds
        ]
    ]

    request.httpBody = try? JSONSerialization.data(withJSONObject: body)

    URLSession.shared.dataTask(with: request) { _, response, error in
        let httpResponse = response as? HTTPURLResponse
        completion(error == nil && httpResponse?.statusCode == 200)
    }.resume()
}
```

### Swift Example — User Registration

```swift
static func registerUser(deviceId: String, name: String, email: String, phone: String? = nil, completion: @escaping (Bool) -> Void) {
    let url = baseURL.appendingPathComponent("v1/user/register")
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    var body: [String: Any] = [
        "device_id": deviceId,
        "name": name,
        "email": email,
        "app_version": Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
        "timestamp": ISO8601DateFormatter().string(from: Date())
    ]
    if let phone = phone {
        body["phone"] = phone
    }

    request.httpBody = try? JSONSerialization.data(withJSONObject: body)

    URLSession.shared.dataTask(with: request) { _, response, error in
        let httpResponse = response as? HTTPURLResponse
        completion(error == nil && httpResponse?.statusCode == 200)
    }.resume()
}
```

---

## Error Handling

| HTTP Code | Meaning | Action |
|-----------|---------|--------|
| `200` | Success | Report accepted |
| `422` | Validation error | Check the `errors` object in the response for which fields failed. Fix the payload and retry. |
| `500` | Server error | Retry with exponential backoff (e.g., 1s, 5s, 30s, 5min). Store the report locally and retry later. |
| Network error | No connectivity | Queue the report locally and send when connectivity returns |

**Recommended retry strategy:**
- Store unsent reports in a local queue (UserDefaults or a file)
- On app launch and on network restore, flush the queue
- Max 3 retries per report, then discard with a local log

---

## Testing with curl

**Initial report:**
```bash
curl -X POST https://api.pardia.io/v1/telemetry/initial \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "report_type": "initial",
    "device_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-02-22T14:30:00Z",
    "app_version": "1.0.0",
    "os_version": "15.3",
    "hardware": {
      "model_identifier": "Mac14,2",
      "chip": "Apple M2",
      "cpu_core_count": 8,
      "ram_bytes": 8589934592
    },
    "battery": {
      "health_percent": 88.0,
      "cycle_count": 250,
      "level_percent": 72,
      "is_charging": false
    }
  }'
```

**Weekly report:**
```bash
curl -X POST https://api.pardia.io/v1/telemetry/weekly \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "report_type": "weekly",
    "device_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-02-22T14:30:00Z",
    "period_start": "2026-02-15T00:00:00Z",
    "period_end": "2026-02-22T00:00:00Z",
    "app_version": "1.0.0",
    "battery": {
      "health_percent": 87.8,
      "cycle_count": 252,
      "level_percent": 65
    },
    "performance": {
      "cpu_load_avg_1min": 2.1,
      "cpu_load_avg_5min": 1.5,
      "cpu_load_avg_15min": 1.0,
      "sample_count": 168
    },
    "usage": {
      "screen_on_time_seconds": 25200,
      "total_plugged_in_seconds": 36000,
      "total_on_battery_seconds": 28800,
      "charge_sessions_count": 4,
      "app_uptime_seconds": 604800
    }
  }'
```

**User registration:**
```bash
curl -X POST https://api.pardia.io/v1/user/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "device_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "app_version": "1.0.0",
    "timestamp": "2026-02-22T14:30:00Z"
  }'
```

All should return: `{"status":"ok"}`

---

## How This Data Is Used

The telemetry feeds Pardia's personalized recommendation engine:

| Condition | Trigger | What Pardia Recommends |
|-----------|---------|----------------------|
| Battery health < 50% | `battery_critical` | Replacement battery for the user's Mac model |
| Battery health 50-80% | `battery_worn` | Battery care kit + replacement battery |
| Cycle count > 800 | `high_cycles` | Battery care products |
| Disk < 300 GB | `storage_low` | External SSD / storage upgrade |

Users see these recommendations on the Pardia website after linking their `device_id` to their account. The more telemetry data collected over time, the more accurate and timely the recommendations become.
