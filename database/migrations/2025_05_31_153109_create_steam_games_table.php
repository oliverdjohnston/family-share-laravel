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
        if (!Schema::hasTable('steam_games')) {
            Schema::create('steam_games', function (Blueprint $table) {
                $table->id();
                $table->string('appid')->unique();
                $table->string('name');
                $table->string('img_icon_url')->nullable();
                $table->decimal('steam_value', 8, 2)->nullable();
                $table->decimal('cdkeys_value', 8, 2)->nullable();
                $table->timestamps();

                $table->index('appid');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('steam_games');
    }
};
