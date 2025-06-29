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
        return Http::acceptJson()->withUserAgent('FamilyShareComparison/1.0');
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
            $response = $this->getHttpClient()->retry(3, 1000)->get($url, $params);

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
     * Get app details including price from Steam Store API
     */
    public function getAppDetails(int $appId): ?array
    {
        $url = "{$this->storeUrl}/api/appdetails";

        $params = [
            'appids' => $appId,
            'cc' => 'GB',
        ];

        try {
            $response = $this->getHttpClient()->retry(3, 1000)->get($url, $params);

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
     * Search for games on Steam Store
     */
    public function getStoreSearch(string $query): ?array
    {
        $url = "{$this->storeUrl}/api/storesearch";

        $params = [
            'term' => $query,
            'cc' => 'GB',
        ];

        try {
            $response = $this->getHttpClient()->retry(3, 1000)->get($url, $params);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Steam Store API getStoreSearch failed');
            return null;
        } catch (\Exception $e) {
            Log::error('Steam Store API getStoreSearch exception: ' . $e->getMessage());
            return null;
        }
    }
}
