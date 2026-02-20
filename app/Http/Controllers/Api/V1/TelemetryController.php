<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BatterySnapshot;
use App\Models\Device;
use App\Models\WeeklyReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TelemetryController extends Controller
{
    public function initial(Request $request): JsonResponse
    {
        $request->validate([
            'report_type' => 'required|string|in:initial',
            'device_id' => 'required|uuid',
            'timestamp' => 'required|date',
            'app_version' => 'required|string',
            'os_version' => 'nullable|string',
            'os_build' => 'nullable|string',
            'hardware' => 'required|array',
            'hardware.model_identifier' => 'nullable|string',
            'hardware.chip' => 'nullable|string',
            'hardware.cpu_core_count' => 'nullable|integer',
            'hardware.cpu_performance_cores' => 'nullable|integer',
            'hardware.cpu_efficiency_cores' => 'nullable|integer',
            'hardware.ram_bytes' => 'nullable|integer',
            'hardware.disk_total_bytes' => 'nullable|integer',
            'battery' => 'required|array',
            'battery.health_percent' => 'nullable|numeric',
            'battery.cycle_count' => 'nullable|integer',
            'battery.design_capacity_mah' => 'nullable|integer',
            'battery.max_capacity_mah' => 'nullable|integer',
            'battery.current_capacity_mah' => 'nullable|integer',
            'battery.level_percent' => 'nullable|integer|min:0|max:100',
            'battery.temperature_celsius' => 'nullable|numeric',
            'battery.is_charging' => 'nullable|boolean',
            'battery.is_plugged_in' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($request) {
            $hardware = $request->input('hardware');
            $deviceData = [
                'model_identifier' => $hardware['model_identifier'] ?? null,
                'chip' => $hardware['chip'] ?? null,
                'cpu_core_count' => $hardware['cpu_core_count'] ?? null,
                'cpu_perf_cores' => $hardware['cpu_performance_cores'] ?? null,
                'cpu_eff_cores' => $hardware['cpu_efficiency_cores'] ?? null,
                'ram_bytes' => $hardware['ram_bytes'] ?? null,
                'disk_total_bytes' => $hardware['disk_total_bytes'] ?? null,
                'os_version' => $request->input('os_version'),
                'os_build' => $request->input('os_build'),
                'app_version' => $request->input('app_version'),
            ];

            // Upsert device — handles reinstalls sending duplicate initial reports
            $device = Device::find($request->input('device_id'));
            if ($device) {
                $device->update($deviceData);
            } else {
                $deviceData['device_id'] = $request->input('device_id');
                $deviceData['first_seen_at'] = now();
                Device::create($deviceData);
            }

            $battery = $request->input('battery');

            BatterySnapshot::create([
                'device_id' => $request->input('device_id'),
                'report_type' => 'initial',
                'reported_at' => $request->input('timestamp'),
                'health_percent' => $battery['health_percent'] ?? null,
                'cycle_count' => $battery['cycle_count'] ?? null,
                'design_capacity_mah' => $battery['design_capacity_mah'] ?? null,
                'max_capacity_mah' => $battery['max_capacity_mah'] ?? null,
                'current_capacity_mah' => $battery['current_capacity_mah'] ?? null,
                'level_percent' => $battery['level_percent'] ?? null,
                'temperature_c' => $battery['temperature_celsius'] ?? null,
                'is_charging' => $battery['is_charging'] ?? null,
                'is_plugged_in' => $battery['is_plugged_in'] ?? null,
            ]);
        });

        Log::info('PBM initial report received', ['device_id' => $request->input('device_id')]);

        return response()->json(['status' => 'ok'], 200);
    }

    public function weekly(Request $request): JsonResponse
    {
        $request->validate([
            'report_type' => 'required|string|in:weekly',
            'device_id' => 'required|uuid',
            'timestamp' => 'required|date',
            'period_start' => 'required|date',
            'period_end' => 'required|date',
            'app_version' => 'required|string',
            'battery' => 'required|array',
            'battery.health_percent' => 'nullable|numeric',
            'battery.cycle_count' => 'nullable|integer',
            'battery.max_capacity_mah' => 'nullable|integer',
            'battery.current_capacity_mah' => 'nullable|integer',
            'battery.level_percent' => 'nullable|integer|min:0|max:100',
            'battery.temperature_celsius' => 'nullable|numeric',
            'performance' => 'nullable|array',
            'performance.cpu_load_avg_1min' => 'nullable|numeric',
            'performance.cpu_load_avg_5min' => 'nullable|numeric',
            'performance.cpu_load_avg_15min' => 'nullable|numeric',
            'performance.sample_count' => 'nullable|integer',
            'usage' => 'nullable|array',
            'usage.screen_on_time_seconds' => 'nullable|integer',
            'usage.estimated_method' => 'nullable|string',
            'usage.total_plugged_in_seconds' => 'nullable|integer',
            'usage.total_on_battery_seconds' => 'nullable|integer',
            'usage.charge_sessions_count' => 'nullable|integer',
            'usage.app_uptime_seconds' => 'nullable|integer',
        ]);

        // Ensure device exists (in case weekly arrives before/without initial)
        $deviceExists = Device::where('device_id', $request->input('device_id'))->exists();
        if (!$deviceExists) {
            Device::create([
                'device_id' => $request->input('device_id'),
                'app_version' => $request->input('app_version'),
                'first_seen_at' => now(),
            ]);
        }

        DB::transaction(function () use ($request) {
            $battery = $request->input('battery');
            $performance = $request->input('performance', []);
            $usage = $request->input('usage', []);

            // Update device app_version
            Device::where('device_id', $request->input('device_id'))
                ->update(['app_version' => $request->input('app_version')]);

            BatterySnapshot::create([
                'device_id' => $request->input('device_id'),
                'report_type' => 'weekly',
                'reported_at' => $request->input('timestamp'),
                'health_percent' => $battery['health_percent'] ?? null,
                'cycle_count' => $battery['cycle_count'] ?? null,
                'max_capacity_mah' => $battery['max_capacity_mah'] ?? null,
                'current_capacity_mah' => $battery['current_capacity_mah'] ?? null,
                'level_percent' => $battery['level_percent'] ?? null,
                'temperature_c' => $battery['temperature_celsius'] ?? null,
            ]);

            WeeklyReport::create([
                'device_id' => $request->input('device_id'),
                'reported_at' => $request->input('timestamp'),
                'period_start' => $request->input('period_start'),
                'period_end' => $request->input('period_end'),
                'app_version' => $request->input('app_version'),
                'cpu_load_1min' => $performance['cpu_load_avg_1min'] ?? null,
                'cpu_load_5min' => $performance['cpu_load_avg_5min'] ?? null,
                'cpu_load_15min' => $performance['cpu_load_avg_15min'] ?? null,
                'sample_count' => $performance['sample_count'] ?? null,
                'screen_on_seconds' => $usage['screen_on_time_seconds'] ?? null,
                'screen_time_method' => $usage['estimated_method'] ?? null,
                'plugged_in_seconds' => $usage['total_plugged_in_seconds'] ?? null,
                'on_battery_seconds' => $usage['total_on_battery_seconds'] ?? null,
                'charge_sessions' => $usage['charge_sessions_count'] ?? null,
                'app_uptime_seconds' => $usage['app_uptime_seconds'] ?? null,
            ]);
        });

        Log::info('PBM weekly report received', ['device_id' => $request->input('device_id')]);

        return response()->json(['status' => 'ok'], 200);
    }
}
