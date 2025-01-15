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
        Schema::create('asset_repairs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->text('description');
            $table->dateTime('repair_date');
            $table->dateTime('completed_date')->nullable();
            $table->string('handled_by');
            $table->decimal('repair_cost', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_repairs');
    }
};
