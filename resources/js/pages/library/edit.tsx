import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout } from "@/layouts/main-layout";
import { formatCurrency } from "@/pages/dashboard/utils";
import { LibraryEditData } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { EditIcon, GamepadIcon, SaveIcon, TrashIcon, User, Users } from "lucide-react";
import { useState } from "react";

interface GameEditData {
    id: number;
    acquired_at: string;
    steam_value: string;
    cdkeys_value: string;
}

export default function LibraryEdit({ comparisonGames, showAllUsers }: LibraryEditData) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState<Record<number, GameEditData>>({});
    const [deleteGameId, setDeleteGameId] = useState<number | null>(null);
    const [deleteGameName, setDeleteGameName] = useState("");

    const toggleUserView = () => {
        router.get("/library/edit", { all_users: !showAllUsers });
    };

    const enterEditMode = () => {
        const initialData: Record<number, GameEditData> = {};
        comparisonGames.forEach((game) => {
            initialData[game.id] = {
                id: game.id,
                acquired_at: game.acquired_at || "",
                steam_value: game.steam_value?.toString() || "0",
                cdkeys_value: game.cdkeys_value?.toString() || "0",
            };
        });
        setEditData(initialData);
        setIsEditMode(true);
    };

    const exitEditMode = () => {
        setIsEditMode(false);
        setEditData({});
    };

    const updateGame = (gameId: number, field: keyof Omit<GameEditData, "id">, value: string) => {
        setEditData((prev) => ({
            ...prev,
            [gameId]: { ...prev[gameId], [field]: value },
        }));
    };

    const updateGameDate = (gameId: number, date: Date | undefined) => {
        updateGame(gameId, "acquired_at", date ? format(date, "yyyy-MM-dd") : "");
    };

    const saveAllChanges = () => {
        const updates = Object.values(editData).map((update) => ({
            id: update.id,
            acquired_at: update.acquired_at || null,
            steam_value: parseFloat(update.steam_value) || 0,
            cdkeys_value: parseFloat(update.cdkeys_value) || 0,
        }));

        router.patch(
            "/library/edit",
            { updates },
            {
                onSuccess: () => exitEditMode(),
                onError: (error) => console.error("Failed to save changes:", error),
            },
        );
    };

    const confirmDelete = (gameId: number, gameName: string) => {
        setDeleteGameId(gameId);
        setDeleteGameName(gameName);
    };

    const deleteGame = () => {
        if (deleteGameId) {
            router.delete(`/library/edit/${deleteGameId}`, {
                onSuccess: () => {
                    setDeleteGameId(null);
                    setDeleteGameName("");
                },
            });
        }
    };

    return (
        <MainLayout title="Edit Library" description="Edit Steam library games">
            <div className="max-w-8xl container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Edit Steam Library</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">
                            {showAllUsers
                                ? "Manage all users' game collections - update values and purchase dates"
                                : "Manage your personal game collection - update values and purchase dates"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={toggleUserView} className="gap-2">
                            {showAllUsers ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                            {showAllUsers ? "My Games Only" : "All Users"}
                        </Button>
                        {!isEditMode ? (
                            <Button onClick={enterEditMode} className="gap-2">
                                <EditIcon className="h-4 w-4" />
                                Edit All
                            </Button>
                        ) : (
                            <>
                                <Button onClick={saveAllChanges} className="gap-2">
                                    <SaveIcon className="h-4 w-4" />
                                    Save All
                                </Button>
                                <Button variant="outline" onClick={exitEditMode}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Card className="flex flex-col">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <EditIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            {showAllUsers ? "All Users' Steam Libraries" : "Your Personal Steam Library"}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            {isEditMode
                                ? 'Edit mode active - make your changes and click "Save All"'
                                : 'Click "Edit All" to modify games, or use the delete button to remove games'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="min-h-0 flex-1 overflow-auto">
                        {comparisonGames.length === 0 ? (
                            <div className="py-8 text-center">
                                <GamepadIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                <p className="text-muted-foreground">No games found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Game</TableHead>
                                        {showAllUsers && <TableHead>Owner</TableHead>}
                                        <TableHead className="w-[160px]">Purchase Date</TableHead>
                                        <TableHead className="w-[120px] text-right">Steam Value</TableHead>
                                        <TableHead className="w-[120px] text-right">CDKeys Value</TableHead>
                                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {comparisonGames.map((game) => {
                                        const editEntry = editData[game.id];
                                        const gameDate = editEntry?.acquired_at ? new Date(editEntry.acquired_at + "T00:00:00") : undefined;

                                        return (
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
                                                {showAllUsers && (
                                                    <TableCell>
                                                        <span className="text-muted-foreground truncate text-sm">{game.user_name}</span>
                                                    </TableCell>
                                                )}
                                                <TableCell className="w-[160px]">
                                                    {isEditMode ? (
                                                        <DatePicker date={gameDate} onDateChange={(date) => updateGameDate(game.id, date)} />
                                                    ) : (
                                                        <span className="text-muted-foreground flex h-6 items-center text-sm">
                                                            {game.acquired_at_display || "Unknown"}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[120px] text-right">
                                                    {isEditMode ? (
                                                        <CurrencyInput
                                                            value={editEntry?.steam_value || "0"}
                                                            onChange={(value) => updateGame(game.id, "steam_value", value)}
                                                        />
                                                    ) : (
                                                        <span className="flex h-6 items-center justify-end text-sm">
                                                            {formatCurrency(game.steam_value)}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[120px] text-right">
                                                    {isEditMode ? (
                                                        <CurrencyInput
                                                            value={editEntry?.cdkeys_value || "0"}
                                                            onChange={(value) => updateGame(game.id, "cdkeys_value", value)}
                                                        />
                                                    ) : (
                                                        <span className="flex h-6 items-center justify-end text-sm">
                                                            {formatCurrency(game.cdkeys_value)}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-[80px] text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => confirmDelete(game.id, game.game_name)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <TrashIcon className="h-3 w-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={deleteGameId !== null} onOpenChange={() => setDeleteGameId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Game</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove "{deleteGameName}" from the library? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteGameId(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={deleteGame}>
                                Delete Game
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
