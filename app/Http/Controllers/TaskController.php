<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Employee;
use App\Models\Category;
use App\Models\CategoryTask;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index()
    {
        $categories = CategoryTask::select('id', 'tugas')
        ->orderBy('tugas')
        ->get();
        Log::info('Categories loaded:', $categories->toArray());
        return Inertia::render('AsistenManager/Task/Index', [
            'tasks' => Task::with(['karyawan', 'kategori'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'employees' => Employee::select('id', 'nama', 'lokasi_ruang', 'lokasi_gedung')
            ->orderBy('nama')
            ->get(),
           'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:employees,id',
            'kategori_id' => 'required|exists:category_task,id',
            'trouble' => 'required|string', 
            'solusi' => 'required|string',
            'status' => 'required|in:Close,Cancel,Pending',
            'keterangan' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $task = Task::create([
                ...$validated,
                'tanggal_laporan' => now()
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Task created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to create task: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'karyawan_id' => 'required|exists:employees,id',
            'kategori_id' => 'required|exists:category_task,id',
            'trouble' => 'required|string',
            'solusi' => 'required|string',
            'status' => 'required|in:Close,Cancel,Pending',
            'keterangan' => 'required|string'
        ]);

        try {
            DB::beginTransaction();
            $task = Task::findOrFail($id);
            $task->update($validated);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Task updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to update task: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            Task::findOrFail($id)->delete();
            DB::commit();

            return redirect()->back()
                ->with('success', 'Task deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to delete task: ' . $e->getMessage());
        }
    }
}