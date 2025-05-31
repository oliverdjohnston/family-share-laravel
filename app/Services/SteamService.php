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

                // only create if it doesn't exist
                SteamLibrary::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'steam_game_id' => $steamGame->id,
                    ],
                    [
                        'acquired_at' => null,
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
     * Update purchase date for a game based on first achievement
     */
    public function updateGamePurchaseDate(User $user, SteamGame $game): bool
    {
        try {
            if (!$user->steam_id) {
                return false;
            }

            $achievementsData = $this->steamApi->getPlayerAchievements($user->steam_id, (int)$game->appid);

            if (!$achievementsData || !isset($achievementsData['playerstats']['achievements'])) {
                return false;
            }

            $earliestTime = null;

            // get the earliest achievement unlock time
            foreach ($achievementsData['playerstats']['achievements'] as $achievement) {
                if ($achievement['achieved'] == 1 && isset($achievement['unlocktime']) && $achievement['unlocktime'] > 0) {
                    if ($earliestTime === null || $achievement['unlocktime'] < $earliestTime) {
                        $earliestTime = $achievement['unlocktime'];
                    }
                }
            }

            // if we have an earliest time, update the purchase date. (this is an estimate of the purchase date as Steam doesn't provide this information)
            if ($earliestTime) {
                $purchaseDate = Carbon::createFromTimestamp($earliestTime);

                SteamLibrary::where('user_id', $user->id)
                    ->where('steam_game_id', $game->id)
                    ->update(['acquired_at' => $purchaseDate]);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Failed to update game purchase date', ['user_id' => $user->id, 'game_id' => $game->id, 'error' => $e->getMessage()]);
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
     * Get games owned by multiple users (for comparison)
     */
    public function getSharedGames(array $userIds): array
    {
        return SteamGame::whereHas('libraryEntries', function ($query) use ($userIds) {
            $query->whereIn('user_id', $userIds);
        })
        ->withCount(['libraryEntries' => function ($query) use ($userIds) {
            $query->whereIn('user_id', $userIds);
        }])
        ->having('library_entries_count', '>', 1)
        ->get()
        ->toArray();
    }

    /**
     * Get unique games for a user (games that others don't have)
     */
    public function getUniqueGames(User $user, array $compareWithUserIds = []): array
    {
        $query = SteamGame::whereHas('libraryEntries', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });

        if (!empty($compareWithUserIds)) {
            $query->whereDoesntHave('libraryEntries', function ($q) use ($compareWithUserIds) {
                $q->whereIn('user_id', $compareWithUserIds);
            });
        }

        return $query->get()->toArray();
    }
}
