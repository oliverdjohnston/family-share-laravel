<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\SteamLibrary;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    private const PERIOD_MAP = [
        '3_months' => 3,
        '6_months' => 6,
        '12_months' => 12
    ];

    private const PERIOD_LABELS = [
        '3_months' => 'Last 3 Months',
        '6_months' => 'Last 6 Months',
        '12_months' => 'Last 12 Months'
    ];

    /**
     * Display the dashboard overview (main page)
     */
    public function index(Request $request)
    {
        return $this->renderDashboard($request, 'overview');
    }

    /**
     * Display the trends tab
     */
    public function trends(Request $request)
    {
        return $this->renderDashboard($request, 'trends');
    }

    /**
     * Display the recent games tab
     */
    public function recent(Request $request)
    {
        return $this->renderDashboard($request, 'recent');
    }

    /**
     * Display the comparison tab
     */
    public function compare(Request $request)
    {
        return $this->renderDashboard($request, 'compare');
    }

    /**
     * Render dashboard with specified active tab
     */
    private function renderDashboard(Request $request, string $activeTab)
    {
        $currentUser = Auth::user();
        $period = $request->get('period', '3_months');
        $valueType = $request->get('valueType', 'steam');
        $userFilter = $request->get('user');

        // check if the period and valueType are valid
        $period = array_key_exists($period, self::PERIOD_MAP) ? $period : '3_months';
        $valueType = in_array($valueType, ['steam', 'cdkeys']) ? $valueType : 'steam';

        // get all users with their steam libraries and games
        $allUsers = User::with('steamLibrary.steamGame')->whereHas('steamLibrary')->get();

        // get user statistics for all users
        $userStats = $this->getUserStats($allUsers, $valueType);

        // find current users stats
        $currentUserStats = $userStats->firstWhere('id', $currentUser->id);

        // get period data
        $months = self::PERIOD_MAP[$period];
        $recentGames = $this->getRecentGames($months, $valueType);
        $comparisonGames = $this->getComparisonGames( $userFilter);
        $monthlyTrends = $this->getMonthlyTrends();

        // value comparison always shows all users
        $valueComparison = $this->getValueComparison($userStats);

        return Inertia::render('dashboard/index', [
            'userStats' => $userStats,
            'currentUserStats' => $currentUserStats,
            'recentGames' => $recentGames,
            'comparisonGames' => $comparisonGames,
            'monthlyTrends' => $monthlyTrends,
            'valueComparison' => $valueComparison,
            'currentUser' => ['id' => $currentUser->id, 'name' => $currentUser->name],
            'selectedPeriod' => $period,
            'periodLabel' => self::PERIOD_LABELS[$period],
            'valueType' => $valueType,
            'valueTypeLabel' => $valueType === 'cdkeys' ? 'CDKeys' : 'Steam',
            'userFilter' => $userFilter,
            'allUsers' => User::whereHas('steamLibrary')->select('id', 'name')->get(),
            'activeTab' => $activeTab
        ]);
    }

    /**
     * Get user statistics with game counts and values (always all users)
     */
    private function getUserStats($users, $valueType)
    {
        return $users->map(function ($user) use ($valueType) {
            // get the total value of the users steam library
            $totalValue = $user->steamLibrary->sum(function ($entry) use ($valueType) {
                return $this->getSafeValue($entry->steamGame, $valueType);
            });

            return [
                'id' => $user->id,
                'name' => $user->name,
                'game_count' => $user->steamLibrary->count(),
                'total_value' => $totalValue,
                'recent_purchases' => [
                    '3_months' => $user->steamLibrary->where('acquired_at', '>=', Carbon::now()->subMonths(3))->count(),
                    '6_months' => $user->steamLibrary->where('acquired_at', '>=', Carbon::now()->subMonths(6))->count(),
                    '12_months' => $user->steamLibrary->where('acquired_at', '>=', Carbon::now()->subMonths(12))->count(),
                ]
            ];
        });
    }

    /**
     * Get recent games (not filtered by user)
     */
    private function getRecentGames($months, $valueType)
    {
        return SteamLibrary::with(['steamGame', 'user'])
            ->where('acquired_at', '>=', Carbon::now()->subMonths($months))
            ->whereNotNull('acquired_at')
            ->orderBy('acquired_at', 'desc')
            ->get()
            ->map(function ($entry) use ($valueType) {
                return [
                    'game_name' => $entry->steamGame->name,
                    'user_name' => $entry->user->name,
                    'acquired_at' => $entry->acquired_at->format('M j, Y'),
                    'selected_value' => $this->getSafeValue($entry->steamGame, $valueType),
                    'icon_url' => $entry->steamGame->icon_url,
                ];
            });
    }

    /**
     * Get comparison games data with optional user filtering
     */
    private function getComparisonGames($userFilter = null)
    {
        // get all steam libraries with their steam games and users
        $query = SteamLibrary::with(['steamGame', 'user'])->orderBy('acquired_at', 'desc');

        // if a user filter is provided, filter the query by the user id
        if ($userFilter) {
            $query->where('user_id', $userFilter);
        }

        return $query->get()->map(function ($entry) {
            return [
                'id' => $entry->id,
                'game_name' => $entry->steamGame->name,
                'user_name' => $entry->user->name,
                'user_id' => $entry->user->id,
                'acquired_at' => $entry->acquired_at?->format('M j, Y') ?? 'Unknown',
                'steam_value' => $this->getSafeValue($entry->steamGame, 'steam'),
                'cdkeys_value' => $this->getSafeValue($entry->steamGame, 'cdkeys'),
                'icon_url' => $entry->steamGame->icon_url,
            ];
        });
    }

    /**
     * Get monthly acquisition trends (not filtered by user)
     */
    private function getMonthlyTrends()
    {
        // get the monthly trends for the last 12 months
        return collect(range(11, 0))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);

            return [
                'month' => $date->format('M Y'),
                'games' => SteamLibrary::whereYear('acquired_at', $date->year)->whereMonth('acquired_at', $date->month)->count(),
            ];
        });
    }

    /**
     * Get value comparison data (always all users for overview)
     */
    private function getValueComparison($userStats)
    {
        // get the value comparison for all users
        return $userStats->map(fn($user) => [
            'user' => $user['name'],
            'value' => round($user['total_value'], 2),
            'games' => $user['game_count'],
        ])->sortByDesc('value')->values();
    }

    /**
     * Get safe numeric value from game data
     */
    private function getSafeValue($game, $type)
    {
        // get the value of the game
        $value = $type === 'cdkeys' ? $game->cdkeys_value : $game->steam_value;
        return is_numeric($value) ? (float) $value : 0;
    }
}
