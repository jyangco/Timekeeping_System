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
        Schema::create('userlogs', function (Blueprint $table) {
            $table->id('userlog_id');
            $table->date('date');
            $table->string('morning_timein');
            $table->string('morning_timeout');
            $table->string('afternoon_timein');
            $table->string('afternoon_timeout');
            $table->string('attachment');
            $table->integer('employee_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('userlogs');
    }
};
