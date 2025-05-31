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
        if (!Schema::hasTable('user_steam_profiles')) {
            Schema::create('user_steam_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('steam_id')->unique();
                $table->string('steam_username')->nullable();
                $table->timestamp('last_synced_at')->nullable();
                $table->timestamps();

                $table->index('user_id');
                $table->index('steam_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_steam_profiles');
    }
};
