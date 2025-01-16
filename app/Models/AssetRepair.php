<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetRepair extends Model
{
    protected $table='asset_repairs';
    protected $fillable = [
        'asset_id',
        'description',
        'repair_date',
        'completed_date',
        'handled_by',
        'repair_cost'
    ];

    protected $casts = [
        'repair_date' => 'datetime',
        'completed_date' => 'datetime',
        'repair_cost' => 'decimal:2'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
