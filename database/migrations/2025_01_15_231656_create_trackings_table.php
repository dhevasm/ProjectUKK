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
        Schema::create('trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_id')->constrained()->onDelete('cascade');
            $table->timestamp("ordered")->nullable();
            $table->timestamp("proccess")->nullable();
            $table->timestamp("delivery")->nullable();
            $table->timestamp("delivered")->nullable();
            $table->timestamp("completed")->nullable();
            $table->timestamp("cancelled")->nullable();
            $table->enum("status", ["pending", "proccess", "delivery", "delivered", "completed", "cancelled"])->default("pending");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trackings');
    }
};
