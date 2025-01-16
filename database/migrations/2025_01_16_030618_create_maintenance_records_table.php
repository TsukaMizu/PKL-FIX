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
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->string('jenis_maintenance');
            $table->text('masalah')->nullable();
            $table->text('tindakan')->nullable();
            $table->decimal('biaya', 15, 2)->nullable();
            $table->string('vendor')->nullable();
            $table->enum('status', ['ongoing', 'completed', 'cancelled']);
            $table->foreignId('recorded_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
    }
};
