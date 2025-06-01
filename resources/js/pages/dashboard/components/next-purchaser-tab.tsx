import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NextPurchaserData } from "@/types";
import { AlertCircleIcon, CalendarIcon, Crown, PoundSterlingIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { formatCurrency } from "../utils";

interface NextPurchaserTabProps {
    nextPurchaserData: NextPurchaserData;
    valueTypeLabel: string;
}

export const NextPurchaserTab = ({ nextPurchaserData, valueTypeLabel }: NextPurchaserTabProps) => {
    const { next_purchaser, all_users_ranked, algorithm_info } = nextPurchaserData;

    return (
        <div className="space-y-4 sm:space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-3">
                            <Crown className="text-primary h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl sm:text-2xl">{next_purchaser.name} is up next!</CardTitle>
                            <CardDescription className="text-base">Based on fairness analysis for the last 6 months</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                            <PoundSterlingIcon className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium">Recent Spending</p>
                                <p className="text-lg font-bold">{formatCurrency(next_purchaser.recent_spending)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium">Last Purchase</p>
                                <p className="text-lg font-bold">
                                    {next_purchaser.days_since_last_purchase === 9999 ? "Never" : `${next_purchaser.days_since_last_purchase}d ago`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                            <PoundSterlingIcon className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium">Total Library Value</p>
                                <p className="text-lg font-bold">{formatCurrency(next_purchaser.total_library_value)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {next_purchaser.name} has the lowest fairness score ({(next_purchaser.fairness_score * 100).toFixed(1)}%), making them the
                            most fair choice to buy the next game.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader className="pb-3">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <TrendingDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                Fairness Rankings
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Lower score = more fair to buy next • {valueTypeLabel} values • Last 6 months
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="min-h-0 flex-1 space-y-3">
                        {all_users_ranked.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                                    index === 0 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" : "hover:bg-muted/50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                                index === 0 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatCurrency(user.recent_spending)} • {formatCurrency(user.total_library_value)} total
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{(user.fairness_score * 100).toFixed(1)}%</p>
                                    <Progress value={user.fairness_score * 100} className="mt-1 h-2 w-16" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <AlertCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            How It Works
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Lower fairness score means it's more fair for that person to buy the next game
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Algorithm Weights:</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Recent spending amount</span>
                                    <Badge variant="outline">{algorithm_info.weights.spending}%</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Time since last purchase</span>
                                    <Badge variant="outline">{algorithm_info.weights.time_since_last}%</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total library value</span>
                                    <Badge variant="outline">{algorithm_info.weights.library_value}%</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="mb-2 text-sm font-medium">Key Factors:</h4>
                            <div className="text-muted-foreground space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <TrendingUpIcon className="mt-0.5 h-3 w-3 text-red-500" />
                                    <span>Higher recent spending = less likely to be next</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <TrendingDownIcon className="mt-0.5 h-3 w-3 text-green-500" />
                                    <span>Longer since last purchase = more likely to be next</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <PoundSterlingIcon className="mt-0.5 h-3 w-3 text-purple-500" />
                                    <span>Higher total library value = slightly less likely to be next</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Detailed Analysis</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Complete breakdown of all factors for the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Fairness Score</TableHead>
                                <TableHead className="text-right">Recent Spending</TableHead>
                                <TableHead className="text-right">Total Library Value</TableHead>
                                <TableHead className="text-right">Days Since Last</TableHead>
                                <TableHead>Last Game</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {all_users_ranked.map((user, index) => (
                                <TableRow key={user.id} className={index === 0 ? "bg-green-50 dark:bg-green-950/20" : ""}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                                    index === 0 ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {index + 1}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={index === 0 ? "default" : "outline"}>{(user.fairness_score * 100).toFixed(1)}%</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(user.recent_spending)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(user.total_library_value)}</TableCell>
                                    <TableCell className="text-right">
                                        {user.days_since_last_purchase === 9999 ? "Never" : `${user.days_since_last_purchase}d`}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground max-w-[200px] truncate text-sm">
                                        {user.last_purchase_game || "No purchases"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
