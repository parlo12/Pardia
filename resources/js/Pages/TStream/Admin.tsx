import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

interface Stats {
    total_accounts: number;
    premium_accounts: number;
    free_accounts: number;
    mrr: number;
    new_last_30_days: number;
    active_last_7_days: number;
}

interface Usage {
    total_sessions: number;
    total_minutes: number;
    avg_session_minutes: number;
    sessions_last_7_days: number;
    quality_breakdown: Record<string, number>;
}

interface Vehicles {
    by_model: Record<string, number>;
    by_year: Record<string, number>;
}

interface RecentAccount {
    id: number;
    email: string | null;
    name: string | null;
    plan: string;
    platform: string;
    auth_provider: string | null;
    vehicle: string | null;
    last_seen_at: string | null;
    created_at: string;
}

interface Props {
    stats: Stats;
    usage: Usage;
    vehicles: Vehicles;
    recentAccounts: RecentAccount[];
}

function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
    return (
        <div className={`rounded-2xl border p-6 ${accent ? 'border-red-600/60 bg-red-600/10' : 'border-white/10 bg-white/5'}`}>
            <div className="text-sm uppercase tracking-wider text-white/50">{label}</div>
            <div className="mt-2 text-3xl font-extrabold text-white">{value}</div>
        </div>
    );
}

function BarChart({ title, data }: { title: string; data: Record<string, number> }) {
    const entries = Object.entries(data);
    const max = Math.max(1, ...entries.map(([, count]) => count));
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold text-white">{title}</h3>
            <div className="mt-4 space-y-2">
                {entries.length === 0 && <p className="text-sm text-white/40">No data yet</p>}
                {entries.map(([label, count]) => (
                    <div key={label} className="flex items-center gap-3 text-sm">
                        <span className="w-24 shrink-0 text-white/60">{label}</span>
                        <div className="h-4 flex-1 overflow-hidden rounded bg-white/10">
                            <div className="h-full bg-red-600" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        <span className="w-8 text-right text-white/80">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Admin({ stats, usage, vehicles, recentAccounts }: Props) {
    return (
        <MainLayout>
            <Head title="T-Stream Admin" />
            <div className="min-h-screen bg-black py-24 text-white">
                <div className="mx-auto max-w-6xl px-6">
                    <h1 className="text-3xl font-bold">
                        T-<span className="text-red-600">Stream</span> Dashboard
                    </h1>

                    {/* Accounts */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <StatCard label="Total users" value={stats.total_accounts} />
                        <StatCard label="Paid users" value={stats.premium_accounts} accent />
                        <StatCard label="Free users" value={stats.free_accounts} />
                        <StatCard label="MRR" value={`$${stats.mrr.toFixed(2)}`} accent />
                        <StatCard label="New (30d)" value={stats.new_last_30_days} />
                        <StatCard label="Active (7d)" value={stats.active_last_7_days} />
                    </div>

                    {/* Usage */}
                    <h2 className="mt-12 text-xl font-semibold">Usage</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-4">
                        <StatCard label="Total streams" value={usage.total_sessions} />
                        <StatCard label="Minutes streamed" value={usage.total_minutes.toLocaleString()} />
                        <StatCard label="Avg session (min)" value={usage.avg_session_minutes} />
                        <StatCard label="Streams (7d)" value={usage.sessions_last_7_days} />
                    </div>

                    {/* Breakdown charts */}
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        <BarChart title="Fleet by model" data={vehicles.by_model} />
                        <BarChart title="Fleet by year" data={vehicles.by_year} />
                        <BarChart title="Stream quality used" data={usage.quality_breakdown} />
                    </div>

                    {/* Recent accounts */}
                    <h2 className="mt-12 text-xl font-semibold">Recent accounts</h2>
                    <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-white/50">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Vehicle</th>
                                    <th className="px-4 py-3">Sign-in</th>
                                    <th className="px-4 py-3">Last seen</th>
                                    <th className="px-4 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentAccounts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-white/40">
                                            No accounts yet — they&apos;ll appear as soon as someone signs in on the app.
                                        </td>
                                    </tr>
                                )}
                                {recentAccounts.map((account) => (
                                    <tr key={account.id}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{account.name ?? '—'}</div>
                                            <div className="text-white/50">{account.email ?? 'anonymous'}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                                                    account.plan === 'premium'
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-white/10 text-white/60'
                                                }`}
                                            >
                                                {account.plan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/70">{account.vehicle ?? '—'}</td>
                                        <td className="px-4 py-3 text-white/70">{account.auth_provider ?? account.platform}</td>
                                        <td className="px-4 py-3 text-white/70">{account.last_seen_at ?? '—'}</td>
                                        <td className="px-4 py-3 text-white/70">{account.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
