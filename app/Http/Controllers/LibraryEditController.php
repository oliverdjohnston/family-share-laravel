<?php

namespace App\Http\Controllers;

use App\Models\SteamGame;
use App\Models\SteamLibrary;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class LibraryEditController extends Controller
{
    /**
     * Display the edit page with games
     */
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        $showAllUsers = $request->boolean('all_users', false);

        if ($showAllUsers) {
            $comparisonGames = $this->getAllEditableGames();
            $allUsers = User::orderBy('name')->get(['id', 'name']);
        } else {
            $comparisonGames = $this->getEditableGames($currentUser->id);
            $allUsers = [];
        }

        return Inertia::render('library/edit', [
            'comparisonGames' => $comparisonGames,
            'currentUser' => ['id' => $currentUser->id, 'name' => $currentUser->name],
            'allUsers' => $allUsers,
            'showAllUsers' => $showAllUsers,
        ]);
    }

    /**
     * Bulk update games
     */
    public function bulkUpdate(Request $request)
    {
        $updates = $request->input('updates', []);

        $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|integer',
            'updates.*.acquired_at' => 'nullable|date',
            'updates.*.steam_value' => 'nullable|numeric|min:0',
            'updates.*.cdkeys_value' => 'nullable|numeric|min:0',
        ]);

        foreach ($updates as $update) {
            $libraryEntry = SteamLibrary::with('steamGame')
                ->where('id', $update['id'])
                ->first();

            if (!$libraryEntry) {
                continue;
            }

            // update the purchase date
            $libraryEntry->update([
                'acquired_at' => isset($update['acquired_at']) && $update['acquired_at'] ? Carbon::parse($update['acquired_at']) : null,
            ]);

            // update the game values
            $libraryEntry->steamGame->update([
                'steam_value' => $update['steam_value'] ?? 0,
                'cdkeys_value' => $update['cdkeys_value'] ?? 0,
            ]);
        }

        return back()->with('success', 'Games updated successfully.');
    }

    /**
     * Update a single game's values
     */
    public function update(Request $request, $gameId)
    {
        $libraryEntry = SteamLibrary::with('steamGame')
            ->where('id', $gameId)
            ->first();

        if (!$libraryEntry) {
            return back()->with('error', 'Game not found.');
        }

        $request->validate([
            'acquired_at' => 'nullable|date',
            'steam_value' => 'nullable|numeric|min:0',
            'cdkeys_value' => 'nullable|numeric|min:0',
        ]);

        // update the library entry (purchase date)
        $libraryEntry->update([
            'acquired_at' => $request->acquired_at ? Carbon::parse($request->acquired_at) : null,
        ]);

        // update the steam game values
        $libraryEntry->steamGame->update([
            'steam_value' => $request->steam_value,
            'cdkeys_value' => $request->cdkeys_value,
        ]);

        return back()->with('success', 'Game updated successfully.');
    }

    /**
     * Delete a game from user's library
     */
    public function destroy($gameId)
    {
        $libraryEntry = SteamLibrary::where('id', $gameId)->first();

        if (!$libraryEntry) {
            return back()->with('error', 'Game not found.');
        }

        $libraryEntry->delete();

        return back()->with('success', 'Game removed from library.');
    }

    /**
     * Get editable games data for all users
     */
    private function getAllEditableGames()
    {
        return SteamLibrary::with(['steamGame', 'user'])
            ->whereHas('steamGame', function ($query) {
                $query->where('family_sharing_support', true);
            })
            ->orderBy('acquired_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'game_name' => $entry->steamGame->name,
                    'user_name' => $entry->user->name,
                    'user_id' => $entry->user->id,
                    'acquired_at' => $entry->acquired_at?->format('Y-m-d') ?? null,
                    'acquired_at_display' => $entry->acquired_at?->format('M j, Y') ?? 'Unknown',
                    'appid' => $entry->steamGame->appid,
                    'steam_value' => $entry->steamGame->steam_value ?? 0,
                    'cdkeys_value' => $entry->steamGame->cdkeys_value ?? 0,
                    'icon_url' => $entry->steamGame->icon_url,
                ];
            });
    }

    /**
     * Get editable games data for a specific user
     */
    private function getEditableGames($userId)
    {
        return SteamLibrary::with(['steamGame', 'user'])
            ->where('user_id', $userId)
            ->whereHas('steamGame', function ($query) {
                $query->where('family_sharing_support', true);
            })
            ->orderBy('acquired_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'game_name' => $entry->steamGame->name,
                    'user_name' => $entry->user->name,
                    'user_id' => $entry->user->id,
                    'acquired_at' => $entry->acquired_at?->format('Y-m-d') ?? null,
                    'acquired_at_display' => $entry->acquired_at?->format('M j, Y') ?? 'Unknown',
                    'appid' => $entry->steamGame->appid,
                    'steam_value' => $entry->steamGame->steam_value ?? 0,
                    'cdkeys_value' => $entry->steamGame->cdkeys_value ?? 0,
                    'icon_url' => $entry->steamGame->icon_url,
                ];
            });
    }
}
