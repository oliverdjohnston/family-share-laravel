import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/ui/link-button";
import { MainLayout } from "@/layouts/main-layout";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordPageProps extends PageProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/forgot-password");
    };

    return (
        <MainLayout title="Forgot Password" description="Reset your password">
            <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Forgot your password?</h1>
                        <p className="text-muted-foreground mt-2">
                            No problem. Just let us know your email address and we'll email you a password reset link.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span>Reset Password</span>
                            </CardTitle>
                            <CardDescription>Enter your email address to receive a reset link</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3">
                                    <p className="text-sm text-green-700">{status}</p>
                                </div>
                            )}

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
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    <Mail className="mr-2 h-4 w-4" />
                                    {processing ? "Sending..." : "Email Password Reset Link"}
                                </Button>
                            </form>

                            <div className="mt-4 text-center">
                                <LinkButton variant="link" href="/login" className="text-sm">
                                    <ArrowLeft className="mr-1 h-3 w-3" />
                                    Back to Sign In
                                </LinkButton>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
