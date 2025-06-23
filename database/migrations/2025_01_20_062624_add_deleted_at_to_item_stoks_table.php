<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeletedAtToItemStoksTable extends Migration
{
    public function up()
    {
        Schema::table('item_stoks', function (Blueprint $table) {
            $table->softDeletes(); // Ini akan menambahkan kolom deleted_at
        });
    }

    public function down()
    {
        Schema::table('item_stoks', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}