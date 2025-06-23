<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_barang',
        'kategori_id',
        'barang_masuk',
        'status_inventaris'
    ];

    protected $casts = [
        'stok' => 'integer',
        'barang_masuk' => 'integer',
        'barang_dipinjam' => 'integer'
    ];

    public function specification(): HasOne
    {
        return $this->hasOne(ItemSpecification::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function category()
    {
    return $this->belongsTo(Category::class, 'kategori_id');
    }
}
