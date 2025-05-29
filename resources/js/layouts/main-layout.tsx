import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { useFlashToast } from "@/hooks/use-flash-toast";
import { Head } from "@inertiajs/react";
import React from "react";
import { Toaster } from "sonner";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function MainLayout({
    children,
    title = "Steam Library Comparison",
    description = "Compare Steam library values with friends",
}: MainLayoutProps) {
    useFlashToast();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>
            <div className="bg-background text-foreground flex min-h-screen flex-col">
                <div className="sticky top-0 z-40">
                    <Navigation />
                </div>
                <main className="min-h-[calc(100vh-theme(spacing.16))] flex-1">{children}</main>
                <Footer />
                <Toaster position="bottom-left" closeButton richColors expand={false} visibleToasts={5} />
            </div>
        </>
    );
}
