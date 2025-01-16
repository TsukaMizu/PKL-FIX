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
        Schema::create('asset_loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->string('nip');
            $table->date('tanggal_pinjam');
            $table->date('tanggal_kembali')->nullable();
            $table->enum('status', ['dipinjam', 'dikembalikan', 'telat', 'hilang']);
            $table->text('kondisi_pinjam')->nullable();
            $table->text('kondisi_kembali')->nullable();
            $table->foreignId('approved_by')->constrained('users');
            $table->foreignId('processed_by')->constrained('users');
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('nip')
                ->references('nip')
                ->on('employees')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_loans');
    }
};
