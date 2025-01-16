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
            $table->string('kode_item')->unique();
            $table->string('nama');
            $table->foreignId('category_id')->constrained();
            $table->string('merk')->nullable();
            $table->string('tipe')->nullable();
            $table->text('spesifikasi')->nullable();
            // Software specifications
            $table->enum('os', ['windows', 'linux', 'mac_os', 'other', 'none'])->default('none');
            $table->string('os_version')->nullable();
            $table->boolean('has_office')->default(false);
            $table->string('office_version')->nullable();
            $table->boolean('has_office_365')->default(false);
            $table->boolean('has_email_365')->default(false);
            // Hardware specifications
            $table->integer('jumlah_total');
            $table->integer('jumlah_tersedia');
            $table->integer('minimum_stok')->default(0);
            $table->decimal('harga_per_unit', 15, 2)->nullable();
            $table->string('satuan');
            $table->text('keterangan')->nullable();
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
