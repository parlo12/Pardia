<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('is_free')->default(false);
            $table->enum('type', ['software', 'hardware'])->default('software');
            $table->string('download_url')->nullable();
            $table->string('version')->nullable();
            $table->json('images')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('model_3d_url')->nullable();
            $table->json('features')->nullable();
            $table->json('system_requirements')->nullable();
            $table->integer('stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
