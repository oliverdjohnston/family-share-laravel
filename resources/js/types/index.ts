// User related types
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    steam_id?: string;
    steam_licenses_uploaded?: boolean;
    created_at?: string;
    updated_at?: string;
}

// Statistics types
export interface Stats {
    totalGames: number;
    totalSteamValue: string;
    averageSteamValue: string;
}

// Dashboard related types
export interface UserStats {
    id: number;
    name: string;
    game_count: number;
    total_value: number;
    recent_purchases: {
        "3_months": number;
        "6_months": number;
        "12_months": number;
    };
}

export interface RecentGame {
    game_name: string;
    user_name: string;
    acquired_at: string;
    steam_value: number;
    cdkeys_value: number;
    selected_value: number;
    icon_url: string | null;
}

export interface ComparisonGame {
    id: number;
    game_name: string;
    user_name: string;
    user_id: number;
    acquired_at: string;
    acquired_at_raw: string;
    steam_value: number;
    cdkeys_value: number;
    icon_url: string | null;
}

export interface MonthlyTrend {
    month: string;
    games: number;
}

export interface ValueComparison {
    user: string;
    value: number;
    games: number;
}

export interface DashboardData {
    userStats: UserStats[];
    currentUserStats: UserStats | null;
    recentGames: RecentGame[];
    comparisonGames: ComparisonGame[];
    monthlyTrends: MonthlyTrend[];
    valueComparison: ValueComparison[];
    currentUser: {
        id: number;
        name: string;
    };
    selectedPeriod: string;
    periodLabel: string;
    valueType: string;
    valueTypeLabel: string;
    userFilter?: string | null;
    allUsers: {
        id: number;
        name: string;
    }[];
    activeTab: string;
    steamLicensesUploaded: boolean;
}

// page props
export interface PageProps extends Record<string, unknown> {
    auth?: {
        user?: User;
    };
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    stats?: Stats;
}

// form error types
export interface FormErrors {
    [key: string]: string;
}
