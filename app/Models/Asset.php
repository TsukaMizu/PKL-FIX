<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'kode_asset',
        'item_id',
        'serial_number',
        'nip',
        'computer_name',
        'tahun_inventaris',
        'os_status',
        'office_status',
        'office_365_status',
        'email_365_status',
        'no_at',
        'tanggal_terima',
        'tanggal_kembali',
        'status',
        'wellness',
        'riwayat_perbaikan',
        'pr_awal',
        'pr_line',
        'judul_pr',
        'po_awal',
        'tanggal_datang_koperasi',
        'tanggal_kembali_koperasi',
        'catatan'
    ];

    protected $casts = [
        'tahun_inventaris' => 'integer',
        'tanggal_terima' => 'date',
        'tanggal_kembali' => 'date',
        'tanggal_datang_koperasi' => 'date',
        'tanggal_kembali_koperasi' => 'date',
        'wellness' => 'integer'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'nip', 'nip');
    }

    public function loans()
    {
        return $this->hasMany(AssetLoan::class);
    }

    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    public function currentLoan()
    {
        return $this->loans()->where('status', 'dipinjam')->latest()->first();
    }
}