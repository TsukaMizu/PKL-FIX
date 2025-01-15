<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetProcurement extends Model
{
    protected $fillable = [
        'asset_id',
        'pr_awal',
        'pr_line',
        'judul_pr',
        'po_awal',
        'tanggal_terima',
        'tanggal_kembali_terima',
        'tanggal_dari_koperasi',
        'tanggal_kembali_koperasi',
        'catatan'
    ];

    protected $casts = [
        'tanggal_terima' => 'date',
        'tanggal_kembali_terima' => 'date',
        'tanggal_dari_koperasi' => 'date',
        'tanggal_kembali_koperasi' => 'date'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
