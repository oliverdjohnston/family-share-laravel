<?php

namespace App\Console\Commands;

use App\Models\SteamGame;
use App\Services\CDKeysService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateCDKeysPrices extends Command
{
    protected $signature = 'cdkeys:update-prices';
    protected $description = 'Update CDKeys prices for games that don\'t have prices set';

    private CDKeysService $cdkeysService;

    public function __construct(CDKeysService $cdkeysService)
    {
        parent::__construct();
        $this->cdkeysService = $cdkeysService;
    }

    public function handle(): int
    {
        $games = SteamGame::whereNull('cdkeys_value')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($games->isEmpty()) {
            return self::SUCCESS;
        }

        foreach ($games as $game) {
            $this->cdkeysService->updateGamePrice($game);
            sleep(1); // 1 second delay to be respectful to CDKeys API
        }

        Log::info('CDKeys price updates completed', ['games_processed' => $games->count()]);

        return self::SUCCESS;
    }
}
