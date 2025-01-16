<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetAllocation extends Model
{
    protected $fillable = [
        'nip',
        'laptop_koperasi',
        'laptop_ip',
        'pc_koperasi',
        'pc_ip'
    ];

    protected $casts = [
        'laptop_koperasi' => 'boolean',
        'laptop_ip' => 'boolean',
        'pc_koperasi' => 'boolean',
        'pc_ip' => 'boolean'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'nip', 'nip');
    }
}