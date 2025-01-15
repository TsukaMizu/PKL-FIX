<?php

namespace Database\Factories;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    protected $model= Role::class;

    public function definition(): array
    {
        return [
            'nama' => $this->faker->unique()->randomElement([
                'Helper',
                'Officer',
                'Asisten Manager',
                'Manager',
            ]),
        ];
    }
}
