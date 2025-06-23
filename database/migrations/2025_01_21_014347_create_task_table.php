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
        Schema::create('task', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karyawan_id')->constrained('employees')->onDelete('cascade');
            $table->date('tanggal_laporan');
            $table->string('trouble');
            $table->string('solusi');
            $table->foreignId('kategori_id')->constrained('category_task')->onDelete('cascade');
            $table->enum('status',['Close', 'Cancel', 'Pending']);
            $table->string('keterangan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task');
    }
};
