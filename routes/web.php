<?php

use App\Http\Controllers\AsistenManagerController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HelperController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\OfficerController;
use App\Http\Middleware\CheckRole;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (!Auth::check()) {
        // Jika user belum login, arahkan ke halaman login
        return redirect()->route('login');
    }

    // Jika user sudah login, cek role dari session
    $selectedRole = session('selected_role');

    // Arahkan berdasarkan role yang sudah disimpan di session
    switch ($selectedRole) {
        case 'Helper':
            return redirect()->route('dashboard.helper');
        case 'Officer':
            return redirect()->route('dashboard.officer');
        case 'Asisten Manager':
            return redirect()->route('dashboard.asistenmanager');
        case 'Manager':
            return redirect()->route('dashboard.manager');
        default:
            // Jika role tidak ditemukan, arahkan ke login
            return redirect()->route('login');
    }
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Helper/dashboard', [HelperController::class,'index'])->middleware(CheckRole::class.':Helper')->name('dashboard.helper');
    Route::get('/Officer/dashboard', [OfficerController::class,'index'])->middleware(CheckRole::class.':Officer')->name('dashboard.officer');
    Route::get('/AsistenManager/dashboard', [AsistenManagerController::class,'index'])->middleware(CheckRole::class.':Asisten Manager')->name('dashboard.asistenmanager');
    Route::get('/Manager/dashboard', [ManagerController::class,'index'])->middleware(CheckRole::class.':Manager')->name('dashboard.manager');
    Route::get('/Officer/KelolaKaryawan/', [OfficerController::class, 'kelolaKaryawan'])->middleware(CheckRole::class.':Officer')->name('kelolaKaryawan.officer');
    Route::post('/Officer/KelolaKaryawan/store', [OfficerController::class, 'storeKaryawan'])->middleware(CheckRole::class.':Officer')->name('storeKaryawan.officer');
    Route::put('/Officer/KelolaKaryawan/{id}}', [OfficerController::class, 'updateKaryawan'])->middleware(CheckRole::class.':Officer')->name('updateKaryawan.officer');
    Route::delete('/Officer/KelolaKaryawan/{id}}', [OfficerController::class, 'destroyKaryawan'])->middleware(CheckRole::class.':Officer')->name('destoryKaryawan.officer');


    Route::get('/assets', [AssetController::class, 'index'])->name('officer.kelola-aset');
    Route::post('/assets', [AssetController::class, 'store'])->name('officer.store-aset');
    Route::put('/assets/{asset}', [AssetController::class, 'update'])->name('officer.update-aset');
    Route::delete('/assets/{asset}', [AssetController::class, 'destroy'])->name('officer.destroy-aset');
    Route::get('/assets/export', [AssetController::class, 'export'])->name('officer.export-aset');
    Route::get('/assets/{asset}/qr', [AssetController::class, 'generateQr'])->name('officer.generate-qr');
    Route::get('/assets/{asset}', [AssetController::class, 'show'])->name('officer.show-aset');

    // Profile routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    
    
});

require __DIR__.'/auth.php';