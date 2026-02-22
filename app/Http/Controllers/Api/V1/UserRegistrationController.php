<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PbmRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserRegistrationController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'required|uuid',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'app_version' => 'required|string|max:50',
            'timestamp' => 'required|date',
        ]);

        PbmRegistration::updateOrCreate(
            ['device_id' => $request->input('device_id')],
            [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'app_version' => $request->input('app_version'),
                'registered_at' => $request->input('timestamp'),
            ]
        );

        Log::info('PBM user registration', [
            'device_id' => $request->input('device_id'),
            'email' => $request->input('email'),
        ]);

        return response()->json(['status' => 'ok'], 200);
    }
}
