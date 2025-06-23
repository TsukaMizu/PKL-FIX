<?php

use App\Http\Controllers\AsistenManagerController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HelperController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryTaskController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemStockController;
use App\Http\Controllers\OfficerController;
use App\Http\Controllers\TaskController;
use App\Http\Middleware\CheckRole;
use App\Models\ItemStock;
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
    // Profile routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(DashboardController::class)->group(function () {
        // Route::get('/dashboard', 'index')->middleware(CheckRole::class.':Helper')->name('dashboard.helper');
        // Route::get('/dashboard', 'index')->middleware(CheckRole::class.':Officer')->name('dashboard.officer');
        // Route::get('/Manager/dashboard', 'dashboardmanager')->middleware(CheckRole::class.':Manager')->name('dashboard.manager');
    });
});


//     // User management routes
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(UserController::class)->group(function () {
//         Route::get('/users', 'index')->name('users.index');
//         Route::post('/users', 'store')->name('users.store');
//         Route::get('/users/{user}/edit', 'edit')->name('users.edit');
//         Route::put('/users/{user}', 'update')->name('users.update');
//         Route::delete('/users/{user}', 'destroy')->name('users.destroy');
// });
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(CategoryController::class)->group(function () {
//         Route::get('/categories', 'index')->name('categories.index');
//         Route::post('/categories', 'store')->name('categories.store');
//         Route::put('/categories/{id}', 'update')->name('categories.update');
//         Route::delete('/categories/{id}', 'destroy')->name('categories.destroy');
//     });
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(EmployeeController::class)->group(function () {
//         Route::get('/employee', 'index')->name('employee.index');
//         Route::post('/employee', 'store')->name('employee.store');
//         Route::put('/employee/{id}', 'update')->name('employee.update');
//         Route::delete('/employee/{id}', 'destroy')->name('employee.destroy');
//     });
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(ItemStockController::class)->group(function () {
//         Route::get('/itemstock', 'index')->name('itemstock.index');
//         Route::post('/itemstock', 'store')->name('itemstock.store');
//         Route::resource('itemstock', ItemStockController::class);
//         Route::get('itemstock/{id}/availability', 'checkAvailability');
//         Route::post('/itemstock/{id}/serial-numbers', 'updateSerialNumbers')->name('itemstock.update-serial-number');
//         Route::get('/itemstock/{id}/items-without-sn', 'getItemsWithoutSN')->name('itemstock.items-without-sn');
//     });
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(TaskController::class)->group(function () {
//         Route::get('/task', 'index')->name('task.index');
//         Route::post('/task', 'store')->name('task.store');
//         Route::put('/task/{id}', 'update')->name('task.update');
//         Route::delete('/task/{id}', 'destroy')->name('task.destroy');
//     });
//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(CategoryTaskController::class)->group(function () {
//         Route::get('/categorytask', 'index')->name('categorytask.index');
//         Route::post('/categorytask', 'store')->name('categorytask.store');
//         Route::put('/categorytask/{id}', 'update')->name('categorytask.update');
//         Route::delete('/categorytask/{id}', 'destroy')->name('categorytask.destroy');
//     });

//     Route::middleware(CheckRole::class.':Asisten Manager')->controller(ItemController::class)->group(function () {
//         Route::get('/items', 'index')->name('items.index');
//             Route::post('/items/{item}/borrow', 'borrowItem');
//     Route::put('/items/{item}/status', 'updateStatus');
//     Route::post('/items/{item}/return',  'returnItem');
//         Route::get('/items/{id}/history', 'getHistory')->name('items.history');
//         Route::get('/employees/search', 'getEmployees')->name('employees.search');
//     });

    Route::middleware(CheckRole::class.':Asisten Manager')->group(function () {
        Route::get('/AsistenManager/Dashboard', [AsistenManagerController::class,'dashboard'])->name('dashboard.asistenmanager');

        Route::get('AsistenManager/Users', [AsistenManagerController::class,'userindex'])->name('asman.users.index');
        Route::post('/AsistenManager/Users', [AsistenManagerController::class,'userstore'])->name('asman.users.store');
        Route::get('/AsistenManager/Users/{user}/edit', [AsistenManagerController::class,'useredit'])->name('asman.users.edit');
        Route::put('/AsistenManager/Users/{user}', [AsistenManagerController::class,'userupdate'])->name('asman.users.update');
        Route::delete('/AsistenManager/Users/{user}', [AsistenManagerController::class,'userdestroy'])->name('asman.users.destroy');
        
        Route::get('/AsistenManager/Task', [AsistenManagerController::class,'taskindex'])->name('asman.task.index');
        Route::post('/AsistenManager/Task', [AsistenManagerController::class,'taskstore'])->name('asman.task.store');
        Route::put('/AsistenManager/Task/{id}', [AsistenManagerController::class,'taskupdate'])->name('asman.task.update');
        Route::delete('/AsistenManager/Task/{id}', [AsistenManagerController::class,'taskdestroy'])->name('asman.task.destroy');
        
        Route::get('/AsistenManager/Itemstock', [AsistenManagerController::class,'stockindex'])->name('asman.itemstock.index');
        Route::post('/AsistenManager/Itemstock', [AsistenManagerController::class,'stockstore'])->name('asman.itemstock.store');
        Route::get('/AsistenManager/Itemstock/{id}/availability', [AsistenManagerController::class,'checkAvailability']);
        Route::post('/AsistenManager/Itemstock/{id}/serial-numbers', [AsistenManagerController::class,'updateSerialNumbers'])->name('asman.itemstock.update-serial-number');
        Route::get('/AsistenManager/Itemstock/{id}/items-without-sn', [AsistenManagerController::class,'getItemsWithoutSN'])->name('asman.itemstock.items-without-sn');

        Route::get('/AsistenManager/Items', [AsistenManagerController::class,'itemindex'])->name('asman.items.index');
        Route::post('/AsistenManager/Items/{item}/borrow', [AsistenManagerController::class,'borrowItem']);
        Route::put('/AsistenManager/Items/{item}/status', [AsistenManagerController::class,'updateStatus']);
        Route::post('/AsistenManager/Items/{item}/return',  [AsistenManagerController::class,'returnItem']);
        Route::get('/AsistenManager/Items/{id}/history', [AsistenManagerController::class,'getHistory'])->name('items.history');
        Route::get('/AsistenManager/employees/search', [AsistenManagerController::class,'getEmployees'])->name('employees.search');
    
        Route::get('/AsistenManager/Employee', [AsistenManagerController::class,'employeeindex'])->name('asman.employee.index');
        Route::post('/AsistenManager/Employee', [AsistenManagerController::class,'employeestore'])->name('asman.employee.store');
        Route::put('/AsistenManager/Employee/{id}', [AsistenManagerController::class,'employeeupdate'])->name('asman.employee.update');
        Route::delete('/AsistenManager/Employee/{id}', [AsistenManagerController::class,'employeedestroy'])->name('asman.employee.destroy');
        
        Route::get('/AsistenManager/Category/Task', [AsistenManagerController::class,'ctindex'])->name('asman.categorytask.index');
        Route::post('/AsistenManager/Category/Task', [AsistenManagerController::class,'ctstore'])->name('asman.categorytask.store');
        Route::put('/AsistenManager/Category/Task/{id}', [AsistenManagerController::class,'ctupdate'])->name('asman.categorytask.update');
        Route::delete('/AsistenManager/Category/Task/{id}', [AsistenManagerController::class,'ctdestroy'])->name('asman.categorytask.destroy');
    
        Route::get('/AsistenManager/Category/Item', [AsistenManagerController::class,'cindex'])->name('asman.categories.index');
        Route::post('/AsistenManager/Category/Item', [AsistenManagerController::class,'cstore'])->name('asman.categories.store');
        Route::put('/AsistenManager/Category/Item/{id}', [AsistenManagerController::class,'cupdate'])->name('asman.categories.update');
        Route::delete('/AsistenManager/Category/Item/{id}', [AsistenManagerController::class,'cdestroy'])->name('asman.categories.destroy');
    
    
    });
    Route::middleware(CheckRole::class.':Manager')->group(function () {
        Route::get('/Manager/Dashboard', [ManagerController::class,'dashboard'])->name('dashboard.manager');

        Route::get('/Manager/Users', [ManagerController::class,'userindex'])->name('manager.users.index');
        Route::post('/Manager/Users', [ManagerController::class,'userstore'])->name('manager.users.store');
        Route::get('/Manager/Users/{user}/edit', [ManagerController::class,'useredit'])->name('manager.users.edit');
        Route::put('/Manager/Users/{user}', [ManagerController::class,'userupdate'])->name('manager.users.update');
        Route::delete('/Manager/Users/{user}', [ManagerController::class,'userdestroy'])->name('manager.users.destroy');
        
        Route::get('/Manager/Task', [ManagerController::class,'taskindex'])->name('manager.task.index');
        Route::post('/Manager/Task', [ManagerController::class,'taskstore'])->name('manager.task.store');
        Route::put('/Manager/Task/{id}', [ManagerController::class,'taskupdate'])->name('manager.task.update');
        Route::delete('/Manager/Task/{id}', [ManagerController::class,'taskdestroy'])->name('manager.task.destroy');
        
        Route::get('/Manager/Itemstock', [ManagerController::class,'stockindex'])->name('manager.itemstock.index');
        Route::post('/Manager/Itemstock', [ManagerController::class,'stockstore'])->name('manager.itemstock.store');
        Route::get('/Manager/Itemstock/{id}/availability', [ManagerController::class,'checkAvailability']);
        Route::post('/Manager/Itemstock/{id}/serial-numbers', [ManagerController::class,'updateSerialNumbers'])->name('manager.itemstock.update-serial-number');
        Route::get('/Manager/Itemstock/{id}/items-without-sn', [ManagerController::class,'getItemsWithoutSN'])->name('manager.itemstock.items-without-sn');

        Route::get('/Manager/Items', [ManagerController::class,'itemindex'])->name('manager.items.index');
        Route::post('/Manager/Items/{item}/borrow', [ManagerController::class,'borrowItem']);
        Route::put('/Manager/Items/{item}/status', [ManagerController::class,'updateStatus']);
        Route::post('/Manager/Items/{item}/return',  [ManagerController::class,'returnItem']);
        Route::get('/Manager/Items/{id}/history', [ManagerController::class,'getHistory'])->name('items.history');
        Route::get('/Manager/employees/search', [ManagerController::class,'getEmployees'])->name('employees.search');
    
        Route::get('/Manager/Employee', [ManagerController::class,'employeeindex'])->name('manager.employee.index');
        Route::post('/Manager/Employee', [ManagerController::class,'employeestore'])->name('manager.employee.store');
        Route::put('/Manager/Employee/{id}', [ManagerController::class,'employeeupdate'])->name('manager.employee.update');
        Route::delete('/Manager/Employee/{id}', [ManagerController::class,'employeedestroy'])->name('manager.employee.destroy');
        
        Route::get('/Manager/Category/Task', [ManagerController::class,'ctindex'])->name('manager.categorytask.index');
        Route::post('/Manager/Category/Task', [ManagerController::class,'ctstore'])->name('manager.categorytask.store');
        Route::put('/Manager/Category/Task/{id}', [ManagerController::class,'ctupdate'])->name('manager.categorytask.update');
        Route::delete('/Manager/Category/Task/{id}', [ManagerController::class,'ctdestroy'])->name('manager.categorytask.destroy');
    
        Route::get('/Manager/Category/Item', [ManagerController::class,'cindex'])->name('manager.categories.index');
        Route::post('/Manager/Category/Item', [ManagerController::class,'cstore'])->name('manager.categories.store');
        Route::put('/Manager/Category/Item/{id}', [ManagerController::class,'cupdate'])->name('manager.categories.update');
        Route::delete('/Manager/Category/Item/{id}', [ManagerController::class,'cdestroy'])->name('manager.categories.destroy');
    });

    Route::middleware(CheckRole::class.':Officer')->group(function () {
        Route::get('/Officer/Dashboard', [OfficerController::class,'dashboard'])->name('dashboard.officer');
       
        Route::get('/Officer/Task', [OfficerController::class,'taskindex'])->name('officer.task.index');
        Route::post('/Officer/Task', [OfficerController::class,'taskstore'])->name('officer.task.store');
        Route::put('/Officer/Task/{id}', [OfficerController::class,'taskupdate'])->name('officer.task.update');
        Route::delete('/Officer/Task/{id}', [OfficerController::class,'taskdestroy'])->name('officer.task.destroy');
        
        Route::get('/Officer/Itemstock', [OfficerController::class,'stockindex'])->name('officer.itemstock.index');
        Route::post('/Officer/Itemstock', [OfficerController::class,'stockstore'])->name('officer.itemstock.store');
        Route::get('/Officer/Itemstock/{id}/availability', [OfficerController::class,'checkAvailability']);
        Route::post('/Officer/Itemstock/{id}/serial-numbers', [OfficerController::class,'updateSerialNumbers'])->name('officer.itemstock.update-serial-number');
        Route::get('/Officer/Itemstock/{id}/items-without-sn', [OfficerController::class,'getItemsWithoutSN'])->name('officer.itemstock.items-without-sn');

        Route::get('/Officer/Items', [OfficerController::class,'itemindex'])->name('officer.items.index');
        Route::post('/Officer/Items/{item}/borrow', [OfficerController::class,'borrowItem']);
        Route::put('/Officer/Items/{item}/status', [OfficerController::class,'updateStatus']);
        Route::post('/Officer/Items/{item}/return',  [OfficerController::class,'returnItem']);
        Route::get('/Officer/Items/{id}/history', [OfficerController::class,'getHistory'])->name('items.history');
        Route::get('/Officer/employees/search', [OfficerController::class,'getEmployees'])->name('employees.search');
    
        Route::get('/Officer/Employee', [OfficerController::class,'employeeindex'])->name('officer.employee.index');
        Route::post('/Officer/Employee', [OfficerController::class,'employeestore'])->name('officer.employee.store');
        Route::put('/Officer/Employee/{id}', [OfficerController::class,'employeeupdate'])->name('officer.employee.update');
        Route::delete('/Officer/Employee/{id}', [OfficerController::class,'employeedestroy'])->name('officer.employee.destroy');
        
        Route::get('/Officer/Category/Task', [OfficerController::class,'ctindex'])->name('officer.categorytask.index');
        Route::post('/Officer/Category/Task', [OfficerController::class,'ctstore'])->name('officer.categorytask.store');
        Route::put('/Officer/Category/Task/{id}', [OfficerController::class,'ctupdate'])->name('officer.categorytask.update');
        Route::delete('/Officer/Category/Task/{id}', [OfficerController::class,'ctdestroy'])->name('officer.categorytask.destroy');
    
        Route::get('/Officer/Category/Item', [OfficerController::class,'cindex'])->name('officer.categories.index');
        Route::post('/Officer/Category/Item', [OfficerController::class,'cstore'])->name('officer.categories.store');
        Route::put('/Officer/Category/Item/{id}', [OfficerController::class,'cupdate'])->name('officer.categories.update');
        Route::delete('/Officer/Category/Item/{id}', [OfficerController::class,'cdestroy'])->name('officer.categories.destroy');
    });
    Route::middleware(CheckRole::class.':Helper')->group(function () {
        Route::get('/Helper/Dashboard', [HelperController::class,'dashboard'])->name('dashboard.helper');
       
        Route::get('/Helper/Task', [HelperController::class,'taskindex'])->name('helper.task.index');
        Route::post('/Helper/Task', [HelperController::class,'taskstore'])->name('helper.task.store');
        Route::put('/Helper/Task/{id}', [HelperController::class,'taskupdate'])->name('helper.task.update');
        Route::delete('/Helper/Task/{id}', [HelperController::class,'taskdestroy'])->name('helper.task.destroy');
    });




require __DIR__.'/auth.php';