<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['nama' => 'Laptop', 'kode' => 'LPT', 'deskripsi' => 'Semua jenis laptop'],
            ['nama' => 'Personal Computer', 'kode' => 'PC', 'deskripsi' => 'Desktop PC'],
            ['nama' => 'Printer', 'kode' => 'PRT', 'deskripsi' => 'Printer dan Scanner']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}