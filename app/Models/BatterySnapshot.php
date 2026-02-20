<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BatterySnapshot extends Model
{
    protected $fillable = [
        'device_id', 'report_type', 'reported_at',
        'health_percent', 'cycle_count',
        'design_capacity_mah', 'max_capacity_mah', 'current_capacity_mah',
        'level_percent', 'temperature_c',
        'is_charging', 'is_plugged_in',
    ];

    protected $casts = [
        'reported_at' => 'datetime',
        'health_percent' => 'double',
        'temperature_c' => 'double',
        'is_charging' => 'boolean',
        'is_plugged_in' => 'boolean',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id', 'device_id');
    }
}
