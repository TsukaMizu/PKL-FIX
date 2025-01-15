<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Contoh data untuk tabel roles
        $roles = [
            ['nama' => 'Helper'],
            ['nama' => 'Officer'],
            ['nama' => 'Asisten Manager'],
            ['nama' => 'Manager'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
