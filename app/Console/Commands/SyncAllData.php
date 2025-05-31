<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class SyncAllData extends Command
{
    protected $signature = 'sync:all';
    protected $description = 'Run all sync commands in sequence';

    public function handle(): int
    {
        try {
            Log::info('Starting complete data sync');

            Artisan::call('steam:sync-libraries');

            Artisan::call('steam:update-purchase-dates');

            Artisan::call('steam:update-prices');

            Artisan::call('cdkeys:update-prices');

            Log::info('Complete data sync finished');

            return self::SUCCESS;
        } catch (\Exception $e) {
            Log::error('Failed to sync all data', ['error' => $e->getMessage()]);
            return self::FAILURE;
        }
    }
}
