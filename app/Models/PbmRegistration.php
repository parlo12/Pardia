<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PbmRegistration extends Model
{
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
