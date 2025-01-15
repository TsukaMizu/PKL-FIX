<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class OfficerController extends Controller
{
    // Display a listing of the resource
    public function index(){

        $user = Auth::user();
        $roles = session('selected_role', 'default');
        
        return Inertia::render('Officer/dashboard',[
            'user' => $user,
            'roles' => $roles
        ]);
    }
        
    public function kelolaKaryawan(Request $request)
    {
        $query = Employee::query();
        
        // Search
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama', 'like', "%{$searchTerm}%")
                  ->orWhere('nip', 'like', "%{$searchTerm}%")
                  ->orWhere('jabatan', 'like', "%{$searchTerm}%")
                  ->orWhere('divisi', 'like', "%{$searchTerm}%");
            });
        }

        // Per page options
        $perPage = $request->input('per_page', 10);
        $allowedPerPage = [10, 25, 50, 100];
        $perPage = in_array($perPage, $allowedPerPage) ? $perPage : 10;

        $employees = $query->orderBy('nama')
                          ->paginate($perPage)
                          ->withQueryString();

        return Inertia::render('Officer/KelolaKaryawan', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'per_page']),
            'perPageOptions' => $allowedPerPage
        ]);
    }

    public function storeKaryawan(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'required|string|unique:employees,nip|max:255',
            'jabatan' => 'required|string|max:255',
            'divisi' => 'required|string|max:255',
            'email' => 'nullable|email|max:255'
        ]);

        Employee::create($validated);

        return redirect()->back()
                        ->with('message', 'Karyawan berhasil ditambahkan');
    }

    public function updateKaryawan(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'required|string|max:255|unique:employees,nip,'.$employee->id,
            'jabatan' => 'required|string|max:255',
            'divisi' => 'required|string|max:255',
            'email' => 'nullable|email|max:255'
        ]);

        $employee->update($validated);

        return redirect()->back()
                        ->with('message', 'Data karyawan berhasil diperbarui');
    }

    public function destroyKaryawan(Employee $employee)
    {
        $employee->delete();
        
        return redirect()->back()
                        ->with('message', 'Karyawan berhasil dihapus');
    }

    // Show the form for creating a new resource
    public function create()
    {
        //
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        //
    }

    // Display the specified resource
    public function show($id)
    {
        //
    }

    // Show the form for editing the specified resource
    public function edit($id)
    {
        //
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        //
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        //
    }
}
