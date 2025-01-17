<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
    $categories = [
        [
        'name' => 'Erba',
        'image' => 'storage/images/categories/0b5351c4-d1e6-44d1-986a-b27e99e2c0bc.png',
        ],
        [
        'name' => 'Maliq',
        'image' => 'storage/images/categories/acbe7fb5-c9b6-43d4-a0fb-f5c3f3eed37c.jpg',
        ],
        [
        'name' => 'Falah',
        'image' => 'storage/images/categories/8cf8b7d8-2e36-4870-b7ac-eb2573ed8f74.jpg',
        ],
        [
        'name' => 'Salma',
        'image' => "storage/images/categories/f79f1fd8-cb25-470f-b262-5cc4d32a87df.jpg",
        ],
        [
            "name" => "Fadhil",
            "image" => "storage/images/categories/1ad6f60b-41e2-42f1-86b8-504d5e5cf482.jpg",
        ],
        [
            "name" => "Avis",
            "image" => "storage/images/categories/2152b2a8-d55c-448c-afa1-3d26f0d0fec2.jpg",
        ],
        [
            "name" => "Rizki",
            "image" => "storage/images/categories/978cf893-45b4-4343-985e-73ce591dc476.jpg",
        ],
        [
            "name" => "Hepi",
            "image" => "storage/images/categories/2a0900f9-4eab-40a7-b874-2ad5f52037ec.jpg",
        ],
        [
            "name" => "Lintang",
            "image" => "storage/images/categories/1b794e1b-6af7-4c6a-881f-0772dbedb48f.jpg",
        ],
        [
            "name" => "Rayya",
            "image" => "storage/images/categories/f6fba777-fbd1-440c-9dcb-3df04574e363.jpg",
        ],
        [
            "name" => "Jago",
            "image" => "storage/images/categories/31d70d1f-2781-46b1-bfd2-70ef182fe0b5.jpg",
        ],
        [
            "name" => "Hc",
            "image" => "storage/images/categories/9b1e0800-d4ef-476f-bbc9-0a4367e9d977.jpg",
        ],
        [
            "name" => "Byar",
            "image" => "storage/images/categories/e203c854-5fec-4ed9-9b9f-0a1db86cfe14.jpg",
        ],
        [
            "name" => "Cantik",
            "image" => "storage/images/categories/6ce2bc78-8a18-4da9-af25-bfcde7343d3d.jpg",
        ],
        [
            "name" => "Rindu",
            "image" => "storage/images/categories/26d6a4e6-3bcf-48b9-ba8e-e569972ca353.jpeg",
        ],
    ];

    foreach ($categories as $category) {
        DB::table('categories')->insert($category);
    }
    }
}
