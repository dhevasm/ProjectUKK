<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Permission::create(['name' => 'Admin Access']);
        Role::create(['name' => 'admin'])->givePermissionTo('Admin Access');

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'phone' => '6288994107529',
            'phone_verified_at' => now(),
            'address' => "Jalan Simo Jawar V A Gang 3 no.30, RW 10, Simomulyo Baru, Sukomanunggal, Surabaya, East Java, Java, 60187, Indonesia",
            'coordinates' => "-7.2696943676404215,112.70192205905916",
            'password' => bcrypt('admin123'),
        ])->assignRole('admin');

        // User::factory(10)->create();

        $this->call([
           CategorySeeder::class,
        ]);
    }
}
