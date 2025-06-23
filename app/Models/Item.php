<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    protected $fillable = [
        'item_stock_id',
        'item_specification_id',
        'serial_number',
        'employee_id',
        'tanggal_terima',
        'tanggal_kembali',
        'status',
        'wellness',
        'riwayat_perbaikan',
        'riwayat_pemakai',
        'catatan',
        'created_by',
        'updated_by',
        'serial_number_added_at'
    ];

    protected $casts = [
        'tanggal_terima' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'serial_number_added_at' => 'datetime',
        'riwayat_perbaikan' => 'array',
        'riwayat_pemakai' => 'array'
    ];

    public function itemStock(): BelongsTo
    {
        return $this->belongsTo(ItemStock::class);
    }

    public function specification(): BelongsTo
    {
        return $this->belongsTo(ItemSpecification::class, 'item_specification_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
   
}