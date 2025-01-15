<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::user();

        // Ambil role pengguna
        $roles = DB::table('roles')
            ->join('user_roles', 'roles.id', '=', 'user_roles.roles_id')
            ->where('user_roles.user_id', '=', $user->id)
            ->pluck('roles.nama');

        if ($roles->count() > 1) {
            // Jika user memiliki lebih dari satu role, arahkan ke halaman pemilihan role
            return redirect()->route('pilihrole.index');
        }

        // Ambil role pertama dari list
        $selectedRole = $roles->first();
        session(['selected_role' => $selectedRole]);

        if ($selectedRole === 'Helper') {
            return redirect()->intended(route('dashboard.helper')); 
        } elseif ($selectedRole === 'Officer') {
            return redirect()->intended(route('dashboard.officer')); 
        } elseif ($selectedRole === 'Asisten Manager') {
            return redirect()->intended(route('dashboard.asistenmanager'));
        } elseif ($selectedRole === 'Manager') {
            return redirect()->intended(route('dashboard.manager')); 
        }
        
        // Jika role tidak dikenali
        return redirect('/')
            ->withErrors(['login' => 'Role tidak dikenali.']);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
?>