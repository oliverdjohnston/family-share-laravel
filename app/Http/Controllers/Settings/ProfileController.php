<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile page.
     */
    public function show(): Response
    {
        return Inertia::render('profile', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Update the user's profile.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . auth()->id()],
            ]);

            auth()->user()->update($validated);

            return redirect()->back()->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Profile update failed. ' . $e->getMessage());
        }
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);

            $user = $request->user();

            Auth::logout();

            $user->delete();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect('/')->with('success', 'Account deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Account deletion failed. ' . $e->getMessage());
        }
    }
}
