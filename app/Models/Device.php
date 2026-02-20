<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    protected $primaryKey = 'device_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'device_id', 'model_identifier', 'chip',
        'cpu_core_count', 'cpu_perf_cores', 'cpu_eff_cores',
        'ram_bytes', 'disk_total_bytes',
        'os_version', 'os_build', 'app_version', 'first_seen_at',
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'ram_bytes' => 'integer',
        'disk_total_bytes' => 'integer',
    ];

    public function batterySnapshots(): HasMany
    {
        return $this->hasMany(BatterySnapshot::class, 'device_id', 'device_id');
    }

    public function weeklyReports(): HasMany
    {
        return $this->hasMany(WeeklyReport::class, 'device_id', 'device_id');
    }
}
