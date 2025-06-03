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
        'family_sharing_support',
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

    /**
     * Calculate similarity with smart number matching (reused from CDKeysService)
     */
    public static function calculateSmartSimilarity(string $original, string $candidate): float
    {
        $originalLower = strtolower($original);
        $candidateLower = strtolower($candidate);

        // calculate base similarity by comparing the two names
        $baseSimilarity = 0;
        similar_text($originalLower, $candidateLower, $baseSimilarity);

        // extract the numbers from both names
        $originalNumbers = self::extractNumbers($original);
        $candidateNumbers = self::extractNumbers($candidate);

        // if both have numbers and they're different then reduce the similarity
        if (!empty($originalNumbers) && !empty($candidateNumbers)) {
            $numbersMatch = array_intersect($originalNumbers, $candidateNumbers);
            if (empty($numbersMatch)) {
                $baseSimilarity = $baseSimilarity * 0.2; // reduce the similarity by 80% for number mismatch
            } else {
                $baseSimilarity = min(100, $baseSimilarity * 1.2); // increase the similarity by 20% for number match
            }
        }
        // if original has numbers but candidate doesn't then reduce the similarity by 30%
        elseif (!empty($originalNumbers) && empty($candidateNumbers)) {
            $baseSimilarity = $baseSimilarity * 0.7; // reduce the similarity by 30%
        }

        return $baseSimilarity;
    }

    /**
     * Extract all numbers from game name
     */
    private static function extractNumbers(string $name): array
    {
        // find digits in the name
        preg_match_all('/\d+/', $name, $matches);
        return $matches[0] ?? [];
    }
}
