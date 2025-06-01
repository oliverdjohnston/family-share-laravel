import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { UserStats } from "@/types";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CHART_COLORS, CHART_CONFIG } from "../constants";
import { formatCurrency } from "../utils";
import { ChartCard } from "./dashboard-cards";

interface TrendsTabProps {
    userStats: UserStats[];
    valueTypeLabel: string;
}

export const TrendsTab = ({ userStats, valueTypeLabel }: TrendsTabProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <ChartCard title="User Library Distribution" description="Game count distribution across users" config={CHART_CONFIG}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={userStats.map((user) => ({ name: user.name, value: user.game_count }))}
                            cx="50%"
                            cy="50%"
                            outerRadius="60%"
                            dataKey="value"
                            labelLine={false}
                        >
                            {userStats.map((user, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<CustomTooltip valueLabel="Games" />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>

            <Card className="flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Value vs Game Count ({valueTypeLabel})</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Relationship between library size and {valueTypeLabel} value</CardDescription>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-y-auto">
                    <div className="space-y-3 sm:space-y-4">
                        {userStats.map((user, index) => (
                            <div key={user.id} className="flex items-center justify-between rounded border p-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm"
                                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                    >
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium sm:text-base">{user.name}</p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            {user.game_count} games • {formatCurrency(user.total_value)}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {formatCurrency(user.total_value / Math.max(user.game_count, 1))}/game
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
