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
        if (!Schema::hasColumn('steam_games', 'family_sharing_support')) {
            Schema::table('steam_games', function (Blueprint $table) {
                $table->boolean('family_sharing_support')->default(false)->after('cdkeys_value');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('steam_games', 'family_sharing_support')) {
            Schema::table('steam_games', function (Blueprint $table) {
                $table->dropColumn('family_sharing_support');
            });
        }
    }
};
