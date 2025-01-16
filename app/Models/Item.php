<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'kode_item',
        'nama',
        'category_id',
        'merk',
        'tipe',
        'spesifikasi',
        'os',
        'os_version',
        'has_office',
        'office_version',
        'has_office_365',
        'has_email_365',
        'jumlah_total',
        'jumlah_tersedia',
        'minimum_stok',
        'harga_per_unit',
        'satuan',
        'keterangan'
    ];

    protected $casts = [
        'has_office' => 'boolean',
        'has_office_365' => 'boolean',
        'has_email_365' => 'boolean',
        'harga_per_unit' => 'decimal:2'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    public function movements()
    {
        return $this->hasMany(ItemMovement::class);
    }
}