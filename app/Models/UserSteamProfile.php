<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSteamProfile extends Model
{
    protected $fillable = [
        'user_id',
        'steam_id',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get the user that owns this Steam profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
