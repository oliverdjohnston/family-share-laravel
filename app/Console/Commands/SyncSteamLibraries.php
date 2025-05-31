<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\SteamService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncSteamLibraries extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'steam:sync-libraries';

    /**
     * The console command description.
     */
    protected $description = 'Sync Steam libraries for all users with Steam IDs';

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
        $users = User::whereNotNull('steam_id')->get();

        if ($users->isEmpty()) {
            return self::SUCCESS;
        }

        foreach ($users as $user) {
            $this->steamService->syncUserLibrary($user);
            sleep(1); // 1 second delay to avoid rate limiting
        }

        Log::info('Steam library sync completed', ['users_processed' => $users->count()]);

        return self::SUCCESS;
    }
}
