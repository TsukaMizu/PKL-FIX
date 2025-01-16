<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    protected $fillable = [
        'nip',
        'nama',
        'email',
        'division',
        'jabatan',
        'lokasi_gedung',
        'lokasi_ruang',
        'group_asman',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    // Relasi dengan Asset Allocation
    public function assetAllocation()
    {
        return $this->hasOne(AssetAllocation::class, 'nip', 'nip');
    }

    // Relasi dengan Asset Loans
    public function assetLoans()
    {
        return $this->hasMany(AssetLoan::class, 'nip', 'nip');
    }

    // Relasi dengan Assets
    public function assets()
    {
        return $this->hasMany(Asset::class, 'nip', 'nip');
    }

    // Relasi self-referential untuk Asman
    public function asman()
    {
        return $this->belongsTo(Employee::class, 'group_asman', 'nip');
    }

    public function staff()
    {
        return $this->hasMany(Employee::class, 'group_asman', 'nip');
    }
}