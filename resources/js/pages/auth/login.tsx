import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/ui/link-button";
import { PasswordInput } from "@/components/ui/password-input";
import { MainLayout } from "@/layouts/main-layout";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";
import { LogIn } from "lucide-react";

interface LoginPageProps extends PageProps {
    canResetPassword?: boolean;
}

export default function Login({ canResetPassword }: LoginPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <MainLayout title="Sign In" description="Sign in to your account">
            <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Welcome back</h1>
                        <p className="text-muted-foreground mt-2">Sign in to your account</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <LogIn className="h-5 w-5" />
                                <span>Sign In</span>
                            </CardTitle>
                            <CardDescription>Enter your credentials to access your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="remember" className="text-sm">
                                        Remember me
                                    </Label>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    {processing ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            {canResetPassword && (
                                <div className="mt-4 text-center">
                                    <LinkButton variant="link" href="/forgot-password" className="text-sm">
                                        Forgot your password?
                                    </LinkButton>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
