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
        Schema::create('asset_procurement', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->string('pr_awal');
            $table->string('pr_line');
            $table->string('judul_pr');
            $table->string('po_awal');
            $table->date('tanggal_terima');
            $table->date('tanggal_kembali_terima')->nullable();
            $table->date('tanggal_dari_koperasi')->nullable();
            $table->date('tanggal_kembali_koperasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_procurement');
    }
};
