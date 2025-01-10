<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karyawan extends Model
{
    protected $table ='karyawan';

    protected $primaryKey = 'karyawan_id';

    protected $fillable = [
        'nama',
        'nip',
        'jabatan'
    ];
}
