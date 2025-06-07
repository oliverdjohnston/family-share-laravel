<?php

namespace App\Services;

use App\Models\SteamGame;
use App\Models\SteamLibrary;
use App\Models\User;
use App\Services\Api\SteamApiService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SteamService
{
    private SteamApiService $steamApi;

    public function __construct(SteamApiService $steamApi)
    {
        $this->steamApi = $steamApi;
    }

    /**
     * Sync a user's Steam library
     */
    public function syncUserLibrary(User $user): bool
    {
        try {
            if (!$user->steam_id) {
                return false;
            }

            $gamesData = $this->steamApi->getOwnedGames($user->steam_id);

            if (!$gamesData || !isset($gamesData['response']['games'])) {
                return false;
            }

            // update the games and library entries
            foreach ($gamesData['response']['games'] as $gameData) {
                $steamGame = SteamGame::updateOrCreate(
                    ['appid' => $gameData['appid']],
                    [
                        'name' => $gameData['name'] ?? 'Unknown Game',
                        'img_icon_url' => $gameData['img_icon_url'] ?? null,
                    ]
                );

                // for new games, set acquired_at to now if user has uploaded licenses
                $defaultAcquiredAt = $user->steam_licenses_uploaded ? now() : null;

                // only create if it doesn't exist (if the user has uploaded licenses, we don't want to overwrite the existing data)
                SteamLibrary::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'steam_game_id' => $steamGame->id,
                    ],
                    [
                        'acquired_at' => $defaultAcquiredAt,
                    ]
                );
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to sync user library', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Update game price from Steam Store (excluding free games)
     */
    public function updateGamePrice(SteamGame $game): bool
    {
        try {
            if ($game->steam_value !== null) {
                return false;
            }

            $appDetails = $this->steamApi->getAppDetails((int)$game->appid);

            if (!$appDetails || !isset($appDetails['success']) || !$appDetails['success']) {
                return false;
            }

            $data = $appDetails['data'];

            // set the price if it's a paid game (use initial price, not discounted final price)
            if (isset($data['price_overview']['initial'])) {
                $priceInPounds = $data['price_overview']['initial'] / 100;
                $game->update(['steam_value' => $priceInPounds]);
                return true;
            }

            // if there is no price, set it to 0
            $game->update(['steam_value' => 0]);
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to update game price', ['game_id' => $game->id, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Update family sharing support status for a game
     */
    public function updateFamilySharingSupport(SteamGame $game): bool
    {
        try {
            // if the game already supports family sharing, don't update it
            if ($game->family_sharing_support === true) {
                return false;
            }

            $appDetails = $this->steamApi->getAppDetails($game->appid);

            // if the app details are not found, return false
            if (!$appDetails || !isset($appDetails['success']) || !$appDetails['success']) {
                return false;
            }

            // if the app details are found, get the data
            $data = $appDetails['data'];

            // check if the game supports family sharing (category ID 62)
            $supportsFamilySharing = false;

            if (isset($data['categories']) && is_array($data['categories'])) {
                foreach ($data['categories'] as $category) {
                    if (isset($category['id']) && $category['id'] === 62) {
                        $supportsFamilySharing = true;
                        break;
                    }
                }
            }

            // update the family sharing support status
            $game->update(['family_sharing_support' => $supportsFamilySharing]);
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to update family sharing support', ['game_id' => $game->id, 'error' => $e->getMessage()]);
            return false;
        }
    }
}
