<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetAssignment extends Model
{
    protected $table='asset_assignments';
    protected $fillable = [
        'asset_id',
        'employee_id',
        'assigned_at',
        'returned_at',
        'assigned_by',
        'notes'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'returned_at' => 'datetime'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
