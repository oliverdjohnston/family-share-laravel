import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ComparisonGame } from "@/types";
import { Filter, GamepadIcon, TableIcon } from "lucide-react";
import { formatCurrency } from "../utils";

interface ComparisonTableTabProps {
    comparisonGames: ComparisonGame[];
    allUsers: { id: number; name: string }[];
    userFilter: string | null | undefined;
    onUserFilter: (userId: number | null) => void;
}

export const ComparisonTableTab = ({ comparisonGames, allUsers, userFilter, onUserFilter }: ComparisonTableTabProps) => {
    const currentUserFilter = userFilter ? parseInt(userFilter) : null;

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <TableIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            Game Library Comparison
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Compare all games across users with Steam and CDKeys values</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="text-sm font-medium">Filter by user:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {allUsers.map((user) => (
                                <Button
                                    key={user.id}
                                    variant={currentUserFilter === user.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onUserFilter(user.id)}
                                    className="px-2 py-1 text-xs"
                                >
                                    {user.name}
                                </Button>
                            ))}
                            {currentUserFilter && (
                                <Button variant="ghost" size="sm" onClick={() => onUserFilter(null)} className="px-2 py-1 text-xs">
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Game</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead className="text-right">Steam Value</TableHead>
                            <TableHead className="text-right">CDKeys Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonGames.slice(0, 100).map((game) => (
                            <TableRow key={game.id}>
                                <TableCell>
                                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                                        {game.icon_url ? (
                                            <img src={game.icon_url} alt={game.game_name} className="h-8 w-8 rounded" />
                                        ) : (
                                            <GamepadIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate font-medium">{game.game_name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {game.user_name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{game.acquired_at}</TableCell>
                                <TableCell className="text-right">{formatCurrency(game.steam_value)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(game.cdkeys_value)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {comparisonGames.length === 0 && (
                    <div className="text-muted-foreground flex items-center justify-center py-8">
                        <p>No games found{currentUserFilter ? " for selected user" : ""}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
