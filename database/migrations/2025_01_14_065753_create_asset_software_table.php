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
        Schema::create('asset_software', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->string('os')->nullable();
            $table->string('office')->nullable();
            $table->string('office_365')->nullable();
            $table->string('email_365')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_software');
    }
};
