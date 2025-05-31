import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Stats } from "@/types";
import { ChartColumnStacked } from "lucide-react";

interface HeroProps {
    stats?: Stats;
}

export function Hero({ stats }: HeroProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 text-center md:gap-16">
                <div className="flex flex-col items-center gap-6">
                    <h1 className="text-5xl font-bold text-pretty text-white md:text-7xl">Compare Steam Libraries</h1>
                    <p className="text-muted-foreground mx-auto max-w-3xl text-xl text-pretty md:text-2xl">
                        A fair way to compare the value of our libraries and determine who purchases the next game.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Card className="min-w-full flex-1 md:min-w-0 md:flex-[1_1_calc(50%-0.5rem)] xl:flex-[1_1_calc(33.333%-0.67rem)]">
                        <CardHeader className="text:lg md:text-xl">
                            <CardTitle>Total Games</CardTitle>
                            <CardDescription className="text-base md:text-lg">{stats?.totalGames?.toLocaleString() || "Loading..."}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="min-w-full flex-1 md:min-w-0 md:flex-[1_1_calc(50%-0.5rem)] xl:flex-[1_1_calc(33.333%-0.67rem)]">
                        <CardHeader className="text:lg md:text-xl">
                            <CardTitle>Total Steam Value</CardTitle>
                            <CardDescription className="text-base md:text-lg">£{stats?.totalSteamValue || "Loading..."}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="min-w-full flex-1 md:min-w-full xl:flex-[1_1_calc(33.333%-0.67rem)]">
                        <CardHeader className="text:lg md:text-xl">
                            <CardTitle>Average Game Value</CardTitle>
                            <CardDescription className="text-base md:text-lg">£{stats?.averageSteamValue || "Loading..."}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <LinkButton variant="default" size="3xl" className="gap-3 text-xl md:text-2xl" href="/comparison">
                        <ChartColumnStacked className="h-8 w-8" />
                        View Comparison
                    </LinkButton>
                </div>
            </div>
        </div>
    );
}
