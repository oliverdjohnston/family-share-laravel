import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LinkButton } from "@/components/ui/link-button";
import { PageProps } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";

export function Navigation() {
    const { auth } = usePage<PageProps>().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSignOut = () => {
        router.post("/logout");
    };

    return (
        <nav className="border-border bg-background border-b">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="flex h-14 items-center justify-between sm:h-16">
                    <div className="flex min-w-0 flex-1 items-center">
                        <Link href="/" className="shrink-0 cursor-pointer p-0">
                            <span className="text-primary hover:text-primary/80 text-base font-bold transition-colors sm:text-lg lg:text-xl">
                                oliver is cool
                            </span>
                        </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
                        <LinkButton
                            variant="ghost"
                            size="sm"
                            className="hidden shrink-0 cursor-pointer px-2 text-xs sm:flex lg:px-4 lg:text-sm"
                            href="/dashboard"
                        >
                            Dashboard
                        </LinkButton>
                        {auth?.user ? (
                            <DropdownMenu onOpenChange={setIsDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex cursor-pointer items-center gap-3 px-1 text-xs sm:px-2 lg:px-4 lg:text-sm"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:inline">{auth.user.name}</span>
                                        <ChevronDown
                                            className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem asChild>
                                        <LinkButton
                                            variant="ghost"
                                            href="/profile"
                                            className="h-auto w-full cursor-pointer justify-start px-2 py-1.5 font-normal"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </LinkButton>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <LinkButton variant="ghost" size="sm" className="cursor-pointer px-2 text-xs sm:px-3 lg:px-4 lg:text-sm" href="/login">
                                Sign In
                            </LinkButton>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
