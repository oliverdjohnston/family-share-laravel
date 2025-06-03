import { router } from "@inertiajs/react";
import { toast } from "sonner";

// Utility functions for dashboard

/**
 * Format currency values consistently
 */
export const formatCurrency = (value: number | null | undefined): string => {
    return `£${(value || 0).toFixed(2)}`;
};

/**
 * Format large numbers with K/M suffixes for mobile displays
 */
export const formatCompactNumber = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
};

/**
 * Get responsive chart dimensions based on screen size
 */
export const getChartDimensions = () => {
    const isMobile = window.innerWidth < 768;
    return {
        height: isMobile ? 250 : 300,
        margin: isMobile ? { top: 10, right: 10, left: 10, bottom: 40 } : { top: 20, right: 20, left: 20, bottom: 60 },
    };
};

/**
 * Truncate text for mobile displays
 */
export const truncateText = (text: string, maxLength: number = 20): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Navigate to dashboard route with parameters
 */
export const navigateDashboard = (route: string, params: Record<string, string | undefined> = {}) => {
    router.get(route, params, { preserveState: true, preserveScroll: true });
};

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
};
