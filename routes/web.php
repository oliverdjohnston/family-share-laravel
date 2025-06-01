<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SteamLicenseController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/steam', [ProfileController::class, 'updateSteam'])->name('profile.steam.update');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    Route::post('/profile/steam-licenses', [SteamLicenseController::class, 'upload'])->name('profile.steam-licenses.upload');
    Route::delete('/profile/steam-licenses', [SteamLicenseController::class, 'remove'])->name('profile.steam-licenses.remove');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/trends', [DashboardController::class, 'trends'])->name('dashboard.trends');
    Route::get('/dashboard/recent', [DashboardController::class, 'recent'])->name('dashboard.recent');
    Route::get('/dashboard/compare', [DashboardController::class, 'compare'])->name('dashboard.compare');
});

require __DIR__.'/auth.php';
