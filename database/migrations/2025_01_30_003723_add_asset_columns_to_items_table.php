<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_xx_xx_add_asset_columns_to_items_table.php
public function up()
{
    Schema::table('items', function (Blueprint $table) {
        // Kolom yang dipindahkan dari tabel assets
        $table->enum('status', ['bagus', 'rusak', 'hilang', 'unknown'])->default('bagus');
        $table->integer('wellness')->default(100);
        $table->json('riwayat_perbaikan')->nullable();
        $table->json('riwayat_pemakai')->nullable();
        $table->text('catatan')->nullable();
        
        // Kolom tracking
        $table->string('created_by')->nullable();
        $table->string('updated_by')->nullable();
        $table->timestamp('serial_number_added_at')->nullable();
    });
}

public function down()
{
    Schema::table('items', function (Blueprint $table) {
        $table->dropForeign(['employee_id']);
        $table->dropColumn([
            'employee_id',
            'tanggal_terima',
            'tanggal_kembali',
            'status',
            'wellness',
            'riwayat_perbaikan',
            'riwayat_pemakai',
            'catatan',
            'created_by',
            'updated_by',
            'serial_number_added_at'
        ]);
    });
}
};
