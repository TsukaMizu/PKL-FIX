<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssetLoan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'asset_id',
        'nip',
        'tanggal_pinjam',
        'tanggal_kembali',
        'status',
        'kondisi_pinjam',
        'kondisi_kembali',
        'approved_by',
        'processed_by',
        'catatan'
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'tanggal_kembali' => 'date'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'nip', 'nip');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}