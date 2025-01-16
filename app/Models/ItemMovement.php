<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemMovement extends Model
{
    protected $fillable = [
        'item_id',
        'type',
        'quantity',
        'stock_before',
        'stock_after',
        'reference_number',
        'lokasi_penyimpanan',
        'processed_by',
        'keterangan'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}