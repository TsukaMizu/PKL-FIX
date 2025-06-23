<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('item_stocks', function (Blueprint $table) {
            $table->enum('status_inventaris',['Sewa','Milik']);
        });
    }
    
    public function down()
    {
        Schema::table('item_stocks', function (Blueprint $table) {
            $table->dropColumn('status_inventaris');
        });
    }
};
