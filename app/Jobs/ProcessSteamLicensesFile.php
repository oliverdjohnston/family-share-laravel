<?php

namespace App\Jobs;

use App\Models\SteamGame;
use App\Models\SteamLibrary;
use App\Models\User;
use App\Notifications\SteamLicensesProcessed;
use Carbon\Carbon;
use DOMDocument;
use DOMXPath;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessSteamLicensesFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected User $user;
    protected string $filePath;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, string $filePath)
    {
        $this->user = $user;
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $htmlContent = Storage::disk('private')->get($this->filePath);

            if (!$htmlContent) {
                Log::error('Failed to read Steam licenses file', ['user_id' => $this->user->id]);
                return;
            }

            $updated = $this->parseAndUpdateLicenses($htmlContent);

            // set the steam_licenses_uploaded column to true
            $this->user->update(['steam_licenses_uploaded' => true]);

            // clean up the uploaded file
            Storage::disk('private')->delete($this->filePath);

            Log::info('Steam licenses processed', ['user_id' => $this->user->id, 'updated' => $updated]);

            // send email notification
            $this->user->notify(new SteamLicensesProcessed($this->user));

        } catch (\Exception $e) {
            Log::error('Failed to process Steam licenses file', [
                'user_id' => $this->user->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Parse HTML content and update license data
     */
    private function parseAndUpdateLicenses(string $htmlContent): int
    {
        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($htmlContent);
        libxml_clear_errors();

        $xpath = new DOMXPath($dom);
        $table = $xpath->query("//table[contains(@class, 'account_table')]")->item(0);

        if (!$table) {
            Log::warning('Could not find account_table in HTML', ['user_id' => $this->user->id]);
            return 0;
        }

        $rows = $xpath->query(".//tr[position()>1]", $table);
        $updated = 0;

        foreach ($rows as $row) {
            $cells = $xpath->query(".//td", $row);
            if ($cells->length < 3) continue;

            $dateText = trim($cells->item(0)->textContent);
            $itemText = trim($cells->item(1)->textContent);

            if (empty($dateText) || empty($itemText)) continue;

            // parse date
            $acquiredAt = $this->parseDate($dateText);
            if (!$acquiredAt) continue;

            // find matching game using similarity
            $steamGame = $this->findGame($itemText);

            if ($steamGame) {
                SteamLibrary::updateOrCreate(
                    [
                        'user_id' => $this->user->id,
                        'steam_game_id' => $steamGame->id,
                    ],
                    [
                        'acquired_at' => $acquiredAt,
                    ]
                );
                $updated++;
            }
        }

        return $updated;
    }

    /**
     * Parse date string from Steam format
     */
    private function parseDate(string $dateText): ?Carbon
    {
        try {
            return Carbon::createFromFormat('j M, Y', $dateText);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Find matching Steam game by name
     */
    private function findGame(string $gameName): ?SteamGame
    {
        $bestMatch = null;
        $highestSimilarity = 0;

        SteamGame::chunk(100, function ($games) use ($gameName, &$bestMatch, &$highestSimilarity) {
            foreach ($games as $game) {
                $similarity = SteamGame::calculateSmartSimilarity($gameName, $game->name);
                if ($similarity > $highestSimilarity && $similarity >= 50) {
                    $highestSimilarity = $similarity;
                    $bestMatch = $game;
                }
            }
        });

        return $bestMatch;
    }
}
