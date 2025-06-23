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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_stock_id')->constrained('item_stocks')->onDelete('cascade');
            $table->foreignId('item_specification_id')->constrained('item_specification')->onDelete('cascade');
            $table->string('serial_number')->unique()->nullable();
            $table->enum('status',['Available', 'Used', 'Broken','Koperasi','Unknown'])->default('Available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
