import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer } from "recharts";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">{title}</CardTitle>
            <Icon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{value}</div>
            <p className="text-muted-foreground text-xs">{description}</p>
        </CardContent>
    </Card>
);

interface ChartCardProps {
    title: string;
    description: string;
    children: React.ReactElement;
    config: ChartConfig;
}

export const ChartCard = ({ title, description, children, config }: ChartCardProps) => (
    <Card className="flex flex-col">
        <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1">
            <ChartContainer config={config} className="h-full min-h-[180px] w-full sm:min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);
