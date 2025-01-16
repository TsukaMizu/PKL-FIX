<?php

namespace Database\Seeders;

use App\Models\AssetAllocation;
use Illuminate\Database\Seeder;

class AssetAllocationSeeder extends Seeder
{
    public function run()
    {
        AssetAllocation::create([
            'nip' => 'EMP002',
            'laptop_koperasi' => true,
            'laptop_ip' => false,
            'pc_koperasi' => false,
            'pc_ip' => false
        ]);
    }
}