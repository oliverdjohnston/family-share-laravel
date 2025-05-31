<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteamApiService
{
    private ?string $apiKey;
    private string $baseUrl;
    private string $storeUrl;

    public function __construct()
    {
        $this->apiKey = config('services.steam.api_key');
        $this->baseUrl = 'https://api.steampowered.com';
        $this->storeUrl = 'https://store.steampowered.com';
    }

    /**
     * Get HTTP client with proper headers
     */
    private function getHttpClient()
    {
        return Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept' => 'application/json',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Accept-Encoding' => 'gzip, deflate, br',
            'Connection' => 'keep-alive',
            'Cache-Control' => 'no-cache',
        ]);
    }

    /**
     * Get owned games for a Steam user
     */
    public function getOwnedGames(string $steamId, bool $includeAppInfo = true): ?array
    {
        // return null if the API key is not configured
        if (!$this->apiKey) {
            Log::warning('Steam API key not configured');
            return null;
        }

        $url = "{$this->baseUrl}/IPlayerService/GetOwnedGames/v0001/";

        $params = [
            'key' => $this->apiKey,
            'steamid' => $steamId,
            'include_appinfo' => $includeAppInfo ? 1 : 0,
            'format' => 'json',
        ];

        try {
            $response = $this->getHttpClient()->get($url, $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Steam API GetOwnedGames failed');
            return null;
        } catch (\Exception $e) {
            Log::error('Steam API GetOwnedGames exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get player achievements for a specific game
     */
    public function getPlayerAchievements(string $steamId, int $appId): ?array
    {
        // return null if the API key is not configured
        if (!$this->apiKey) {
            Log::warning('Steam API key not configured');
            return null;
        }

        $url = "{$this->baseUrl}/ISteamUserStats/GetPlayerAchievements/v1/";

        $params = [
            'key' => $this->apiKey,
            'steamid' => $steamId,
            'appid' => $appId,
            'format' => 'json',
        ];

        try {
            $response = $this->getHttpClient()->get($url, $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Steam API GetPlayerAchievements failed');
            return null;
        } catch (\Exception $e) {
            Log::error('Steam API GetPlayerAchievements exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get app details including price from Steam Store API
     */
    public function getAppDetails(int $appId): ?array
    {
        $url = "{$this->storeUrl}/api/appdetails";

        $params = [
            'appids' => $appId,
        ];

        try {
            $response = $this->getHttpClient()->get($url, $params);

            if ($response->successful()) {
                $data = $response->json();
                return $data[$appId] ?? null;
            }

            Log::error('Steam Store API getAppDetails failed');
            return null;
        } catch (\Exception $e) {
            Log::error('Steam Store API getAppDetails exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get Steam user profile information
     */
    public function getPlayerSummaries(string $steamId): ?array
    {
        // return null if the API key is not configured
        if (!$this->apiKey) {
            Log::warning('Steam API key not configured');
            return null;
        }

        $url = "{$this->baseUrl}/ISteamUser/GetPlayerSummaries/v0002/";

        $params = [
            'key' => $this->apiKey,
            'steamids' => $steamId,
            'format' => 'json',
        ];

        try {
            $response = $this->getHttpClient()->get($url, $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Steam API GetPlayerSummaries failed');
            return null;
        } catch (\Exception $e) {
            Log::error('Steam API GetPlayerSummaries exception: ' . $e->getMessage());
            return null;
        }
    }
}
