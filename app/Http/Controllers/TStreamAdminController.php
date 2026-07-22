<?php

namespace App\Http\Controllers;

use App\Models\TstreamAccount;
use App\Models\TstreamSession;
use App\Models\TstreamVehicle;
use App\Services\TStreamBillingService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TStreamAdminController extends Controller
{
    public function index(): Response
    {
        $totalAccounts = TstreamAccount::count();
        $premiumAccounts = TstreamAccount::where('plan', 'premium')->count();

        $stats = [
            'total_accounts' => $totalAccounts,
            'premium_accounts' => $premiumAccounts,
            'free_accounts' => $totalAccounts - $premiumAccounts,
            'mrr' => round($premiumAccounts * TStreamBillingService::MONTHLY_PRICE_CENTS / 100, 2),
            'new_last_30_days' => TstreamAccount::where('created_at', '>=', now()->subDays(30))->count(),
            'active_last_7_days' => TstreamAccount::where('last_seen_at', '>=', now()->subDays(7))->count(),
        ];

        $usage = [
            'total_sessions' => TstreamSession::count(),
            'total_minutes' => (int) round(TstreamSession::sum('duration_sec') / 60),
            'avg_session_minutes' => round((TstreamSession::avg('duration_sec') ?? 0) / 60, 1),
            'sessions_last_7_days' => TstreamSession::where('created_at', '>=', now()->subDays(7))->count(),
            'quality_breakdown' => TstreamSession::select('quality', DB::raw('count(*) as count'))
                ->whereNotNull('quality')
                ->groupBy('quality')
                ->pluck('count', 'quality'),
        ];

        $vehicles = [
            'by_model' => TstreamVehicle::select('model', DB::raw('count(*) as count'))
                ->groupBy('model')
                ->orderByDesc('count')
                ->pluck('count', 'model'),
            'by_year' => TstreamVehicle::select('year', DB::raw('count(*) as count'))
                ->groupBy('year')
                ->orderBy('year')
                ->pluck('count', 'year'),
        ];

        $recentAccounts = TstreamAccount::with('vehicle')
            ->latest()
            ->take(15)
            ->get()
            ->map(fn ($account) => [
                'id' => $account->id,
                'email' => $account->email,
                'name' => $account->name,
                'plan' => $account->plan,
                'platform' => $account->platform,
                'auth_provider' => $account->auth_provider,
                'vehicle' => $account->vehicle
                    ? "{$account->vehicle->year} {$account->vehicle->model}"
                    : null,
                'last_seen_at' => $account->last_seen_at?->diffForHumans(),
                'created_at' => $account->created_at->format('M j, Y'),
            ]);

        return Inertia::render('TStream/Admin', [
            'stats' => $stats,
            'usage' => $usage,
            'vehicles' => $vehicles,
            'recentAccounts' => $recentAccounts,
        ]);
    }
}
