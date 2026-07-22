<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tstream_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tstream_account_id')->constrained('tstream_accounts')->cascadeOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->unsignedInteger('duration_sec')->default(0);
            $table->unsignedInteger('frames_sent')->default(0);
            $table->unsignedInteger('max_viewers')->default(0);
            $table->string('quality')->nullable();
            $table->unsignedSmallInteger('fps')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tstream_sessions');
    }
};
