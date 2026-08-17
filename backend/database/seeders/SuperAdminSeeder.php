<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = env('SUPERADMIN_EMAIL', 'superadmin@vandastudio.com');
        $password = env('SUPERADMIN_PASSWORD', 'password123');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin',
                'password' => Hash::make($password),
                'role' => 'superadmin',
                'is_active' => true,
            ]
        );

        echo "Super Admin créé avec succès !\n";
        echo "Email: $email\n";
        echo "Mot de passe: $password\n";
    }
}