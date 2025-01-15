<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetStatusHistory extends Model
{
    protected $fillable = [
        'asset_id',
        'status_lama',
        'status_baru',
        'keterangan',
        'changed_by'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
