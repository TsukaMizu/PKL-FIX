<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'nama',
        'kode',
        'deskripsi'
    ];

    public function itemstocks()
    {
        return $this->hasMany(ItemStock::class, 'kategori_id');
    }   
}