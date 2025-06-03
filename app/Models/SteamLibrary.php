<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SteamLibrary extends Model
{
    protected $table = 'steam_library';

    protected $fillable = [
        'user_id',
        'steam_game_id',
        'acquired_at',
    ];

    protected $casts = [
        'acquired_at' => 'datetime',
    ];

    /**
     * Get the user that owns this game.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the Steam game.
     */
    public function steamGame(): BelongsTo
    {
        return $this->belongsTo(SteamGame::class)->where('family_sharing_support', true);
    }
}
