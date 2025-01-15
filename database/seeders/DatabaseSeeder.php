<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\UserRole;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        UserRole::create([
            'user_id'=>2,
            'roles_id'=>1,

        ]);
    
        UserRole::create([
            'user_id'=>3,
            'roles_id'=>2,

        ]);
    
        UserRole::create([
            'user_id'=>4,
            'roles_id'=>3,

        ]);
    
        UserRole::create([
            'user_id'=>5,
            'roles_id'=>4,

        ]);
    }
}
