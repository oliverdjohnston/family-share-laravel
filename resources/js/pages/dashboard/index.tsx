import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Switch } from "@/components/ui/switch";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { DashboardData } from "@/types";
import { AlertCircleIcon, CalendarIcon, GamepadIcon, TrendingUpIcon } from "lucide-react";
import { ComparisonTableTab } from "./components/comparison-table-tab";
import { StatCard } from "./components/dashboard-cards";
import { NextPurchaserTab } from "./components/next-purchaser-tab";
import { OverviewTab } from "./components/overview-tab";
import { TrendsTab } from "./components/trends-tab";
import { DASHBOARD_TABS } from "./constants";
import { formatCurrency, navigateDashboard } from "./utils";

export default function Dashboard(dashboardData: DashboardData) {
    const {
        userStats,
        currentUserStats,
        comparisonGames,
        monthlyTrends,
        valueComparison,
        nextPurchaserData,
        currentUser,
        valueType,
        valueTypeLabel,
        userFilter,
        allUsers,
        activeTab,
        steamLicensesUploaded,
    } = dashboardData;

    const handleTabNavigation = (tabId: string) => {
        const tab = DASHBOARD_TABS.find((t) => t.id === tabId);
        if (tab) {
            navigateDashboard(tab.route, {
                valueType,
                user: userFilter || undefined,
            });
        }
    };

    const handleValueTypeChange = (newValueType: string) => {
        const currentTab = DASHBOARD_TABS.find((t) => t.id === activeTab);
        const route = currentTab?.route || "/dashboard";
        navigateDashboard(route, {
            valueType: newValueType,
            user: userFilter || undefined,
        });
    };

    const handleUserFilter = (userId: number | null) => {
        const currentTab = DASHBOARD_TABS.find((t) => t.id === activeTab);
        const route = currentTab?.route || "/dashboard";
        navigateDashboard(route, {
            valueType,
            user: userId ? userId.toString() : undefined,
        });
    };

    const renderActiveContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewTab valueComparison={valueComparison} monthlyTrends={monthlyTrends} valueTypeLabel={valueTypeLabel} />;
            case "trends":
                return <TrendsTab userStats={userStats} valueTypeLabel={valueTypeLabel} />;

            case "compare":
                return (
                    <ComparisonTableTab
                        comparisonGames={comparisonGames}
                        allUsers={allUsers}
                        userFilter={userFilter}
                        onUserFilter={handleUserFilter}
                    />
                );
            case "next-buyer":
                return <NextPurchaserTab nextPurchaserData={nextPurchaserData} valueTypeLabel={valueTypeLabel} />;
            default:
                return <OverviewTab valueComparison={valueComparison} monthlyTrends={monthlyTrends} valueTypeLabel={valueTypeLabel} />;
        }
    };

    return (
        <MainLayout title="Steam Dashboard" description="Analyze and compare Steam library data">
            <div className="max-w-8xl container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Welcome back, {currentUser.name}!</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Here's your Steam library analytics</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Steam</span>
                        <Switch checked={valueType === "cdkeys"} onCheckedChange={(checked) => handleValueTypeChange(checked ? "cdkeys" : "steam")} />
                        <span className="text-sm font-medium">CDKeys</span>
                    </div>
                </div>

                {!steamLicensesUploaded && (
                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <AlertCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Steam Licenses Required for Accurate Data</h3>
                                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                                    <p>Upload your Steam licenses to see accurate purchase dates.</p>
                                </div>
                                <div className="mt-3">
                                    <LinkButton
                                        href="/profile#steam-licenses"
                                        variant="outline"
                                        size="sm"
                                        className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/50"
                                    >
                                        Upload Steam Licenses
                                    </LinkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 lg:grid-cols-4">
                    <StatCard title="Your Games" value={currentUserStats?.game_count || 0} description="Total games in library" icon={GamepadIcon} />
                    <StatCard
                        title={`Total Library Value (${valueTypeLabel})`}
                        value={formatCurrency(currentUserStats?.total_value)}
                        description={`Total ${valueTypeLabel} value`}
                        icon={() => <span className="text-muted-foreground flex h-4 w-4 items-center justify-center text-sm font-bold">£</span>}
                    />
                    <StatCard
                        title="Recent Purchases"
                        value={currentUserStats?.recent_purchases_6_months || 0}
                        description="Games in last 6 months"
                        icon={CalendarIcon}
                    />
                    <StatCard
                        title="Next Purchaser"
                        value={nextPurchaserData?.next_purchaser?.name || "Loading..."}
                        description="Based on last 6 months"
                        icon={TrendingUpIcon}
                    />
                </div>

                <div className="bg-muted mb-4 grid h-auto w-full grid-cols-2 gap-1 rounded-md p-1 sm:mb-6 sm:grid-cols-4">
                    {DASHBOARD_TABS.map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "default" : "ghost"}
                            onClick={() => handleTabNavigation(tab.id)}
                            className={cn(
                                "cursor-pointer px-2 py-2 text-xs capitalize sm:px-3 sm:text-sm",
                                activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
                            )}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                <div className="flex-1 space-y-4 sm:space-y-6">{renderActiveContent()}</div>
            </div>
        </MainLayout>
    );
}
