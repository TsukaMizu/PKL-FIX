<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'nama_barang',
        'status',
        'current_employee_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function currentEmployee()
    {
        return $this->belongsTo(Employee::class, 'current_employee_id');
    }

    public function location()
    {
        return $this->hasOne(AssetLocation::class);
    }

    public function specification()
    {
        return $this->hasOne(AssetSpecification::class);
    }

    public function software()
    {
        return $this->hasOne(AssetSoftware::class);
    }

    public function assignments()
    {
        return $this->hasMany(AssetAssignment::class);
    }

    public function repairs()
    {
        return $this->hasMany(AssetRepair::class);
    }

    public function procurement()
    {
        return $this->hasOne(AssetProcurement::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(AssetStatusHistory::class);
    }
}
