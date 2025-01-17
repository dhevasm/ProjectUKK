<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_undangans', function (Blueprint $table) {
            $table->id();
            $table->string("bride_name");
            $table->string("bride_father_name");
            $table->string("bride_mother_name");
            $table->string("groom_name");
            $table->string("groom_father_name");
            $table->string("groom_mother_name");
            $table->string("location");
            $table->dateTime("akad");
            $table->dateTime("resepsi");
            $table->text("note")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_undangans');
    }
};
