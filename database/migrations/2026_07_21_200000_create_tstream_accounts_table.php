<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tstream_accounts', function (Blueprint $table) {
            $table->id();
            $table->uuid('device_id')->nullable()->unique();
            $table->string('email')->nullable()->index();
            $table->string('name')->nullable();
            $table->string('auth_provider')->nullable();
            $table->string('platform')->default('ios');
            $table->string('app_version')->nullable();
            $table->string('os_version')->nullable();
            $table->string('plan')->default('free');
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_subscription_id')->nullable()->index();
            $table->boolean('consent_analytics')->default(true);
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tstream_accounts');
    }
};
