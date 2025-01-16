<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table='audit_logs';
    protected $fillable = [
        'table_name',
        'record_id',
        'action',
        'old_values',
        'new_values',
        'changed_by',
        'changed_at'
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'changed_at' => 'datetime'
    ];
}
