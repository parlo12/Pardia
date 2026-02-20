<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('device_id');
            $table->timestamp('reported_at');
            $table->timestamp('period_start')->nullable();
            $table->timestamp('period_end')->nullable();
            $table->string('app_version')->nullable();
            // Performance
            $table->double('cpu_load_1min')->nullable();
            $table->double('cpu_load_5min')->nullable();
            $table->double('cpu_load_15min')->nullable();
            $table->integer('sample_count')->nullable();
            // Usage
            $table->integer('screen_on_seconds')->nullable();
            $table->string('screen_time_method')->nullable();
            $table->integer('plugged_in_seconds')->nullable();
            $table->integer('on_battery_seconds')->nullable();
            $table->integer('charge_sessions')->nullable();
            $table->integer('app_uptime_seconds')->nullable();
            $table->timestamps();

            $table->foreign('device_id')->references('device_id')->on('devices')->onDelete('cascade');
            $table->index(['device_id', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_reports');
    }
};
