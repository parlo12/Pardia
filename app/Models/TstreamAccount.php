<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TstreamAccount extends Model
{
    protected $fillable = [
        'device_id',
        'email',
        'name',
        'auth_provider',
        'platform',
        'app_version',
        'os_version',
        'plan',
        'stripe_customer_id',
        'stripe_subscription_id',
        'consent_analytics',
        'last_seen_at',
    ];

    protected $casts = [
        'consent_analytics' => 'boolean',
        'last_seen_at' => 'datetime',
    ];

    public function vehicle(): HasOne
    {
        return $this->hasOne(TstreamVehicle::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(TstreamSession::class);
    }

    public function isPremium(): bool
    {
        return $this->plan === 'premium';
    }
}
