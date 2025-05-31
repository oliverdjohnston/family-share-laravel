<?php

namespace App\Console\Commands;

use App\Models\SteamLibrary;
use App\Services\SteamService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateGamePurchaseDates extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'steam:update-purchase-dates';

    /**
     * The console command description.
     */
    protected $description = 'Update purchase dates for games based on first achievement unlock times';

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
        $libraryEntries = SteamLibrary::with(['user', 'steamGame'])
            ->whereNull('acquired_at')
            ->whereHas('user', fn($q) => $q->whereNotNull('steam_id'))
            ->get();

        if ($libraryEntries->isEmpty()) {
            return self::SUCCESS;
        }

        foreach ($libraryEntries as $entry) {
            $this->steamService->updateGamePurchaseDate($entry->user, $entry->steamGame);
            sleep(1); // 1 second delay to avoid rate limiting
        }

        Log::info('Purchase date updates completed', ['entries_processed' => $libraryEntries->count()]);

        return self::SUCCESS;
    }
}
