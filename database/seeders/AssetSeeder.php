<?php

namespace Database\Seeders;

use App\Models\Asset;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run()
    {
        // Laptop Assets
        for ($i = 1; $i <= 5; $i++) {
            Asset::create([
                'kode_asset' => sprintf('LPT-DELL-001-%03d', $i),
                'item_id' => 1,
                'serial_number' => "DELL" . str_pad($i, 8, '0', STR_PAD_LEFT),
                'computer_name' => "LAPTOP-D" . $i,
                'tahun_inventaris' => 2024,
                'os_status' => 'active',
                'office_status' => 'active',
                'office_365_status' => 'active',
                'email_365_status' => 'active',
                'no_at' => "AT2024" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'tanggal_terima' => Carbon::now(),
                'status' => 'bagus',
                'wellness' => 100,
                'pr_awal' => 'PR2024001',
                'pr_line' => $i,
                'judul_pr' => 'Pengadaan Laptop 2024',
                'po_awal' => 'PO2024001'
            ]);
        }

        // PC Assets
        for ($i = 1; $i <= 3; $i++) {
            Asset::create([
                'kode_asset' => sprintf('PC-LEN-001-%03d', $i),
                'item_id' => 2,
                'serial_number' => "LEN" . str_pad($i, 8, '0', STR_PAD_LEFT),
                'computer_name' => "PC-L" . $i,
                'tahun_inventaris' => 2024,
                'os_status' => 'active',
                'office_status' => 'active',
                'office_365_status' => 'not_installed',
                'email_365_status' => 'not_installed',
                'no_at' => "AT2024" . str_pad($i + 5, 3, '0', STR_PAD_LEFT),
                'tanggal_terima' => Carbon::now(),
                'status' => 'bagus',
                'wellness' => 100,
                'pr_awal' => 'PR2024002',
                'pr_line' => $i,
                'judul_pr' => 'Pengadaan PC 2024',
                'po_awal' => 'PO2024002'
            ]);
        }
    }
}