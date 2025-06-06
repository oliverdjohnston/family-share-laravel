<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate([
            'name' => 'Oliver',
            'email' => 'admin@oliver.cool',
            'steam_id' => '76561198395597231',
            'password' => Hash::make('Password123!'),
        ]);
    }
}
