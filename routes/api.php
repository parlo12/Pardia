<?php

use App\Http\Controllers\Api\V1\TelemetryController;
use App\Http\Controllers\Api\V1\TStreamController;
use App\Http\Controllers\Api\V1\TStreamStripeWebhookController;
use App\Http\Controllers\Api\V1\UserRegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// PBM Telemetry API v1 — No authentication (anonymous telemetry)
Route::prefix('v1/telemetry')->group(function () {
    Route::post('/initial', [TelemetryController::class, 'initial']);
    Route::post('/weekly', [TelemetryController::class, 'weekly']);
});

// PBM User Registration — No authentication
Route::post('/v1/user/register', [UserRegistrationController::class, 'register']);

// T-Stream iOS app API — No authentication (anonymous telemetry, same model as PBM)
Route::prefix('v1/tstream')->group(function () {
    Route::post('/register', [TStreamController::class, 'register']);
    Route::post('/event', [TStreamController::class, 'event']);
    Route::get('/status', [TStreamController::class, 'status']);
    Route::post('/stripe-webhook', [TStreamStripeWebhookController::class, 'handle']);
});
