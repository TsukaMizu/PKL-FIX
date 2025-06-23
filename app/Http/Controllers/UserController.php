<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('AsistenManager/Users/Index', [
            'users' => $users,
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        // Validate first step input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ]);

        try {
            // Start database transaction
            DB::beginTransaction();

            // Create new user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign role
            $user->roles()->attach($validated['role_id']);

            // Commit transaction
            DB::commit();

            return redirect()->back()->with('success', 'User created successfully with assigned role');

        } catch (\Exception $e) {
            // Rollback transaction if something goes wrong
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create user. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        // Validate input with conditional password validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => $request->filled('password') ? 'string|min:8' : '',
        ]);

        try {
            DB::beginTransaction();

            $user = User::findOrFail($id);
            
            // Update user data
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            // Only update password if it was provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            // If user has a role in the request, update it
            if ($request->has('role_id')) {
                $user->roles()->sync([$request->role_id]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'User updated successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update user. Please try again.');
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            
            $user = User::findOrFail($id);
            // Remove role associations before deleting user
            $user->roles()->detach();
            $user->delete();
            
            DB::commit();
            return redirect()->back()->with('success', 'User deleted successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete user. Please try again.');
        }
    }
}