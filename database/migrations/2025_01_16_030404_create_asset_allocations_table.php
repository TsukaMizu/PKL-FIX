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
        Schema::create('asset_allocations', function (Blueprint $table) {
            $table->id();
            $table->string('nip');
            $table->boolean('laptop_koperasi')->default(false);
            $table->boolean('laptop_ip')->default(false);
            $table->boolean('pc_koperasi')->default(false);
            $table->boolean('pc_ip')->default(false);
            $table->timestamps();
        
            $table->foreign('nip')
                  ->references('nip')
                  ->on('employees')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_allocations');
    }
};
