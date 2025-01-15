<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetSpecification extends Model
{
    protected $fillable = [
        'asset_id',
        'computer_name',
        'merk',
        'warna',
        'spesifikasi',
        'tahun_inventaris',
        'serial_number',
        'no_at'
    ];

    protected $casts = [
        'tahun_inventaris' => 'integer'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}

class AssetSoftware extends Model
{
    protected $fillable = [
        'asset_id',
        'os',
        'office',
        'office_365',
        'email_365'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
