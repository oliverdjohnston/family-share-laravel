import { ChartConfig } from "@/components/ui/chart";

export const CHART_COLORS = [
    "oklch(0.8003 0.1821 151.711)",
    "oklch(0.7137 0.1434 254.624)",
    "oklch(0.709 0.1592 293.5412)",
    "oklch(0.8369 0.1644 84.4286)",
    "oklch(0.7845 0.1325 181.912)",
    "oklch(0.7 0.1702 20.12)",
];

export const CHART_CONFIG = {
    games: { label: "Games", color: CHART_COLORS[0] },
    value: { label: "Value", color: CHART_COLORS[1] },
} satisfies ChartConfig;

export const DASHBOARD_TABS = [
    { id: "overview", label: "Overview", route: "/dashboard" },
    { id: "trends", label: "Trends", route: "/dashboard/trends" },
    { id: "recent", label: "Recent", route: "/dashboard/recent" },
    { id: "compare", label: "Compare", route: "/dashboard/compare" },
    { id: "next-buyer", label: "Next Buyer", route: "/dashboard/next-buyer" },
] as const;

export const TIME_PERIODS = [
    { id: "3_months", label: "3M", months: 3 },
    { id: "6_months", label: "6M", months: 6 },
    { id: "12_months", label: "12M", months: 12 },
] as const;
