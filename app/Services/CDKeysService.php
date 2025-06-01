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
                $similarity = SteamGame::calculateSmartSimilarity($originalName, $returnedName);

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
}
