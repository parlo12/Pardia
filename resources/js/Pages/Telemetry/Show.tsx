import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Device {
    device_id: string;
    model_identifier: string | null;
    chip: string | null;
    cpu_core_count: number | null;
    cpu_perf_cores: number | null;
    cpu_eff_cores: number | null;
    ram_bytes: number | null;
    disk_total_bytes: number | null;
    os_version: string | null;
    os_build: string | null;
    app_version: string | null;
    first_seen_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BatterySnapshotData {
    id: number;
    device_id: string;
    report_type: 'initial' | 'weekly';
    reported_at: string;
    health_percent: number | null;
    cycle_count: number | null;
    design_capacity_mah: number | null;
    max_capacity_mah: number | null;
    current_capacity_mah: number | null;
    level_percent: number | null;
    temperature_c: number | null;
    is_charging: boolean | null;
    is_plugged_in: boolean | null;
}

interface WeeklyReportData {
    id: number;
    device_id: string;
    reported_at: string;
    period_start: string;
    period_end: string;
    app_version: string | null;
    cpu_load_1min: number | null;
    cpu_load_5min: number | null;
    cpu_load_15min: number | null;
    sample_count: number | null;
    screen_on_seconds: number | null;
    screen_time_method: string | null;
    plugged_in_seconds: number | null;
    on_battery_seconds: number | null;
    charge_sessions: number | null;
    app_uptime_seconds: number | null;
}

interface ShowProps {
    device: Device;
    batterySnapshots: BatterySnapshotData[];
    weeklyReports: WeeklyReportData[];
    latestSnapshot: BatterySnapshotData | null;
    latestWeekly: WeeklyReportData | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number | null): string {
    if (bytes === null || bytes === undefined) return '--';
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${parseFloat(value.toFixed(1))} ${units[i]}`;
}

function formatDate(iso: string | null): string {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(iso: string | null): string {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatRelativeTime(iso: string | null): string {
    if (!iso) return '--';
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return formatDate(iso);
}

function formatDuration(seconds: number | null): string {
    if (seconds === null || seconds === undefined) return '--';
    const hrs = seconds / 3600;
    if (hrs >= 1) {
        return `${hrs.toFixed(1)}h`;
    }
    const mins = seconds / 60;
    if (mins >= 1) {
        return `${Math.round(mins)}m`;
    }
    return `${Math.round(seconds)}s`;
}

function formatDurationLong(seconds: number | null): string {
    if (seconds === null || seconds === undefined) return '--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    if (m > 0) return `${m}m`;
    return `${Math.round(seconds)}s`;
}

function healthColor(percent: number | null): string {
    if (percent === null) return '#9ca3af';
    if (percent > 90) return '#22c55e';
    if (percent > 80) return '#eab308';
    return '#ef4444';
}

function healthColorClass(percent: number | null): string {
    if (percent === null) return 'text-gray-400';
    if (percent > 90) return 'text-green-500';
    if (percent > 80) return 'text-yellow-500';
    return 'text-red-500';
}

function healthBgClass(percent: number | null): string {
    if (percent === null) return 'bg-gray-100';
    if (percent > 90) return 'bg-green-50';
    if (percent > 80) return 'bg-yellow-50';
    return 'bg-red-50';
}

function tempColor(temp: number | null): string {
    if (temp === null) return 'text-gray-400';
    if (temp < 35) return 'text-green-500';
    if (temp < 40) return 'text-yellow-500';
    return 'text-red-500';
}

function truncateId(id: string, len = 12): string {
    if (id.length <= len) return id;
    return id.slice(0, len) + '...';
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const sectionFade = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="ml-2 inline-flex items-center rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Copy device ID"
        >
            {copied ? (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
            )}
        </button>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-baseline justify-between py-3 border-b border-gray-100 last:border-b-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900 text-right">{value ?? '--'}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Health Ring (SVG circular progress)
// ---------------------------------------------------------------------------

function HealthRing({ percent }: { percent: number | null }) {
    const size = 140;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const value = percent ?? 0;
    const offset = circumference - (value / 100) * circumference;
    const color = healthColor(percent);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={percent !== null ? offset : circumference}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-bold ${healthColorClass(percent)}`}>
                    {percent !== null ? `${percent}%` : '--'}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">Health</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Battery Level Bar
// ---------------------------------------------------------------------------

function BatteryLevelBar({ percent }: { percent: number | null }) {
    const value = percent ?? 0;
    let barColor = 'bg-green-500';
    if (value <= 20) barColor = 'bg-red-500';
    else if (value <= 50) barColor = 'bg-yellow-500';

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-500">Battery Level</span>
                <span className="text-sm font-semibold text-gray-900">
                    {percent !== null ? `${percent}%` : '--'}
                </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// SVG Line Chart for battery health over time
// ---------------------------------------------------------------------------

interface ChartPoint {
    x: number;
    y: number;
    date: string;
    health: number;
    cycles: number | null;
}

function BatteryHealthChart({ snapshots }: { snapshots: BatterySnapshotData[] }) {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const sorted = useMemo(
        () =>
            [...snapshots]
                .filter((s) => s.health_percent !== null)
                .sort((a, b) => new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()),
        [snapshots],
    );

    if (sorted.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-400">
                No health data available yet
            </div>
        );
    }

    const padding = { top: 24, right: 24, bottom: 48, left: 48 };
    const width = 720;
    const height = 280;
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const healthValues = sorted.map((s) => s.health_percent!);
    const yMin = Math.max(Math.floor(Math.min(...healthValues) / 5) * 5 - 5, 0);
    const yMax = 100;

    const times = sorted.map((s) => new Date(s.reported_at).getTime());
    const xMin = times[0];
    const xMax = times[times.length - 1];
    const xRange = xMax - xMin || 1;

    const points: ChartPoint[] = sorted.map((s, i) => ({
        x: padding.left + ((times[i] - xMin) / xRange) * innerW,
        y: padding.top + (1 - (s.health_percent! - yMin) / (yMax - yMin)) * innerH,
        date: formatDate(s.reported_at),
        health: s.health_percent!,
        cycles: s.cycle_count,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    // Y-axis ticks
    const yTickCount = 5;
    const yTicks: number[] = [];
    for (let i = 0; i <= yTickCount; i++) {
        yTicks.push(yMin + ((yMax - yMin) / yTickCount) * i);
    }

    // X-axis labels (up to 6)
    const xLabelCount = Math.min(sorted.length, 6);
    const xLabels: { x: number; label: string }[] = [];
    for (let i = 0; i < xLabelCount; i++) {
        const idx = Math.round((i / (xLabelCount - 1 || 1)) * (sorted.length - 1));
        xLabels.push({
            x: points[idx].x,
            label: formatDate(sorted[idx].reported_at),
        });
    }

    // Gradient colors based on health
    const gradientId = 'healthGrad';

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full"
                style={{ minWidth: 400 }}
                onMouseLeave={() => setActiveIdx(null)}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        {points.map((p, i) => (
                            <stop
                                key={i}
                                offset={`${(i / (points.length - 1 || 1)) * 100}%`}
                                stopColor={healthColor(p.health)}
                            />
                        ))}
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0071e3" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {yTicks.map((t) => {
                    const yy = padding.top + (1 - (t - yMin) / (yMax - yMin)) * innerH;
                    return (
                        <g key={t}>
                            <line
                                x1={padding.left}
                                y1={yy}
                                x2={width - padding.right}
                                y2={yy}
                                stroke="#f3f4f6"
                                strokeWidth={1}
                            />
                            <text
                                x={padding.left - 8}
                                y={yy + 4}
                                textAnchor="end"
                                className="fill-gray-400"
                                fontSize={11}
                            >
                                {Math.round(t)}%
                            </text>
                        </g>
                    );
                })}

                {/* X-axis labels */}
                {xLabels.map((lbl, i) => (
                    <text
                        key={i}
                        x={lbl.x}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-gray-400"
                        fontSize={10}
                    >
                        {lbl.label}
                    </text>
                ))}

                {/* Area fill */}
                {points.length > 1 && (
                    <path
                        d={`${linePath} L${points[points.length - 1].x},${padding.top + innerH} L${points[0].x},${padding.top + innerH} Z`}
                        fill="url(#areaGrad)"
                    />
                )}

                {/* Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Dots + hover targets */}
                {points.map((p, i) => (
                    <g key={i}>
                        {/* Invisible hover target */}
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={12}
                            fill="transparent"
                            onMouseEnter={() => setActiveIdx(i)}
                            className="cursor-pointer"
                        />
                        {/* Visible dot */}
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={activeIdx === i ? 5 : 3}
                            fill={healthColor(p.health)}
                            stroke="white"
                            strokeWidth={2}
                            className="transition-all duration-150"
                        />
                    </g>
                ))}

                {/* Tooltip */}
                {activeIdx !== null && points[activeIdx] && (() => {
                    const p = points[activeIdx];
                    const tooltipW = 140;
                    const tooltipH = 52;
                    let tx = p.x - tooltipW / 2;
                    if (tx < padding.left) tx = padding.left;
                    if (tx + tooltipW > width - padding.right) tx = width - padding.right - tooltipW;
                    const ty = p.y - tooltipH - 12;
                    return (
                        <g>
                            <rect
                                x={tx}
                                y={ty}
                                width={tooltipW}
                                height={tooltipH}
                                rx={8}
                                fill="white"
                                stroke="#e5e7eb"
                                strokeWidth={1}
                                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                            />
                            <text x={tx + 10} y={ty + 18} fontSize={11} className="fill-gray-500">
                                {p.date}
                            </text>
                            <text x={tx + 10} y={ty + 34} fontSize={12} fontWeight={600} className="fill-gray-900">
                                Health: {p.health}%
                            </text>
                            <text x={tx + 10} y={ty + 46} fontSize={10} className="fill-gray-400">
                                {p.cycles !== null ? `${p.cycles} cycles` : ''}
                            </text>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
}

// ---------------------------------------------------------------------------
// CPU Load Mini Bar
// ---------------------------------------------------------------------------

function CpuLoadBars({
    load1,
    load5,
    load15,
}: {
    load1: number | null;
    load5: number | null;
    load15: number | null;
}) {
    const maxLoad = 8;
    const bars = [
        { label: '1m', value: load1 },
        { label: '5m', value: load5 },
        { label: '15m', value: load15 },
    ];

    return (
        <div className="flex items-end gap-3">
            {bars.map((bar) => {
                const pct = bar.value !== null ? Math.min((bar.value / maxLoad) * 100, 100) : 0;
                let barColor = 'bg-green-400';
                if (bar.value !== null) {
                    if (bar.value > 4) barColor = 'bg-red-400';
                    else if (bar.value > 2) barColor = 'bg-yellow-400';
                }
                return (
                    <div key={bar.label} className="flex flex-col items-center gap-1">
                        <div className="relative h-12 w-5 overflow-hidden rounded-sm bg-gray-100">
                            <div
                                className={`absolute bottom-0 w-full rounded-sm ${barColor} transition-all duration-300`}
                                style={{ height: `${pct}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-400">{bar.label}</span>
                        <span className="text-xs font-medium text-gray-600">
                            {bar.value !== null ? bar.value.toFixed(1) : '--'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Power Split Stacked Bar
// ---------------------------------------------------------------------------

function PowerSplitBar({
    pluggedIn,
    onBattery,
}: {
    pluggedIn: number | null;
    onBattery: number | null;
}) {
    const total = (pluggedIn ?? 0) + (onBattery ?? 0);
    if (total === 0) {
        return <span className="text-sm text-gray-400">No data</span>;
    }
    const pluggedPct = ((pluggedIn ?? 0) / total) * 100;
    const batteryPct = ((onBattery ?? 0) / total) * 100;

    return (
        <div className="w-full">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="bg-[#0071e3] transition-all duration-300"
                    style={{ width: `${pluggedPct}%` }}
                    title={`Plugged in: ${formatDurationLong(pluggedIn)}`}
                />
                <div
                    className="bg-gray-300 transition-all duration-300"
                    style={{ width: `${batteryPct}%` }}
                    title={`On battery: ${formatDurationLong(onBattery)}`}
                />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#0071e3]" />
                    Plugged in {pluggedPct.toFixed(0)}%
                </span>
                <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-300" />
                    Battery {batteryPct.toFixed(0)}%
                </span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Coverage Indicator
// ---------------------------------------------------------------------------

function CoverageIndicator({ sampleCount }: { sampleCount: number | null }) {
    const totalMinutesInWeek = 10080;
    const pct = sampleCount !== null ? Math.min((sampleCount / totalMinutesInWeek) * 100, 100) : 0;
    let color = 'text-green-500';
    if (pct < 50) color = 'text-red-500';
    else if (pct < 80) color = 'text-yellow-500';

    return (
        <span className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-gray-900">
                {sampleCount !== null ? sampleCount.toLocaleString() : '--'}
            </span>
            <span className={`text-xs ${color}`}>({pct.toFixed(0)}% coverage)</span>
        </span>
    );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function Show({
    device,
    batterySnapshots,
    weeklyReports,
    latestSnapshot,
    latestWeekly,
}: ShowProps) {
    const deviceName = device.model_identifier || 'Unknown Device';

    const sortedWeekly = useMemo(
        () =>
            [...weeklyReports].sort(
                (a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime(),
            ),
        [weeklyReports],
    );

    return (
        <MainLayout>
            <Head title={`Device - ${deviceName}`} />

            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* -------------------------------------------------------- */}
                    {/* Page Header                                              */}
                    {/* -------------------------------------------------------- */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={sectionFade}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Back link */}
                        <Link
                            href={route('telemetry.index')}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ED]"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            All Devices
                        </Link>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                    {deviceName}
                                </h1>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                    {device.chip && (
                                        <>
                                            <span>{device.chip}</span>
                                            <span className="text-gray-300">&bull;</span>
                                        </>
                                    )}
                                    <span className="inline-flex items-center font-mono text-xs text-gray-400">
                                        {truncateId(device.device_id, 16)}
                                        <CopyButton text={device.device_id} />
                                    </span>
                                </div>
                            </div>

                            {device.app_version && (
                                <span className="inline-flex h-7 items-center rounded-full bg-[#0071e3]/10 px-3 text-xs font-semibold text-[#0071e3]">
                                    PBM v{device.app_version}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* -------------------------------------------------------- */}
                    {/* Device Info Card                                         */}
                    {/* -------------------------------------------------------- */}
                    <motion.section
                        className="mt-8"
                        initial="hidden"
                        animate="visible"
                        variants={sectionFade}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8">
                            <h2 className="text-lg font-semibold text-gray-900">Device Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                                <div>
                                    <InfoRow label="Chip" value={device.chip || '--'} />
                                    <InfoRow
                                        label="CPU Cores"
                                        value={
                                            device.cpu_core_count !== null ? (
                                                <span>
                                                    {device.cpu_core_count} total
                                                    {(device.cpu_perf_cores !== null || device.cpu_eff_cores !== null) && (
                                                        <span className="ml-1 text-gray-400">
                                                            ({device.cpu_perf_cores ?? '?'}P / {device.cpu_eff_cores ?? '?'}E)
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                '--'
                                            )
                                        }
                                    />
                                    <InfoRow label="RAM" value={formatBytes(device.ram_bytes)} />
                                    <InfoRow label="Disk" value={formatBytes(device.disk_total_bytes)} />
                                </div>
                                <div>
                                    <InfoRow
                                        label="OS"
                                        value={
                                            device.os_version ? (
                                                <span>
                                                    {device.os_version}
                                                    {device.os_build && (
                                                        <span className="ml-1 text-gray-400">
                                                            ({device.os_build})
                                                        </span>
                                                    )}
                                                </span>
                                            ) : (
                                                '--'
                                            )
                                        }
                                    />
                                    <InfoRow label="First Seen" value={formatDate(device.first_seen_at)} />
                                    <InfoRow
                                        label="Last Updated"
                                        value={
                                            <span>
                                                {formatDate(device.updated_at)}
                                                <span className="ml-1.5 text-xs text-gray-400">
                                                    ({formatRelativeTime(device.updated_at)})
                                                </span>
                                            </span>
                                        }
                                    />
                                    <InfoRow label="App Version" value={device.app_version ? `v${device.app_version}` : '--'} />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* -------------------------------------------------------- */}
                    {/* Current Battery Status                                   */}
                    {/* -------------------------------------------------------- */}
                    <motion.section
                        className="mt-8"
                        initial="hidden"
                        animate="visible"
                        variants={sectionFade}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Current Battery Status</h2>
                                {latestSnapshot && (
                                    <span className="text-xs text-gray-400">
                                        Last reported {formatRelativeTime(latestSnapshot.reported_at)}
                                    </span>
                                )}
                            </div>

                            {latestSnapshot ? (
                                <div className="mt-6">
                                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                                        {/* Health ring */}
                                        <div className="flex flex-col items-center">
                                            <HealthRing percent={latestSnapshot.health_percent} />
                                            {latestSnapshot.health_percent !== null && (
                                                <span className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${healthBgClass(latestSnapshot.health_percent)} ${healthColorClass(latestSnapshot.health_percent)}`}>
                                                    {latestSnapshot.health_percent > 90
                                                        ? 'Excellent'
                                                        : latestSnapshot.health_percent > 80
                                                          ? 'Good'
                                                          : 'Service Recommended'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Stats grid */}
                                        <div className="flex-1 w-full">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {/* Cycle Count */}
                                                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                                            <svg className="h-4 w-4 text-[#0071e3]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-500">Cycle Count</span>
                                                    </div>
                                                    <p className="mt-2 text-2xl font-bold text-gray-900">
                                                        {latestSnapshot.cycle_count !== null
                                                            ? latestSnapshot.cycle_count.toLocaleString()
                                                            : '--'}
                                                    </p>
                                                </div>

                                                {/* Capacity */}
                                                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                                                            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-500">Capacity</span>
                                                    </div>
                                                    <p className="mt-2 text-lg font-bold text-gray-900">
                                                        {latestSnapshot.max_capacity_mah !== null
                                                            ? `${latestSnapshot.max_capacity_mah.toLocaleString()} mAh`
                                                            : '--'}
                                                    </p>
                                                    {latestSnapshot.design_capacity_mah !== null && (
                                                        <p className="text-xs text-gray-400">
                                                            of {latestSnapshot.design_capacity_mah.toLocaleString()} mAh design
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Temperature */}
                                                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                                                            <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-gray-500">Temperature</span>
                                                    </div>
                                                    <p className={`mt-2 text-2xl font-bold ${tempColor(latestSnapshot.temperature_c)}`}>
                                                        {latestSnapshot.temperature_c !== null
                                                            ? `${latestSnapshot.temperature_c.toFixed(1)}\u00B0C`
                                                            : '--'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Battery level bar */}
                                            <div className="mt-5">
                                                <BatteryLevelBar percent={latestSnapshot.level_percent} />
                                            </div>

                                            {/* Charging status (only from initial snapshots) */}
                                            {latestSnapshot.report_type === 'initial' && (
                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    {latestSnapshot.is_charging !== null && (
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                                                latestSnapshot.is_charging
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    latestSnapshot.is_charging
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            />
                                                            {latestSnapshot.is_charging ? 'Charging' : 'Not Charging'}
                                                        </span>
                                                    )}
                                                    {latestSnapshot.is_plugged_in !== null && (
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                                                latestSnapshot.is_plugged_in
                                                                    ? 'bg-blue-50 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                    latestSnapshot.is_plugged_in
                                                                        ? 'bg-[#0071e3]'
                                                                        : 'bg-gray-400'
                                                                }`}
                                                            />
                                                            {latestSnapshot.is_plugged_in ? 'Plugged In' : 'On Battery'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 flex h-40 items-center justify-center rounded-xl bg-white text-sm text-gray-400">
                                    No battery snapshots received yet
                                </div>
                            )}
                        </div>
                    </motion.section>

                    {/* -------------------------------------------------------- */}
                    {/* Battery Health Over Time                                 */}
                    {/* -------------------------------------------------------- */}
                    <motion.section
                        className="mt-8"
                        initial="hidden"
                        animate="visible"
                        variants={sectionFade}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="rounded-2xl bg-gray-50 p-6 sm:p-8">
                            <h2 className="text-lg font-semibold text-gray-900">Battery Health Over Time</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Health percentage tracked across all snapshots
                            </p>
                            <div className="mt-6">
                                <BatteryHealthChart snapshots={batterySnapshots} />
                            </div>
                        </div>
                    </motion.section>

                    {/* -------------------------------------------------------- */}
                    {/* Weekly Reports History                                   */}
                    {/* -------------------------------------------------------- */}
                    <motion.section
                        className="mt-8 pb-16"
                        initial="hidden"
                        animate="visible"
                        variants={sectionFade}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-lg font-semibold text-gray-900">Weekly Reports</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Aggregated usage data collected weekly by PBM
                        </p>

                        {sortedWeekly.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {sortedWeekly.map((report) => {
                                    const periodLabel = `${formatDate(report.period_start)} - ${formatDate(report.period_end)}`;
                                    return (
                                        <div
                                            key={report.id}
                                            className="rounded-2xl bg-gray-50 p-5 sm:p-6 transition-shadow hover:shadow-md"
                                        >
                                            {/* Report header */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {periodLabel}
                                                    </h3>
                                                    <p className="text-xs text-gray-400">
                                                        Reported {formatDateTime(report.reported_at)}
                                                        {report.app_version && (
                                                            <span className="ml-2 text-gray-300">
                                                                v{report.app_version}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <CoverageIndicator sampleCount={report.sample_count} />
                                            </div>

                                            {/* Report body grid */}
                                            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {/* CPU Load */}
                                                <div>
                                                    <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                        CPU Load
                                                    </span>
                                                    <div className="mt-2">
                                                        <CpuLoadBars
                                                            load1={report.cpu_load_1min}
                                                            load5={report.cpu_load_5min}
                                                            load15={report.cpu_load_15min}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Screen Time & App Uptime */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                            Screen Time
                                                        </span>
                                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                                            {formatDuration(report.screen_on_seconds)}
                                                        </p>
                                                        {report.screen_time_method && (
                                                            <p className="text-[10px] text-gray-400">
                                                                via {report.screen_time_method}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                            App Uptime
                                                        </span>
                                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                                            {formatDuration(report.app_uptime_seconds)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Power Split & Charge Sessions */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                            Power Distribution
                                                        </span>
                                                        <div className="mt-2">
                                                            <PowerSplitBar
                                                                pluggedIn={report.plugged_in_seconds}
                                                                onBattery={report.on_battery_seconds}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                            Charge Sessions
                                                        </span>
                                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                                            {report.charge_sessions !== null
                                                                ? report.charge_sessions
                                                                : '--'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-6 flex h-40 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-400">
                                No weekly reports received yet
                            </div>
                        )}
                    </motion.section>
                </div>
            </div>
        </MainLayout>
    );
}
