<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KaryawanController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Karyawan routes
    Route::controller(KaryawanController::class)->group(function () {
        Route::get('/karyawan', 'index')->name('karyawan.index');
        Route::post('/karyawan', 'store')->name('karyawan.store');
        Route::put('/karyawan/{id}', 'update')->name('karyawan.update');
        Route::delete('/karyawan/{id}', 'destroy')->name('karyawan.destroy');
        Route::get('/karyawan/export', 'exportCsv')->name('karyawan.export');
        Route::post('/karyawan/import',  'importCsv')->name('karyawan.import');
        Route::get('/kelola-karyawan', function () {
            return Inertia::render('KelolaKaryawan/KelolaKaryawan');
        })->middleware(['auth', 'verified'])->name('kelola-karyawan');
            });
});

require __DIR__.'/auth.php';