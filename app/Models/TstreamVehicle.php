<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TstreamVehicle extends Model
{
    protected $fillable = ['tstream_account_id', 'model', 'year', 'paint'];

    public function account(): BelongsTo
    {
        return $this->belongsTo(TstreamAccount::class, 'tstream_account_id');
    }
}
