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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
            
            // Informasi peminjaman
            $table->date('tanggal_terima')->nullable();
            $table->date('tanggal_kembali')->nullable();
            
            // Status dan kondisi asset
            $table->enum('status', ['bagus', 'rusak', 'hilang', 'unknown'])->default('bagus');
            $table->integer('wellness')->default(100);
            
            // Riwayat
            $table->json('riwayat_perbaikan')->nullable();
            $table->json('riwayat_pemakai')->nullable(); // Menggunakan JSON untuk menyimpan array riwayat
            
            // Catatan tambahan
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
