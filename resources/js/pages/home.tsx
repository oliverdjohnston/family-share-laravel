import { Hero } from "@/components/sections/hero";
import { MainLayout } from "@/layouts/main-layout";

export default function Home() {
    return (
        <MainLayout title="Home" description="Compare Steam library values with friends">
            <Hero />
        </MainLayout>
    );
}
