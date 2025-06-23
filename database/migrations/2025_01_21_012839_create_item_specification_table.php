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
        Schema::create('item_specification', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_stock_id')->constrained('item_stocks')->onDelete('cascade');
            $table->string('merk');
            $table->string('warna');
            $table->text('spesifikasi');
            $table->year('tahun_inventaris');
            $table->string('os');
            $table->boolean('office')->default(false);
            $table->boolean('office_365')->default(false);
            $table->boolean('email_365')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_specification');
    }
};
