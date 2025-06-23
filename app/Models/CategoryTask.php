<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryTask extends Model
{
    protected $table = 'category_task';
    protected $fillable = [
        'tugas'
  ];
  public function task()
  {
      return $this->hasMany(CategoryTask::class, 'kategori_id');
  }  
}
