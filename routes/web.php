<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DeviceLinkController;
use App\Http\Controllers\TelemetryDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/products/{product}/download', [ProductController::class, 'download'])->name('products.download');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

Route::middleware('auth')->group(function () {
    Route::post('/checkout', [CheckoutController::class, 'checkout'])->name('checkout');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    Route::get('/devices', [DeviceLinkController::class, 'index'])->name('devices.index');
    Route::get('/devices/link', [DeviceLinkController::class, 'create'])->name('devices.link');
    Route::post('/devices', [DeviceLinkController::class, 'store'])->name('devices.store');
    Route::patch('/devices/{deviceId}', [DeviceLinkController::class, 'update'])->name('devices.update');
    Route::delete('/devices/{deviceId}', [DeviceLinkController::class, 'destroy'])->name('devices.destroy');

    Route::get('/telemetry', [TelemetryDashboardController::class, 'index'])->name('telemetry.index');
    Route::get('/telemetry/{deviceId}', [TelemetryDashboardController::class, 'show'])->name('telemetry.show');
});

require __DIR__.'/auth.php';
