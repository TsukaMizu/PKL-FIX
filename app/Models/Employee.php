<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'employees';

    protected $fillable = [
        'nip',
        'nama',
        'email',
        'divisi',
        'jabatan',
        'lokasi_gedung',
        'lokasi_ruang',
        'group_asman',
    ];

    public function items()
    {
        return $this->hasMany(Item::class, 'employee_id');
    }

    // Tambahkan relasi dengan Task
    public function tasks()
    {
        return $this->hasMany(Task::class, 'karyawan_id');
    }

}