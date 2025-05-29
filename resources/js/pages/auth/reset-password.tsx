import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/layouts/main-layout";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";
import { KeyRound } from "lucide-react";

interface ResetPasswordPageProps extends PageProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/reset-password");
    };

    return (
        <MainLayout title="Reset Password" description="Set your new password">
            <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Reset your password</h1>
                        <p className="text-muted-foreground mt-2">Enter your new password below to complete the reset process.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <KeyRound className="h-5 w-5" />
                                <span>New Password</span>
                            </CardTitle>
                            <CardDescription>Create a strong password for your account</CardDescription>
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
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Enter your new password"
                                    />
                                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        placeholder="Confirm your new password"
                                    />
                                    {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    {processing ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
