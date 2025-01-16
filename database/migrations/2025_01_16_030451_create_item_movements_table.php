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
        Schema::create('item_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained();
            $table->enum('type', ['in', 'out', 'return', 'maintenance']);
            $table->integer('quantity');
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->string('reference_number')->nullable();
            $table->string('lokasi_penyimpanan')->nullable();
            $table->foreignId('processed_by')->constrained('users');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_movements');
    }
};
