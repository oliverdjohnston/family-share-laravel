// User related types
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;
}

// Statistics types
export interface Stats {
    totalGames: number;
    totalSteamValue: string;
    averageSteamValue: string;
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
