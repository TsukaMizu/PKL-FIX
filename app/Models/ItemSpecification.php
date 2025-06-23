<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemSpecification extends Model
{
    use HasFactory;
    protected $table = 'item_specification';
    protected $fillable = [
        'item_stock_id',
        'merk',
        'warna',
        'spesifikasi',
        'tahun_inventaris',
        'os',
        'office',
        'office_365',
        'email_365'
    ];

    protected $casts = [
        'tahun_inventaris' => 'integer',
        'office' => 'boolean',
        'office_365' => 'boolean',
        'email_365' => 'boolean'
    ];

    public function itemStock()
    {
        return $this->belongsTo(ItemStock::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}