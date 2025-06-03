<?php

namespace App\Console\Commands;

use App\Models\SteamGame;
use App\Services\SteamService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateFamilySharing extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'steam:update-family-sharing';

    /**
     * The console command description.
     */
    protected $description = 'Update family sharing support status for all Steam games';

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
        $games = SteamGame::all();

        if ($games->isEmpty()) {
            return self::SUCCESS;
        }

        foreach ($games as $game) {
            $this->steamService->updateFamilySharingSupport($game);
            sleep(1); // 1 second delay to avoid rate limiting
        }

        Log::info('Family sharing update completed', ['games_processed' => $games->count()]);

        return self::SUCCESS;
    }
}
