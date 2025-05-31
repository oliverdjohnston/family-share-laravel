<?php

namespace App\Http\Controllers;

use App\Models\SteamGame;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $totalGames = SteamGame::count();
        $totalSteamValue = SteamGame::sum('steam_value') ?? 0;
        $averageSteamValue = $totalGames > 0 ? ($totalSteamValue / $totalGames) : 0;

        return Inertia::render('home', [
            'stats' => [
                'totalGames' => $totalGames,
                'totalSteamValue' => number_format($totalSteamValue, 2),
                'averageSteamValue' => number_format($averageSteamValue, 2),
            ]
        ]);
    }
}
