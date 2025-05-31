<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SteamGame extends Model
{
    protected $fillable = [
        'appid',
        'name',
        'img_icon_url',
        'steam_value',
        'cdkeys_value',
    ];

    protected $casts = [
        'steam_value' => 'decimal:2',
        'cdkeys_value' => 'decimal:2',
    ];

    /**
     * Get the library entries for this Steam game.
     */
    public function libraryEntries(): HasMany
    {
        return $this->hasMany(SteamLibrary::class);
    }

    /**
     * Get users who own this game.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'steam_library');
    }

    /**
     * Get the full Steam icon URL
     */
    public function getIconUrlAttribute(): ?string
    {
        if (!$this->img_icon_url) {
            return null;
        }

        return "https://media.steampowered.com/steamcommunity/public/images/apps/{$this->appid}/{$this->img_icon_url}.jpg";
    }
}
