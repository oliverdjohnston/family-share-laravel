import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { MainLayout } from "@/layouts/main-layout";
import { PageProps, User as UserType } from "@/types";
import { useForm } from "@inertiajs/react";
import { Save, Settings, User } from "lucide-react";

interface ProfilePageProps extends PageProps {
    user?: UserType;
}

export default function Profile({ user }: ProfilePageProps) {
    // profile editing form
    const profileForm = useForm({
        name: user?.name || "",
        email: user?.email || "",
    });

    // password update form
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch("/profile");
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put("/password", {
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <MainLayout title="Profile" description="Manage your profile">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Profile</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback>
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                                    <CardDescription>Update your profile information</CardDescription>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData("name", e.target.value)}
                                            required
                                        />
                                        {profileForm.errors.name && <p className="text-sm text-red-600">{profileForm.errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData("email", e.target.value)}
                                            required
                                        />
                                        {profileForm.errors.email && <p className="text-sm text-red-600">{profileForm.errors.email}</p>}
                                    </div>
                                </div>
                                <Button type="submit" disabled={profileForm.processing} className="w-full sm:w-auto">
                                    <Save className="mr-2 h-4 w-4" />
                                    {profileForm.processing ? "Saving..." : "Save Profile"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Settings className="h-5 w-5" />
                                <div>
                                    <h2 className="text-xl font-semibold">Change Password</h2>
                                    <CardDescription>Update your password to keep your account secure</CardDescription>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Current Password</Label>
                                    <PasswordInput
                                        id="current_password"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                                        required
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <PasswordInput
                                            id="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData("password", e.target.value)}
                                            required
                                        />
                                        {passwordForm.errors.password && <p className="text-sm text-red-600">{passwordForm.errors.password}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                                            required
                                        />
                                        {passwordForm.errors.password_confirmation && (
                                            <p className="text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" disabled={passwordForm.processing} className="w-full sm:w-auto">
                                    <Save className="mr-2 h-4 w-4" />
                                    {passwordForm.processing ? "Updating..." : "Update Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
