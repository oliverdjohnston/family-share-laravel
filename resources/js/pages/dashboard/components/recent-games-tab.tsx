import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentGame } from "@/types";
import { GamepadIcon, TrendingUpIcon } from "lucide-react";
import { TIME_PERIODS } from "../constants";
import { formatCurrency } from "../utils";

interface RecentGamesTabProps {
    recentGames: RecentGame[];
    selectedPeriod: string;
    periodLabel: string;
    onPeriodChange: (period: string) => void;
}

export const RecentGamesTab = ({ recentGames, selectedPeriod, periodLabel, onPeriodChange }: RecentGamesTabProps) => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            Recent Game Acquisitions
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Latest games added to libraries ({periodLabel.toLowerCase()})
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {TIME_PERIODS.map((period) => (
                            <Button
                                key={period.id}
                                variant={selectedPeriod === period.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPeriodChange(period.id)}
                                className="px-3 py-1.5 text-xs"
                            >
                                {period.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {recentGames.slice(0, 16).map((game, index) => (
                        <div
                            key={`${game.game_name}-${game.user_name}-${index}`}
                            className="hover:bg-muted/50 flex items-center gap-3 rounded border p-3 transition-colors"
                        >
                            <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded sm:h-10 sm:w-10">
                                {game.icon_url ? (
                                    <img src={game.icon_url} alt={game.game_name} className="h-8 w-8 rounded sm:h-10 sm:w-10" />
                                ) : (
                                    <GamepadIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{game.game_name}</p>
                                <div className="text-muted-foreground flex flex-col gap-1 text-xs">
                                    <span>By {game.user_name}</span>
                                    <div className="flex items-center gap-2">
                                        <span>{game.acquired_at}</span>
                                        {game.selected_value > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>{formatCurrency(game.selected_value)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {recentGames.length === 0 && (
                    <div className="text-muted-foreground flex items-center justify-center py-8">
                        <p>No games acquired in the selected time period</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
