import { ChartTooltip } from "@/components/ui/chart";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CHART_COLORS, CHART_CONFIG } from "../constants";
import { formatCurrency } from "../utils";
import { ChartCard } from "./dashboard-cards";

interface OverviewTabProps {
    valueComparison: Array<{
        user: string;
        value: number;
        games: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        games: number;
    }>;
    valueTypeLabel: string;
}

export const OverviewTab = ({ valueComparison, monthlyTrends, valueTypeLabel }: OverviewTabProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <ChartCard
                title={`Library Value Comparison (${valueTypeLabel})`}
                description={`Compare ${valueTypeLabel} library values across users`}
                config={CHART_CONFIG}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={valueComparison} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="user" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<CustomTooltip valueLabel={`${valueTypeLabel} Value`} formatValue={formatCurrency} />} />
                        <Bar dataKey="value" fill={CHART_COLORS[1]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Game Acquisition Trends" description="Games purchased per month (last 12 months)" config={CHART_CONFIG}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<CustomTooltip valueLabel="Games Acquired" />} />
                        <Line
                            type="monotone"
                            dataKey="games"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            dot={{ strokeWidth: 2, r: 4, fill: CHART_COLORS[0] }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};
