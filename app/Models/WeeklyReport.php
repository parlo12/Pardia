<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyReport extends Model
{
    protected $fillable = [
        'device_id', 'reported_at', 'period_start', 'period_end', 'app_version',
        'cpu_load_1min', 'cpu_load_5min', 'cpu_load_15min', 'sample_count',
        'screen_on_seconds', 'screen_time_method',
        'plugged_in_seconds', 'on_battery_seconds',
        'charge_sessions', 'app_uptime_seconds',
    ];

    protected $casts = [
        'reported_at' => 'datetime',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
        'cpu_load_1min' => 'double',
        'cpu_load_5min' => 'double',
        'cpu_load_15min' => 'double',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id', 'device_id');
    }
}
