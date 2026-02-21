<?php

namespace App\Http\Controllers;

use App\Models\BatterySnapshot;
use App\Models\Device;
use App\Services\RecommendationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeviceLinkController extends Controller
{
    public function index(Request $request, RecommendationService $recommendationService): Response
    {
        $user = $request->user();

        $devices = $user->devices()->get()->map(function (Device $device) {
            $latestSnapshot = BatterySnapshot::where('device_id', $device->device_id)
                ->latest('reported_at')
                ->first();

            // design_capacity_mah is only sent in the initial report, so fetch it separately
            $designCapacity = BatterySnapshot::where('device_id', $device->device_id)
                ->whereNotNull('design_capacity_mah')
                ->value('design_capacity_mah');

            $snapshotCount = BatterySnapshot::where('device_id', $device->device_id)->count();

            return [
                'device_id' => $device->device_id,
                'model_identifier' => $device->model_identifier,
                'chip' => $device->chip,
                'ram_bytes' => $device->ram_bytes,
                'disk_total_bytes' => $device->disk_total_bytes,
                'os_version' => $device->os_version,
                'app_version' => $device->app_version,
                'first_seen_at' => $device->first_seen_at,
                'nickname' => $device->pivot->nickname,
                'linked_at' => $device->pivot->linked_at,
                'battery_health' => $latestSnapshot?->health_percent,
                'cycle_count' => $latestSnapshot?->cycle_count,
                'max_capacity_mah' => $latestSnapshot?->max_capacity_mah,
                'design_capacity_mah' => $designCapacity,
                'snapshot_count' => $snapshotCount,
            ];
        });

        $recommendations = $recommendationService->forUser($user);

        return Inertia::render('Devices/Index', [
            'devices' => $devices,
            'recommendations' => $recommendations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Devices/Link');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'device_id' => 'required|uuid',
            'nickname' => 'nullable|string|max:100',
        ]);

        $deviceId = $request->input('device_id');
        $user = $request->user();

        // Check if device exists in telemetry database
        $device = Device::where('device_id', $deviceId)->first();

        if (!$device) {
            return back()->withErrors([
                'device_id' => 'No device found with this ID. Make sure Pardia Battery Management is installed and has sent at least one report.',
            ]);
        }

        // Check if already linked to this user
        if ($user->devices()->where('devices.device_id', $deviceId)->exists()) {
            return back()->withErrors([
                'device_id' => 'This device is already linked to your account.',
            ]);
        }

        // Link the device
        $user->devices()->attach($deviceId, [
            'nickname' => $request->input('nickname') ?: $device->model_identifier,
            'linked_at' => now(),
        ]);

        return redirect()->route('devices.index')
            ->with('success', 'Device linked successfully! We can now personalize recommendations for your ' . ($device->model_identifier ?? 'device') . '.');
    }

    public function update(Request $request, string $deviceId): RedirectResponse
    {
        $request->validate([
            'nickname' => 'required|string|max:100',
        ]);

        $request->user()->devices()->updateExistingPivot($deviceId, [
            'nickname' => $request->input('nickname'),
        ]);

        return back()->with('success', 'Device nickname updated.');
    }

    public function destroy(Request $request, string $deviceId): RedirectResponse
    {
        $request->user()->devices()->detach($deviceId);

        return back()->with('success', 'Device unlinked from your account.');
    }
}
