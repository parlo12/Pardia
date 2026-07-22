<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tstream_vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tstream_account_id')->constrained('tstream_accounts')->cascadeOnDelete();
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->string('paint')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tstream_vehicles');
    }
};
