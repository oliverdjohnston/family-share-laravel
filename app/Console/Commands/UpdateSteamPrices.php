<?php

namespace App\Console\Commands;

use App\Models\SteamGame;
use App\Services\SteamService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateSteamPrices extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'steam:update-prices';

    /**
     * The console command description.
     */
    protected $description = 'Update Steam prices for games that don\'t have prices set';

    private SteamService $steamService;

    public function __construct(SteamService $steamService)
    {
        parent::__construct();
        $this->steamService = $steamService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $games = SteamGame::whereNull('steam_value')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($games->isEmpty()) {
            return self::SUCCESS;
        }

        foreach ($games as $game) {
            $this->steamService->updateGamePrice($game);
            sleep(1); // 1 second delay to avoid rate limiting
        }

        Log::info('Price updates completed', ['games_processed' => $games->count()]);

        return self::SUCCESS;
    }
}
