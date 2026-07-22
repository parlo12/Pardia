<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TstreamSession extends Model
{
    protected $fillable = [
        'tstream_account_id',
        'started_at',
        'duration_sec',
        'frames_sent',
        'max_viewers',
        'quality',
        'fps',
    ];

    protected $casts = [
        'started_at' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(TstreamAccount::class, 'tstream_account_id');
    }
}
