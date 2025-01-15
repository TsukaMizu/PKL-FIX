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
        Schema::create('asset_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->enum('status_lama', ['bagus', 'rusak', 'hilang']);
            $table->enum('status_baru', ['bagus', 'rusak', 'hilang']);
            $table->text('keterangan')->nullable();
            $table->string('changed_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_status_history');
    }
};
