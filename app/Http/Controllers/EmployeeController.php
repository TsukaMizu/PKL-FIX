<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::query()
            ->select('id', 'nip', 'nama', 'email', 'divisi', 'jabatan', 'lokasi_gedung', 'lokasi_ruang', 'group_asman')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('AsistenManager/Employees/Index', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:employees',
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:employees',
            'divisi' => 'required|string',
            'jabatan' => 'required|string',
            'lokasi_gedung' => 'required|string',
            'lokasi_ruang' => 'required|string',
            'group_asman' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            Employee::create($validated);
            DB::commit();
            return redirect()->back()->with('success', 'Employee created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create employee');
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:employees,nip,'.$id,
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,'.$id,
            'divisi' => 'required|string',
            'jabatan' => 'required|string',
            'lokasi_gedung' => 'required|string',
            'lokasi_ruang' => 'required|string',
            'group_asman' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $employee = Employee::findOrFail($id);
            $employee->update($validated);
            DB::commit();
            return redirect()->back()->with('success', 'Employee updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update employee');
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            Employee::findOrFail($id)->delete();
            DB::commit();
            return redirect()->back()->with('success', 'Employee deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete employee');
        }
    }
}