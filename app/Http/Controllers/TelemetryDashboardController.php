<?php

namespace App\Http\Controllers;

use App\Models\BatterySnapshot;
use App\Models\Device;
use App\Models\WeeklyReport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TelemetryDashboardController extends Controller
{
    public function index()
    {
        $devices = Device::query()
            ->with('registration')
            ->select('devices.*')
            ->addSelect([
                'latest_battery_health' => BatterySnapshot::select('health_percent')
                    ->whereColumn('device_id', 'devices.device_id')
                    ->latest('reported_at')
                    ->limit(1),
                'latest_cycle_count' => BatterySnapshot::select('cycle_count')
                    ->whereColumn('device_id', 'devices.device_id')
                    ->latest('reported_at')
                    ->limit(1),
                'latest_report_at' => BatterySnapshot::select('reported_at')
                    ->whereColumn('device_id', 'devices.device_id')
                    ->latest('reported_at')
                    ->limit(1),
                'snapshot_count' => BatterySnapshot::selectRaw('count(*)')
                    ->whereColumn('device_id', 'devices.device_id'),
                'weekly_count' => WeeklyReport::selectRaw('count(*)')
                    ->whereColumn('device_id', 'devices.device_id'),
            ])
            ->orderByDesc('updated_at')
            ->paginate(20);

        // Fleet stats
        $totalDevices = Device::count();
        $avgHealth = BatterySnapshot::whereIn('id', function ($q) {
            $q->selectRaw('MAX(id)')
                ->from('battery_snapshots')
                ->groupBy('device_id');
        })->avg('health_percent');

        $chipDistribution = Device::select('chip', DB::raw('count(*) as count'))
            ->whereNotNull('chip')
            ->groupBy('chip')
            ->orderByDesc('count')
            ->get();

        $modelDistribution = Device::select('model_identifier', DB::raw('count(*) as count'))
            ->whereNotNull('model_identifier')
            ->groupBy('model_identifier')
            ->orderByDesc('count')
            ->get();

        return Inertia::render('Telemetry/Index', [
            'devices' => $devices,
            'stats' => [
                'total_devices' => $totalDevices,
                'avg_health' => round((float) $avgHealth, 1),
                'chip_distribution' => $chipDistribution,
                'model_distribution' => $modelDistribution,
            ],
        ]);
    }

    public function show(string $deviceId)
    {
        $device = Device::with('registration')->where('device_id', $deviceId)->firstOrFail();

        $batterySnapshots = BatterySnapshot::where('device_id', $deviceId)
            ->orderBy('reported_at')
            ->get();

        $weeklyReports = WeeklyReport::where('device_id', $deviceId)
            ->orderByDesc('reported_at')
            ->get();

        $latestSnapshot = $batterySnapshots->last();
        $latestWeekly = $weeklyReports->first();

        return Inertia::render('Telemetry/Show', [
            'device' => $device,
            'batterySnapshots' => $batterySnapshots,
            'weeklyReports' => $weeklyReports,
            'latestSnapshot' => $latestSnapshot,
            'latestWeekly' => $latestWeekly,
        ]);
    }
}
