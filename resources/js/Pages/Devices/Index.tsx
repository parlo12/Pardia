import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';

interface LinkedDevice {
    device_id: string;
    model_identifier: string | null;
    chip: string | null;
    ram_bytes: number | null;
    disk_total_bytes: number | null;
    os_version: string | null;
    app_version: string | null;
    first_seen_at: string;
    nickname: string | null;
    linked_at: string;
    battery_health: number | null;
    cycle_count: number | null;
    max_capacity_mah: number | null;
    design_capacity_mah: number | null;
    snapshot_count: number;
}

interface Props {
    devices: LinkedDevice[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

function getHealthColor(health: number | null): string {
    if (health === null) return 'text-gray-400';
    if (health >= 80) return 'text-emerald-600';
    if (health >= 50) return 'text-amber-500';
    return 'text-red-500';
}

function getHealthBg(health: number | null): string {
    if (health === null) return 'bg-gray-100';
    if (health >= 80) return 'bg-emerald-50';
    if (health >= 50) return 'bg-amber-50';
    return 'bg-red-50';
}

function getHealthLabel(health: number | null): string {
    if (health === null) return 'Unknown';
    if (health >= 80) return 'Good';
    if (health >= 50) return 'Fair';
    return 'Poor';
}

function getHealthRingColor(health: number | null): string {
    if (health === null) return '#d1d5db';
    if (health >= 80) return '#059669';
    if (health >= 50) return '#f59e0b';
    return '#ef4444';
}

function formatBytes(bytes: number | null): string {
    if (!bytes) return '—';
    const gb = bytes / (1024 * 1024 * 1024);
    return gb >= 1000 ? `${(gb / 1024).toFixed(1)} TB` : `${Math.round(gb)} GB`;
}

function HealthRing({ health, size = 80 }: { health: number | null; size?: number }) {
    const stroke = 6;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = health ?? 0;
    const offset = circumference - (percent / 100) * circumference;
    const color = getHealthRingColor(health);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="#f3f4f6" strokeWidth={stroke}
                />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-lg font-bold ${getHealthColor(health)}`}>
                    {health !== null ? `${Math.round(health)}%` : '—'}
                </span>
            </div>
        </div>
    );
}

function DeviceCard({ device }: { device: LinkedDevice }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, patch, processing } = useForm({
        nickname: device.nickname || '',
    });

    const handleRename = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('devices.update', device.device_id), {
            onSuccess: () => setEditing(false),
        });
    };

    const handleUnlink = () => {
        if (confirm('Unlink this device? You can always re-link it later.')) {
            router.delete(route('devices.destroy', device.device_id));
        }
    };

    const alerts: { message: string; severity: 'warning' | 'critical' }[] = [];
    if (device.battery_health !== null && device.battery_health < 50) {
        alerts.push({ message: 'Battery health is critically low — replacement recommended', severity: 'critical' });
    } else if (device.battery_health !== null && device.battery_health < 80) {
        alerts.push({ message: 'Battery is showing signs of wear', severity: 'warning' });
    }
    if (device.cycle_count !== null && device.cycle_count > 1000) {
        alerts.push({ message: `High cycle count (${device.cycle_count}) — battery may need replacement`, severity: 'warning' });
    }

    return (
        <motion.div
            variants={fadeInUp}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
        >
            <div className="flex items-start gap-5">
                {/* Health Ring */}
                <div className="flex-shrink-0">
                    <HealthRing health={device.battery_health} />
                </div>

                {/* Device Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            {editing ? (
                                <form onSubmit={handleRename} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={data.nickname}
                                        onChange={(e) => setData('nickname', e.target.value)}
                                        className="rounded-lg border-0 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#0071e3]"
                                        autoFocus
                                    />
                                    <button type="submit" disabled={processing} className="text-xs text-[#0071e3] font-medium">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="text-xs text-gray-400">
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {device.nickname || device.model_identifier || 'Unknown Device'}
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="ml-2 text-gray-300 hover:text-gray-500 transition-colors"
                                        title="Rename"
                                    >
                                        <svg className="inline h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                        </svg>
                                    </button>
                                </h3>
                            )}
                            {device.model_identifier && device.nickname && (
                                <p className="text-sm text-gray-500">{device.model_identifier}</p>
                            )}
                        </div>

                        {/* Health Badge */}
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getHealthBg(device.battery_health)} ${getHealthColor(device.battery_health)}`}>
                            {getHealthLabel(device.battery_health)}
                        </span>
                    </div>

                    {/* Specs Grid */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Stat label="Chip" value={device.chip || '—'} />
                        <Stat label="RAM" value={formatBytes(device.ram_bytes)} />
                        <Stat label="Cycles" value={device.cycle_count?.toString() || '—'} />
                        <Stat label="macOS" value={device.os_version || '—'} />
                    </div>

                    {/* Capacity Bar */}
                    {device.max_capacity_mah && device.design_capacity_mah && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Battery Capacity</span>
                                <span>{device.max_capacity_mah} / {device.design_capacity_mah} mAh</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min(100, (device.max_capacity_mah / device.design_capacity_mah) * 100)}%`,
                                        backgroundColor: getHealthRingColor(device.battery_health),
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {alerts.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {alerts.map((alert, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                                        alert.severity === 'critical'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}
                                >
                                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    {alert.message}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-4">
                        <Link
                            href={route('products.index')}
                            className="text-xs font-medium text-[#0071e3] hover:text-[#0077ED] transition-colors"
                        >
                            View Recommended Products
                        </Link>
                        <button
                            onClick={handleUnlink}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Unlink Device
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900 truncate">{value}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-md text-center py-20"
        >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
                <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No devices linked</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Link your Mac to get personalized product recommendations based on real diagnostic data from Pardia Battery Management.
            </p>
            <Link
                href={route('devices.link')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0077ED]"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Link a Device
            </Link>
        </motion.div>
    );
}

export default function DevicesIndex({ devices }: Props) {
    return (
        <MainLayout>
            <Head title="My Devices" />

            <section className="bg-[#f5f5f7] min-h-screen">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                My Devices
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {devices.length > 0
                                    ? `${devices.length} device${devices.length !== 1 ? 's' : ''} linked to your account`
                                    : 'Link a device to get started'
                                }
                            </p>
                        </div>
                        {devices.length > 0 && (
                            <Link
                                href={route('devices.link')}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0077ED]"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Link Device
                            </Link>
                        )}
                    </motion.div>

                    {/* Devices List */}
                    {devices.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.1 } },
                            }}
                            className="space-y-4"
                        >
                            {devices.map((device) => (
                                <DeviceCard key={device.device_id} device={device} />
                            ))}
                        </motion.div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
