<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetSoftware extends Model
{
    protected $fillable = [
        'asset_id',
        'os',
        'office',
        'office_365',
        'email_365'
    ];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
