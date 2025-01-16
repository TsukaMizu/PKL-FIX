<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run()
    {
        Item::create([
            'kode_item' => 'LPT-DELL-001',
            'nama' => 'Laptop Dell Latitude',
            'category_id' => 1, // Laptop category
            'merk' => 'Dell',
            'tipe' => 'Latitude 5420',
            'spesifikasi' => 'Intel i7, 16GB RAM, 512GB SSD',
            'os' => 'windows',
            'os_version' => '10 Pro',
            'has_office' => true,
            'office_version' => '2019',
            'has_office_365' => true,
            'has_email_365' => true,
            'jumlah_total' => 5,
            'jumlah_tersedia' => 5,
            'minimum_stok' => 1,
            'harga_per_unit' => 15000000,
            'satuan' => 'unit'
        ]);

        Item::create([
            'kode_item' => 'PC-LEN-001',
            'nama' => 'PC Lenovo ThinkCentre',
            'category_id' => 2, // PC category
            'merk' => 'Lenovo',
            'tipe' => 'ThinkCentre M720',
            'spesifikasi' => 'Intel i5, 8GB RAM, 256GB SSD',
            'os' => 'windows',
            'os_version' => '10 Pro',
            'has_office' => true,
            'office_version' => '2019',
            'has_office_365' => false,
            'has_email_365' => false,
            'jumlah_total' => 3,
            'jumlah_tersedia' => 3,
            'minimum_stok' => 1,
            'harga_per_unit' => 10000000,
            'satuan' => 'unit'
        ]);
    }
}