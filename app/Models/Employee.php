<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'nama',
        'nip',
        'jabatan',
        'divisi',
        'email',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function assets()
    {
        return $this->hasMany(Asset::class, 'current_employee_id');
    }

    public function assetAssignments()
    {
        return $this->hasMany(AssetAssignment::class);
    }
}
