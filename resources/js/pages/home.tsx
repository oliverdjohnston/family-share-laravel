import { Hero } from "@/components/sections/hero";
import { MainLayout } from "@/layouts/main-layout";
import { PageProps } from "@/types";

export default function Home({ stats }: PageProps) {
    return (
        <MainLayout title="Home" description="Compare Steam library values with friends">
            <Hero stats={stats} />
        </MainLayout>
    );
}
