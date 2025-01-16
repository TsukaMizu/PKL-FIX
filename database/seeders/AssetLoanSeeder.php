<?php

namespace Database\Seeders;

use App\Models\AssetLoan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AssetLoanSeeder extends Seeder
{
    public function run()
    {
        // Contoh peminjaman laptop
        AssetLoan::create([
            'asset_id' => 1,
            'nip' => 'EMP002',
            'tanggal_pinjam' => Carbon::now()->subDays(30),
            'status' => 'dipinjam',
            'kondisi_pinjam' => 'Bagus, fullset',
            'approved_by' => 1,
            'processed_by' => 2
        ]);
    }
}