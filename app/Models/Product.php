<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'short_description',
        'price', 'is_free', 'type', 'download_url', 'version',
        'images', 'thumbnail', 'model_3d_url', 'features',
        'system_requirements', 'stock', 'is_active', 'is_featured',
    ];

    protected $casts = [
        'images' => 'array',
        'features' => 'array',
        'system_requirements' => 'array',
        'is_free' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
