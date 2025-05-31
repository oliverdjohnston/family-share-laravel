import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LinkButton } from "@/components/ui/link-button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PageProps } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown, Home, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

export function Navigation() {
    const { auth } = usePage<PageProps>().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = () => {
        router.post("/logout");
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navigationItems = [
        { routeName: "home", label: "Home", icon: Home },
        ...(auth?.user ? [{ routeName: "dashboard", label: "Dashboard", icon: Settings }] : []),
    ];

    return (
        <nav className="border-border bg-background border-b">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="flex h-14 items-center justify-between sm:h-16">
                    <div className="flex min-w-0 flex-1 items-center">
                        <Link href={route("home")} className="shrink-0 cursor-pointer p-0">
                            <span className="text-primary hover:text-primary/80 text-base font-bold transition-colors sm:text-lg lg:text-xl">
                                oliver is cool
                            </span>
                        </Link>
                    </div>

                    <div className="hidden shrink-0 items-center gap-1 sm:flex lg:gap-4">
                        {navigationItems.map((item) => (
                            <LinkButton
                                key={item.routeName}
                                variant="ghost"
                                size="sm"
                                className="shrink-0 cursor-pointer px-2 text-xs lg:px-4 lg:text-sm"
                                href={route(item.routeName)}
                                isActive={route().current(item.routeName)}
                            >
                                {item.label}
                            </LinkButton>
                        ))}

                        {auth?.user ? (
                            <DropdownMenu onOpenChange={setIsDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex cursor-pointer items-center gap-3 px-1 text-xs lg:px-4 lg:text-sm"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden md:inline">{auth.user.name}</span>
                                        <ChevronDown
                                            className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center">
                                    <DropdownMenuItem asChild>
                                        <LinkButton
                                            variant="ghost"
                                            href={route("profile")}
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
                            <LinkButton
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer px-2 text-xs lg:px-4 lg:text-sm"
                                href={route("login")}
                                isActive={route().current("login")}
                            >
                                Sign In
                            </LinkButton>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-2">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>

                                <div className="mt-6 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        {navigationItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = route().current(item.routeName);
                                            return (
                                                <LinkButton
                                                    key={item.routeName}
                                                    variant="ghost"
                                                    href={route(item.routeName)}
                                                    className="h-auto justify-start px-3 py-2 font-normal"
                                                    onClick={closeMobileMenu}
                                                    isActive={isActive}
                                                >
                                                    <Icon className="mr-3 h-4 w-4" />
                                                    {item.label}
                                                </LinkButton>
                                            );
                                        })}
                                    </div>

                                    <hr className="border-border" />

                                    {auth?.user ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="px-3 py-2">
                                                <p className="text-sm font-medium">{auth.user.name}</p>
                                                <p className="text-muted-foreground text-xs">{auth.user.email}</p>
                                            </div>

                                            <LinkButton
                                                variant="ghost"
                                                href={route("profile")}
                                                className="h-auto justify-start px-3 py-2 font-normal"
                                                onClick={closeMobileMenu}
                                                isActive={route().current("profile")}
                                            >
                                                <User className="mr-3 h-4 w-4" />
                                                Profile
                                            </LinkButton>

                                            <Button variant="ghost" onClick={handleSignOut} className="h-auto justify-start px-3 py-2 font-normal">
                                                <LogOut className="mr-3 h-4 w-4" />
                                                Sign Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <LinkButton
                                            variant="ghost"
                                            href={route("login")}
                                            className="h-auto justify-start px-3 py-2 font-normal"
                                            onClick={closeMobileMenu}
                                            isActive={route().current("login")}
                                        >
                                            <User className="mr-3 h-4 w-4" />
                                            Sign In
                                        </LinkButton>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
