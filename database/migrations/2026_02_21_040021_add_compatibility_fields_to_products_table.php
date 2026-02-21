<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // JSON array of Mac model identifiers this product is compatible with
            // e.g. ["Mac14,2", "Mac14,7", "Mac15,3"]
            $table->json('compatible_models')->nullable()->after('system_requirements');

            // What health issue triggers this recommendation
            // e.g. "battery_low", "battery_critical", "high_cycles", "storage_low"
            $table->string('recommendation_trigger')->nullable()->after('compatible_models');

            // Threshold for the trigger (e.g. battery_health < 50 = critical)
            $table->decimal('trigger_threshold', 5, 2)->nullable()->after('recommendation_trigger');

            // Priority for sorting recommendations (lower = higher priority)
            $table->unsignedInteger('recommendation_priority')->default(100)->after('trigger_threshold');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['compatible_models', 'recommendation_trigger', 'trigger_threshold', 'recommendation_priority']);
        });
    }
};
