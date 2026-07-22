<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TstreamAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * T-Stream iOS app API — same conventions as the PBM telemetry API:
 * anonymous, identified by a locally-generated device UUID, upserting.
 * The `plan` column is server-owned (set by Stripe billing), never by clients.
 */
class TStreamController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|uuid',
            'email' => 'nullable|email|max:255',
            'name' => 'nullable|string|max:255',
            'auth_provider' => 'nullable|string|max:50',
            'platform' => 'nullable|string|max:20',
            'app_version' => 'nullable|string|max:50',
            'os_version' => 'nullable|string|max:50',
            'vehicle' => 'nullable|array',
            'vehicle.model' => 'required_with:vehicle|string|max:50',
            'vehicle.year' => 'required_with:vehicle|integer|min:2008|max:2035',
            'vehicle.paint' => 'nullable|string|max:50',
        ]);

        $account = TstreamAccount::updateOrCreate(
            ['device_id' => $request->input('device_id')],
            array_filter([
                'email' => $request->input('email'),
                'name' => $request->input('name'),
                'auth_provider' => $request->input('auth_provider'),
                'platform' => $request->input('platform', 'ios'),
                'app_version' => $request->input('app_version'),
                'os_version' => $request->input('os_version'),
            ], fn ($value) => $value !== null) + ['last_seen_at' => now()]
        );

        if ($vehicle = $request->input('vehicle')) {
            $account->vehicle()->updateOrCreate([], [
                'model' => $vehicle['model'],
                'year' => $vehicle['year'],
                'paint' => $vehicle['paint'] ?? null,
            ]);
        }

        return response()->json(['status' => 'ok', 'plan' => $this->effectivePlan($account)]);
    }

    public function event(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|uuid',
            'event' => 'required|string|in:stream_session',
            'started_at' => 'nullable|integer',
            'duration_sec' => 'nullable|integer|min:0|max:604800',
            'frames_sent' => 'nullable|integer|min:0',
            'max_viewers' => 'nullable|integer|min:0|max:100',
            'quality' => 'nullable|string|max:20',
            'fps' => 'nullable|integer|min:1|max:60',
        ]);

        $account = TstreamAccount::firstOrCreate(
            ['device_id' => $request->input('device_id')],
            ['platform' => 'ios', 'last_seen_at' => now()]
        );

        $account->sessions()->create([
            'started_at' => $request->filled('started_at')
                ? Carbon::createFromTimestamp($request->integer('started_at'))
                : null,
            'duration_sec' => $request->integer('duration_sec'),
            'frames_sent' => $request->integer('frames_sent'),
            'max_viewers' => $request->integer('max_viewers'),
            'quality' => $request->input('quality'),
            'fps' => $request->input('fps'),
        ]);

        $account->update(['last_seen_at' => now()]);

        return response()->json(['status' => 'ok']);
    }

    public function status(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'nullable|uuid',
            'email' => 'nullable|email',
        ]);

        $account = null;
        if ($request->filled('device_id')) {
            $account = TstreamAccount::where('device_id', $request->input('device_id'))->first();
        }

        return response()->json(['plan' => $this->effectivePlan($account, $request->input('email'))]);
    }

    /**
     * Premium if this device's account is premium, or if any account sharing
     * the email is premium (covers subscriptions purchased on pardia.io,
     * which are keyed by email rather than device).
     */
    private function effectivePlan(?TstreamAccount $account, ?string $email = null): string
    {
        if ($account?->isPremium()) {
            return 'premium';
        }
        $email = $email ?? $account?->email;
        if ($email && TstreamAccount::where('email', $email)->where('plan', 'premium')->exists()) {
            return 'premium';
        }
        return 'free';
    }
}
