<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\CategoryTask;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;

class HelperController extends Controller
{
    public function dashboard()
    {
        try {
            $userId = Auth::id();
            
            $stats = [
                'overview' => [
                    'my_tasks' => Task::where('karyawan_id', $userId)->count(),
                    'pending_tasks' => Task::where('karyawan_id', $userId)
                        ->where('status', 'Pending')
                        ->count(),
                    'completed_tasks' => Task::where('karyawan_id', $userId)
                        ->where('status', 'Close')
                        ->count(),
                    'cancelled_tasks' => Task::where('karyawan_id', $userId)
                        ->where('status', 'Cancel')
                        ->count(),
                ],
                'tasks' => [
                    'status_distribution' => Task::where('karyawan_id', $userId)
                        ->select('status', DB::raw('count(*) as count'))
                        ->groupBy('status')
                        ->get(),
                    'monthly_trends' => Task::where('karyawan_id', $userId)
                        ->select(
                            DB::raw('DATE_FORMAT(tanggal_laporan, "%Y-%m") as month'),
                            DB::raw('count(*) as count')
                        )
                        ->groupBy('month')
                        ->orderBy('month')
                        ->get(),
                    'category_distribution' => DB::table('task')
                        ->join('category_task', 'task.kategori_id', '=', 'category_task.id')
                        ->where('task.karyawan_id', $userId)
                        ->select('category_task.tugas as name', DB::raw('count(*) as count'))
                        ->groupBy('category_task.id', 'category_task.tugas')
                        ->get(),
                ],
                'recent_tasks' => Task::with(['kategori'])
                    ->where('karyawan_id', $userId)
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function($task) {
                        return [
                            'id' => $task->id,
                            'description' => $task->deskripsi ?? 'No description',
                            'category' => optional($task->kategori)->tugas ?? 'Uncategorized',
                            'status' => $task->status,
                            'reported_date' => $task->tanggal_laporan,
                            'created_at' => $task->created_at,
                        ];
                    }),
                'filters' => [
                    'categories' => CategoryTask::select('id', 'tugas')->orderBy('tugas')->get(),
                    'statuses' => ['Close', 'Cancel', 'Pending'],
                ],
            ];

            return Inertia::render('Helper/dashboard', [
                'stats' => $stats,
                'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
                'currentUser' => Auth::user()->name,
            ]);

        } catch (\Exception $e) {
            Log::error('Helper Dashboard Error: ' . $e->getMessage());
            
            return Inertia::render('Helper/dashboard', [
                'stats' => [
                    'overview' => [
                        'my_tasks' => 0,
                        'pending_tasks' => 0,
                        'completed_tasks' => 0,
                        'cancelled_tasks' => 0,
                    ],
                    'tasks' => [
                        'status_distribution' => [],
                        'monthly_trends' => [],
                        'category_distribution' => [],
                    ],
                    'recent_tasks' => [],
                    'filters' => [
                        'categories' => [],
                        'statuses' => ['Close', 'Cancel', 'Pending'],
                    ],
                ],
                'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
                'currentUser' => Auth::user()->name,
                'error' => $e->getMessage()
            ]);
        }
    }
    public function taskindex()
    {
        $categories = CategoryTask::select('id', 'tugas')
        ->orderBy('tugas')
        ->get();
        Log::info('Categories loaded:', $categories->toArray());
        return Inertia::render('Helper/Task/Index', [
            'tasks' => Task::with(['karyawan', 'kategori'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'employees' => Employee::select('id', 'nama', 'lokasi_ruang', 'lokasi_gedung')
            ->orderBy('nama')
            ->get(),
           'categories' => $categories,
        ]);
    }

    public function taskstore(Request $request)
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

    public function taskupdate(Request $request, $id)
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

    public function taskdestroy($id)
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
