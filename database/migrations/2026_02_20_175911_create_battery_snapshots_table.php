<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('battery_snapshots', function (Blueprint $table) {
            $table->id();
            $table->uuid('device_id');
            $table->string('report_type'); // 'initial' or 'weekly'
            $table->timestamp('reported_at');
            $table->double('health_percent')->nullable();
            $table->integer('cycle_count')->nullable();
            $table->integer('design_capacity_mah')->nullable(); // NULL for weekly
            $table->integer('max_capacity_mah')->nullable();
            $table->integer('current_capacity_mah')->nullable();
            $table->integer('level_percent')->nullable();
            $table->double('temperature_c')->nullable();
            $table->boolean('is_charging')->nullable(); // NULL for weekly
            $table->boolean('is_plugged_in')->nullable(); // NULL for weekly
            $table->timestamps();

            $table->foreign('device_id')->references('device_id')->on('devices')->onDelete('cascade');
            $table->index(['device_id', 'reported_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('battery_snapshots');
    }
};
