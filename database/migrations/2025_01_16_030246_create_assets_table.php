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
            $table->string('kode_asset')->unique();
            $table->foreignId('item_id')->constrained();
            $table->string('serial_number')->unique();
            $table->string('nip')->nullable();
            $table->string('computer_name')->nullable();
            $table->year('tahun_inventaris');
            // Software status
            $table->enum('os_status', ['active', 'expired', 'not_installed'])->default('not_installed');
            $table->enum('office_status', ['active', 'expired', 'not_installed'])->default('not_installed');
            $table->enum('office_365_status', ['active', 'expired', 'not_installed'])->default('not_installed');
            $table->enum('email_365_status', ['active', 'expired', 'not_installed'])->default('not_installed');
            // Asset details
            $table->string('no_at');
            $table->date('tanggal_terima');
            $table->date('tanggal_kembali')->nullable();
            $table->enum('status', ['bagus', 'rusak', 'hilang', 'unknown']);
            $table->integer('wellness')->default(100);
            $table->text('riwayat_perbaikan')->nullable();
            $table->string('pr_awal');
            $table->string('pr_line');
            $table->string('judul_pr');
            $table->string('po_awal');
            $table->date('tanggal_datang_koperasi')->nullable();
            $table->date('tanggal_kembali_koperasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->foreign('nip')
                ->references('nip')
                ->on('employees')
                ->nullOnDelete()
                ->onUpdate('cascade');
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
