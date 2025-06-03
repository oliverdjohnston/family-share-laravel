<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'steam_id',
        'steam_licenses_uploaded',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'steam_licenses_uploaded' => 'boolean',
        ];
    }

    /**
     * Get the user's Steam library entries.
     */
    public function steamLibrary(): HasMany
    {
        return $this->hasMany(SteamLibrary::class)
            ->whereHas('steamGame', function ($query) {
                $query->where('family_sharing_support', true);
            });
    }

    /**
     * Alias for steamLibrary for better naming in some contexts
     */
    public function steamLibraryEntries(): HasMany
    {
        return $this->steamLibrary();
    }

    /**
     * Get Steam games the user owns.
     */
    public function steamGames()
    {
        return $this->belongsToMany(SteamGame::class, 'steam_library');
    }
}
