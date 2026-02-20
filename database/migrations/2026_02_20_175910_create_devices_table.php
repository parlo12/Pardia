<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('device_id')->primary();
            $table->string('model_identifier')->nullable();
            $table->string('chip')->nullable();
            $table->integer('cpu_core_count')->nullable();
            $table->integer('cpu_perf_cores')->nullable();
            $table->integer('cpu_eff_cores')->nullable();
            $table->unsignedBigInteger('ram_bytes')->nullable();
            $table->unsignedBigInteger('disk_total_bytes')->nullable();
            $table->string('os_version')->nullable();
            $table->string('os_build')->nullable();
            $table->string('app_version')->nullable();
            $table->timestamp('first_seen_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
