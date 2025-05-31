<?php

namespace App\Services\Api;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CDKeysApiService
{
    private string $baseUrl;
    private ?string $apiKey;
    private ?string $applicationId;

    public function __construct()
    {
        $this->baseUrl = 'https://muvyib7tey-dsn.algolia.net/1/indexes/*/queries';
        $this->apiKey = config('services.cdkeys.algolia_api_key');
        $this->applicationId = config('services.cdkeys.algolia_application_id');
    }

    /**
     * Get HTTP client with proper headers for CDKeys API
     */
    private function getHttpClient()
    {
        return Http::withHeaders([
            'x-algolia-api-key' => $this->apiKey ?? '',
            'x-algolia-application-id' => $this->applicationId ?? '',
            'x-algolia-agent' => 'Algolia for JavaScript (4.13.1); Browser; instantsearch.js (4.41.0); Magento2 integration (3.10.5); JS Helper (3.8.2)',
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ]);
    }

    /**
     * Search for a game by name and get its price
     */
    public function searchGamePrice(string $gameName): ?array
    {
        // return null if the API key or application ID is not configured
        if (!$this->apiKey || !$this->applicationId) {
            Log::warning('CDKeys API credentials not configured');
            return null;
        }

        $params = "highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&ruleContexts=%5B%22magento_filters%22%5D&hitsPerPage=5&clickAnalytics=true&query=" . urlencode($gameName) . "&maxValuesPerFacet=1&facets=%5B%22restricted_countries.default%22%2C%22platforms.default%22%2C%22region.default%22%2C%22language.default%22%2C%22genres.default%22%2C%22price.GBP.default%22%5D&tagFilters=&facetFilters=%5B%22restricted_countries.default%3A-GB%22%2C%5B%22platforms.default%3ASteam%22%5D%5D&numericFilters=%5B%22visibility_search.default%3D1%22%2C%5B%22region_id.default%3D39%22%2C%22region_id.default%3D36%22%2C%22region_id.default%3D38%22%2C%22region_id.default%3D479%22%2C%22region_id.default%3D3505%22%5D%5D";

        $payload = [
            'requests' => [
                [
                    'indexName' => 'magento2_default_products',
                    'params' => $params
                ]
            ]
        ];

        try {
            $response = $this->getHttpClient()->retry(3, 250)->post($this->baseUrl, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('CDKeys API search failed');
            return null;
        } catch (\Exception $e) {
            Log::error('CDKeys API search exception: ' . $e->getMessage());
            return null;
        }
    }
}
