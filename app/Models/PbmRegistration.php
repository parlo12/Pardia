<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PbmRegistration extends Model
{
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id', 'device_id');
    }

    protected $fillable = [
        'device_id',
        'name',
        'email',
        'phone',
        'app_version',
        'registered_at',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
    ];
}
