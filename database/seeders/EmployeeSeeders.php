<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeders extends Seeder
{
    public function run()
    {
        // Create Asman (Assistant Manager)
        $asman = Employee::create([
            'nip' => 'EMP001',
            'nama' => 'John Manager',
            'email' => 'john@company.com',
            'division' => 'IT',
            'jabatan' => 'Assistant Manager',
            'lokasi_gedung' => 'Gedung A',
            'lokasi_ruang' => 'Lt. 3',
            'is_active' => true
        ]);

        // Create Staff under Asman
        Employee::create([
            'nip' => 'EMP002',
            'nama' => 'Jane Developer',
            'email' => 'jane@company.com',
            'division' => 'IT',
            'jabatan' => 'Developer',
            'lokasi_gedung' => 'Gedung A',
            'lokasi_ruang' => 'Lt. 3',
            'group_asman' => $asman->nip,
            'is_active' => true
        ]);
    }
}