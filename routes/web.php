<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SteamLicenseController;
use App\Http\Controllers\LibraryEditController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/steam', [ProfileController::class, 'updateSteam'])->name('profile.steam.update');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('/profile/steam-licenses', [SteamLicenseController::class, 'upload'])->name('profile.steam-licenses.upload');
    Route::delete('/profile/steam-licenses', [SteamLicenseController::class, 'remove'])->name('profile.steam-licenses.remove');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/trends', [DashboardController::class, 'trends'])->name('dashboard.trends');

    Route::get('/dashboard/compare', [DashboardController::class, 'compare'])->name('dashboard.compare');
    Route::get('/dashboard/next-buyer', [DashboardController::class, 'nextBuyer'])->name('dashboard.next-buyer');

    Route::get('/library/edit', [LibraryEditController::class, 'index'])->name('library.edit');
    Route::patch('/library/edit', [LibraryEditController::class, 'bulkUpdate'])->name('library.bulk-update');
    Route::patch('/library/edit/{gameId}', [LibraryEditController::class, 'update'])->name('library.update');
    Route::delete('/library/edit/{gameId}', [LibraryEditController::class, 'destroy'])->name('library.destroy');
});

require __DIR__.'/auth.php';
