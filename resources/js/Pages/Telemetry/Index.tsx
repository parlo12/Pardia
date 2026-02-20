import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';
import { PaginatedData } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DeviceRow {
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
    updated_at: string;
    latest_battery_health: number | null;
    latest_cycle_count: number | null;
    latest_report_at: string | null;
    snapshot_count: number;
    weekly_count: number;
}

interface Stats {
    total_devices: number;
    avg_health: number;
    chip_distribution: { chip: string; count: number }[];
    model_distribution: { model_identifier: string; count: number }[];
}

interface TelemetryIndexProps {
    devices: PaginatedData<DeviceRow>;
    stats: Stats;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number | null): string {
    if (bytes === null || bytes === 0) return '--';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let value = bytes;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    return `${Math.round(value * 10) / 10} ${units[unitIndex]}`;
}

function relativeTime(dateString: string | null): string {
    if (!dateString) return '--';
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diffMs = now - then;

    if (diffMs < 0) return 'just now';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (seconds < 60) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (weeks === 1) return '1 week ago';
    if (weeks < 5) return `${weeks} weeks ago`;
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '--';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function truncateId(id: string): string {
    if (id.length <= 12) return id;
    return id.slice(0, 6) + '...' + id.slice(-4);
}

function healthColor(health: number | null): {
    bg: string;
    text: string;
    dot: string;
} {
    if (health === null) return { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' };
    if (health > 90)
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    if (health > 80)
        return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
    return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
}

function healthStatColor(avg: number): string {
    if (avg > 90) return 'text-emerald-600';
    if (avg > 80) return 'text-amber-600';
    return 'text-red-600';
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
    label,
    value,
    subtitle,
    icon,
    valueClassName,
}: {
    label: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    valueClassName?: string;
}) {
    return (
        <motion.div
            variants={fadeIn}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p
                        className={`mt-2 text-3xl font-semibold tracking-tight ${
                            valueClassName || 'text-gray-900'
                        }`}
                    >
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f7] text-gray-500">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

function HealthBadge({ health }: { health: number | null }) {
    const colors = healthColor(health);
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {health !== null ? `${health}%` : 'N/A'}
        </span>
    );
}

function DistributionSection({
    title,
    items,
    labelKey,
}: {
    title: string;
    items: { [key: string]: string | number }[];
    labelKey: string;
}) {
    if (!items || items.length === 0) return null;

    const maxCount = Math.max(...items.map((i) => Number(i.count)));

    return (
        <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
            <div className="space-y-2">
                {items.map((item, idx) => {
                    const label = String(item[labelKey] || 'Unknown');
                    const count = Number(item.count);
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                        <div key={idx} className="group">
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700">{label}</span>
                                <span className="tabular-nums text-gray-400">{count}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                <motion.div
                                    className="h-full rounded-full bg-[#0071e3]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24"
        >
            <svg
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
            </svg>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                No devices reporting yet
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
                Once PBM devices start sending telemetry data, they will appear here with
                battery health, cycle counts, and more.
            </p>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function Index({ devices, stats }: TelemetryIndexProps) {
    const hasDevices = devices.data.length > 0;
    const { meta, links } = devices;

    return (
        <MainLayout>
            <Head title="Telemetry Dashboard" />

            <div className="min-h-screen bg-[#fbfbfd]">
                {/* Header */}
                <div className="border-b border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                Telemetry Dashboard
                            </h1>
                            <p className="mt-3 text-lg text-gray-500">
                                Monitor your PBM fleet — battery health, hardware specs, and
                                reporting activity at a glance.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* Fleet Overview Stats */}
                    <motion.div
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                    >
                        <StatCard
                            label="Total Devices"
                            value={stats.total_devices}
                            subtitle="Active fleet"
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Avg Battery Health"
                            value={`${Math.round(stats.avg_health)}%`}
                            subtitle="Across all devices"
                            valueClassName={healthStatColor(stats.avg_health)}
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Chip Types"
                            value={stats.chip_distribution.length}
                            subtitle="Unique silicon"
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Models Tracked"
                            value={stats.model_distribution.length}
                            subtitle="Hardware models"
                            icon={
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                </svg>
                            }
                        />
                    </motion.div>

                    {/* Chip & Model Distribution */}
                    {(stats.chip_distribution.length > 0 ||
                        stats.model_distribution.length > 0) && (
                        <motion.div
                            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <DistributionSection
                                    title="Chip Distribution"
                                    items={stats.chip_distribution}
                                    labelKey="chip"
                                />
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <DistributionSection
                                    title="Model Distribution"
                                    items={stats.model_distribution}
                                    labelKey="model_identifier"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Device List */}
                    <motion.div
                        className="mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Devices
                            </h2>
                            {hasDevices && (
                                <span className="text-sm text-gray-400">
                                    {meta.total} device{meta.total !== 1 ? 's' : ''} total
                                </span>
                            )}
                        </div>

                        {!hasDevices ? (
                            <EmptyState />
                        ) : (
                            <>
                                {/* Table */}
                                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-[#fafafa]">
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Device
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        OS
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Battery Health
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Cycle Count
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Reports
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Last Report
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        First Seen
                                                    </th>
                                                    <th className="whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        <span className="sr-only">Action</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {devices.data.map((device, idx) => (
                                                    <tr
                                                        key={device.device_id}
                                                        className={`transition-colors hover:bg-blue-50/40 ${
                                                            idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <Link
                                                                href={route('telemetry.show', device.device_id)}
                                                                className="block"
                                                            >
                                                                <div className="font-medium text-gray-900">
                                                                    {device.model_identifier || 'Unknown Model'}
                                                                </div>
                                                                {device.chip && (
                                                                    <div className="mt-0.5 text-xs text-gray-500">
                                                                        {device.chip}
                                                                    </div>
                                                                )}
                                                                <div className="mt-1 font-mono text-[11px] text-gray-400">
                                                                    {truncateId(device.device_id)}
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                                                            {device.os_version || '--'}
                                                            {device.os_build && (
                                                                <span className="ml-1 text-xs text-gray-400">
                                                                    ({device.os_build})
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <HealthBadge health={device.latest_battery_health} />
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 tabular-nums text-gray-700">
                                                            {device.latest_cycle_count !== null
                                                                ? device.latest_cycle_count.toLocaleString()
                                                                : '--'}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                <span
                                                                    className="inline-flex items-center gap-1"
                                                                    title="Snapshots"
                                                                >
                                                                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                                                    </svg>
                                                                    <span className="tabular-nums">{device.snapshot_count}</span>
                                                                </span>
                                                                <span
                                                                    className="inline-flex items-center gap-1"
                                                                    title="Weekly reports"
                                                                >
                                                                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                                    </svg>
                                                                    <span className="tabular-nums">{device.weekly_count}</span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {relativeTime(device.latest_report_at)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {formatDate(device.first_seen_at)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                                            <Link
                                                                href={route('telemetry.show', device.device_id)}
                                                                className="inline-flex items-center gap-1 text-sm font-medium text-[#0071e3] transition-colors hover:text-[#0077ED]"
                                                            >
                                                                View
                                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                                </svg>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {meta.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Page {meta.current_page} of {meta.last_page}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            {links.prev ? (
                                                <Link
                                                    href={links.prev}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                    </svg>
                                                    Previous
                                                </Link>
                                            ) : (
                                                <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                    </svg>
                                                    Previous
                                                </span>
                                            )}
                                            {links.next ? (
                                                <Link
                                                    href={links.next}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
                                                >
                                                    Next
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </Link>
                                            ) : (
                                                <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300">
                                                    Next
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
