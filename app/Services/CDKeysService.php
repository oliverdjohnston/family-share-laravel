<?php

namespace App\Services;

use App\Models\SteamGame;
use App\Services\Api\CDKeysApiService;
use Illuminate\Support\Facades\Log;

class CDKeysService
{
    private CDKeysApiService $cdkeysApi;

    public function __construct(CDKeysApiService $cdkeysApi)
    {
        $this->cdkeysApi = $cdkeysApi;
    }

    /**
     * Update game price from CDKeys
     */
    public function updateGamePrice(SteamGame $game): bool
    {
        try {
            if ($game->cdkeys_value !== null) {
                return false;
            }

            $searchResults = $this->cdkeysApi->searchGamePrice($game->name);

            if (!$searchResults || !isset($searchResults['results'][0]['hits']) || empty($searchResults['results'][0]['hits'])) {
                $game->update(['cdkeys_value' => 0]);
                return true;
            }

            $hits = $searchResults['results'][0]['hits'];
            $originalName = $game->name;
            $bestMatch = null;
            $highestSimilarity = 0;

            // check all returned results for the best match
            foreach ($hits as $hit) {
                if (!isset($hit['name']['default'])) {
                    continue;
                }

                $returnedName = $hit['name']['default'];
                $similarity = $this->calculateSmartSimilarity($originalName, $returnedName);

                // determine the best match by similarity
                if ($similarity > $highestSimilarity) {
                    $highestSimilarity = $similarity;
                    $bestMatch = $hit;
                }
            }

            // only accept if best similarity is at least 60% and set the price to 0 if no match is found
            if ($highestSimilarity < 60 || !$bestMatch) {
                $game->update(['cdkeys_value' => 0]);
                return true;
            }

            // check if the best match has a GBP price
            if (isset($bestMatch['price']['GBP']['default'])) {
                $priceInPounds = $bestMatch['price']['GBP']['default'];
                $game->update(['cdkeys_value' => $priceInPounds]);
                return true;
            }

            // if best match has no GBP price, set to 0
            $game->update(['cdkeys_value' => 0]);
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to update CDKeys price', ['game_id' => $game->id, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Calculate similarity with smart number matching
     */
    private function calculateSmartSimilarity(string $original, string $candidate): float
    {
        $originalLower = strtolower($original);
        $candidateLower = strtolower($candidate);

        // calculate base similarity by comparing the two names
        $baseSimilarity = 0;
        similar_text($originalLower, $candidateLower, $baseSimilarity);

        // extract the numbers from both names
        $originalNumbers = $this->extractNumbers($original);
        $candidateNumbers = $this->extractNumbers($candidate);

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
    private function extractNumbers(string $name): array
    {
        // find digits in the name
        preg_match_all('/\d+/', $name, $matches);
        return $matches[0] ?? [];
    }
}
