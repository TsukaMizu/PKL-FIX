<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'task';

    protected $fillable = [
        'karyawan_id',
        'tanggal_laporan',
        'trouble',
        'solusi',
        'kategori_id',
        'status',
        'keterangan'
    ];

    protected $casts = [
        'tanggal_laporan' => 'date'
    ];

    public function karyawan()
    {
        return $this->belongsTo(Employee::class, 'karyawan_id');
    }

    public function kategori()
    {
        return $this->belongsTo(CategoryTask::class, 'kategori_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}