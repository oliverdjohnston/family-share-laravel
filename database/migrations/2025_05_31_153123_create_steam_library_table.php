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
        if (!Schema::hasTable('steam_library')) {
            Schema::create('steam_library', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('steam_game_id')->constrained()->onDelete('cascade');
                $table->timestamp('acquired_at')->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'steam_game_id']);
                $table->index('user_id');
                $table->index('steam_game_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('steam_library');
    }
};
