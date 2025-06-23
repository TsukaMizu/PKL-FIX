<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\CategoryTask;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Validation\ValidationException;
use \Illuminate\Support\Facades\Auth;
use \Illuminate\Support\Facades\Log;
use App\Models\ItemStock;
use App\Models\User;
use App\Models\Role;
use App\Models\Task;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse; 
use Illuminate\Support\Facades\Redirect; 
use Inertia\Response;
 


class ManagerController extends Controller
{
    public function dashboard()
    {
        $startDate = request('start_date', now()->startOfMonth());
        $endDate = request('end_date', now()->endOfMonth());

        // Tasks Statistics with date filtering
        $tasksQuery = Task::query()
            ->when(request('date_range'), function($query) use ($startDate, $endDate) {
                $query->whereBetween('tanggal_laporan', [$startDate, $endDate]);
            });

        $stats = [
            'overview' => [
                'total_tasks' => Task::count(),
                'total_inventory' => ItemStock::sum('barang_masuk'),
                'total_employees' => Employee::count(),
                'pending_tasks' => Task::where('status', 'Pending')->count(),
            ],
            'tasks' => [
                'total' => $tasksQuery->count(),
                'pending' => $tasksQuery->clone()->where('status', 'Pending')->count(),
                'completed' => $tasksQuery->clone()->where('status', 'Close')->count(),
                'cancelled' => $tasksQuery->clone()->where('status', 'Cancel')->count(),
                'status_distribution' => $tasksQuery->clone()
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'monthly_trends' => $tasksQuery->clone()
                    ->select(
                        DB::raw('DATE_FORMAT(tanggal_laporan, "%Y-%m") as month'),
                        DB::raw('count(*) as count')
                    )
                    ->groupBy('month')
                    ->orderBy('month')
                    ->get(),
                'category_distribution' => $tasksQuery->clone()
                    ->with('kategori')
                    ->select('kategori_id', DB::raw('count(*) as count'))
                    ->groupBy('kategori_id')
                    ->get(),
                'daily_stats' => $tasksQuery->clone()
                    ->select(DB::raw('DATE(tanggal_laporan) as date'), DB::raw('count(*) as count'))
                    ->groupBy('date')
                    ->orderBy('date', 'desc')
                    ->limit(7)
                    ->get(),
            ],
            'inventory' => [
                'total_items' => ItemStock::sum('barang_masuk'),
                'items_borrowed' => ItemStock::sum('barang_dipinjam'),
                'items_available' => ItemStock::sum(DB::raw('barang_masuk - barang_dipinjam')),
                'category_distribution' => ItemStock::with('category')
                    ->select(
                        'kategori_id',
                        DB::raw('sum(barang_masuk) as total'),
                        DB::raw('sum(barang_dipinjam) as borrowed')
                    )
                    ->groupBy('kategori_id')
                    ->get(),
                'status_counts' => [
                    'available' => Item::where('status', 'bagus')->count(),
                    'borrowed' => Item::whereNotNull('employee_id')->count(),
                    'maintenance' => Item::where('status', 'rusak')->count(),
                ],
                'recent_transactions' => Item::with(['employee', 'itemStock'])
                    ->whereNotNull('tanggal_terima')
                    ->orWhereNotNull('tanggal_kembali')
                    ->orderBy('updated_at', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'employees' => [
                'total' => Employee::count(),
                'total_divisions' => Employee::distinct('divisi')->count('divisi'),
                'total_locations' => Employee::distinct('lokasi_gedung')->count('lokasi_gedung'),
                'division_distribution' => Employee::select('divisi', DB::raw('count(*) as count'))
                    ->groupBy('divisi')
                    ->get(),
                'location_distribution' => Employee::select(
                    'lokasi_gedung',
                    DB::raw('count(*) as count')
                )
                    ->groupBy('lokasi_gedung')
                    ->get(),
                'items_per_employee' => Employee::withCount(['items' => function($query) {
                    $query->whereNull('tanggal_kembali');
                }])
                    ->orderBy('items_count', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'recent_activity' => collect()
            ->concat(
                Task::with(['karyawan', 'kategori'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function($task) {
                        return [
                            'type' => 'task',
                            'description' => $task->karyawan 
                                ? "New task created for {$task->karyawan->nama}" 
                                : "New task created",
                            'category' => optional($task->kategori)->tugas ?? 'Uncategorized',
                            'status' => $task->status,
                            'timestamp' => $task->created_at,
                        ];
                    })
            )
            ->concat(
                Item::with(['employee', 'itemStock'])
                    ->whereNotNull('tanggal_terima')
                    ->orderBy('tanggal_terima', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function($item) {
                        $itemName = optional($item->itemStock)->nama_barang ?? 'Unknown Item';
                        $employeeName = optional($item->employee)->nama ?? 'Unknown User';
                        $action = $item->tanggal_kembali ? 'returned by' : 'borrowed by';

                        return [
                            'type' => 'inventory',
                            'description' => "Item {$itemName} {$action} {$employeeName}",
                            'timestamp' => $item->tanggal_terima,
                            'status' => $item->status ?? 'unknown',
                            'itemDetails' => [
                                'name' => $itemName,
                                'employee' => $employeeName,
                                'borrowDate' => $item->tanggal_terima,
                                'returnDate' => $item->tanggal_kembali,
                            ],
                        ];
                    })
            )
            ->sortByDesc('timestamp')
            ->values()
            ->take(5),

        'inventory' => [
            'total_items' => ItemStock::sum('barang_masuk'),
            'items_borrowed' => ItemStock::sum('barang_dipinjam'),
            'items_available' => ItemStock::sum(DB::raw('barang_masuk - barang_dipinjam')),
            'category_distribution' => ItemStock::with('category')
                ->select(
                    'kategori_id',
                    DB::raw('sum(barang_masuk) as total'),
                    DB::raw('sum(barang_dipinjam) as borrowed')
                )
                ->groupBy('kategori_id')
                ->get()
                ->map(function($item) {
                    return [
                        'category' => optional($item->category)->nama ?? 'Uncategorized',
                        'total' => $item->total,
                        'borrowed' => $item->borrowed,
                    ];
                }),
            'recent_transactions' => Item::with(['employee', 'itemStock'])
                ->whereNotNull('employee_id')
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function($item) {
                    return [
                        'item_name' => optional($item->itemStock)->nama_barang ?? 'Unknown Item',
                        'employee_name' => optional($item->employee)->nama ?? 'Unknown User',
                        'status' => $item->status ?? 'unknown',
                        'borrowed_date' => $item->tanggal_terima,
                        'return_date' => $item->tanggal_kembali,
                    ];
                }),
            'status_counts' => [
                'available' => Item::where('status', 'bagus')->count(),
                'borrowed' => Item::whereNotNull('employee_id')
                    ->whereNull('tanggal_kembali')->count(),
                'maintenance' => Item::where('status', 'rusak')->count(),
            ],
        ],
            'filters' => [
                'categories' => CategoryTask::orderBy('tugas')->get(),
                'statuses' => ['Close', 'Cancel', 'Pending'],
                'date_ranges' => [
                    'today' => now()->format('Y-m-d'),
                    'week' => [now()->startOfWeek()->format('Y-m-d'), now()->endOfWeek()->format('Y-m-d')],
                    'month' => [now()->startOfMonth()->format('Y-m-d'), now()->endOfMonth()->format('Y-m-d')],
                    'year' => [now()->startOfYear()->format('Y-m-d'), now()->endOfYear()->format('Y-m-d')],
                ],
            ],
        ];

        return Inertia::render('Manager/dashboard', [
            'stats' => $stats,
        'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
        'currentUser' => Auth::user()->name,
        'filters' => [
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
            'category' => request('category', ''),
            'status' => request('status', ''),
            'dateRanges' => [
                'today' => [now()->format('Y-m-d'), now()->format('Y-m-d')],
                'week' => [now()->startOfWeek()->format('Y-m-d'), now()->endOfWeek()->format('Y-m-d')],
                'month' => [now()->startOfMonth()->format('Y-m-d'), now()->endOfMonth()->format('Y-m-d')],
                'year' => [now()->startOfYear()->format('Y-m-d'), now()->endOfYear()->format('Y-m-d')],
            ],
            ]
        ]);
    }
    public function userindex()
    {
        $users = User::with('roles')->get();
        return Inertia::render('Manager/Users/Index', [
            'users' => $users,
            'roles' => Role::all()
        ]);
    }

    public function userstore(Request $request)
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

    public function userupdate(Request $request, $id)
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

    public function userdestroy($id)
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

    public function taskindex()
    {
        $categories = CategoryTask::select('id', 'tugas')
        ->orderBy('tugas')
        ->get();
        Log::info('Categories loaded:', $categories->toArray());
        return Inertia::render('Manager/Task/Index', [
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

    public function stockindex()
{
    return Inertia::render('Manager/ItemStock/Index', [
        'stocks' => ItemStock::with(['specification', 'category','items'])->get(),
        'categories' => Category::all(),
        'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
    ]);
}

public function stockstore(Request $request)
{
    try {
        DB::beginTransaction();

        // Create ItemStock
        $itemStock = ItemStock::create([
            'nama_barang' => $request->nama_barang,
            'kategori_id' => $request->kategori_id,
            'barang_masuk' => $request->barang_masuk,
            'status_inventaris' => $request->status_inventaris,
            'stok' => $request->barang_masuk,
            'barang_dipinjam' => 0
        ]);

        // Create Specification
        $itemStock->specification()->create([
            'merk' => $request->merk,
            'warna' => $request->warna,
            'spesifikasi' => $request->spesifikasi,
            'tahun_inventaris' => $request->tahun_inventaris,
            'os' => $request->os,
            'office' => $request->office,
            'office_365' => $request->office_365,
            'email_365' => $request->email_365
        ]);
        $specificationId = $itemStock->specification->id;
        // Generate items menggunakan model Item
        $items = [];
        for ($i = 0; $i < $request->barang_masuk; $i++) {
            $items[] = [
                'item_stock_id' => $itemStock->id,
                'item_specification_id' => $specificationId,
                'serial_number' => null,
                'status' => 'bagus',
                'created_at' => now(),
                'updated_at' => now()
            ];
        }

        // Bulk insert items
        Item::insert($items);
        DB::commit();
        return redirect()->back()->with('success', 'Item stock created successfully');

    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}

    // Controller untuk mengecek ketersediaan
    public function checkAvailability($id)
    {
        try {
            $itemStock = ItemStock::findOrFail($id);
            return response()->json([
                'Available' => $itemStock->stok - $itemStock->barang_dipinjam,
                'total' => $itemStock->barang_masuk,
                'borrowed' => $itemStock->barang_dipinjam
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to check availability'
            ], 500);
        }
    }

    public function stockupdate(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'kategori_id' => 'required|exists:categories,id',
            'barang_masuk' => 'required|integer|min:1',
            'status_inventaris' => 'required|in:Sewa,Milik',
            'specification' => 'required|array',
            'specification.merk' => 'required|string|max:255',
            'specification.warna' => 'required|string|max:255',
            'specification.spesifikasi' => 'required|string',
            'specification.tahun_inventaris' => 'required|integer|min:2000|max:2099',
            'specification.os' => 'required|in:Windows 11,Windows 10,Linux,MacOS,Other',
            'specification.office' => 'required|boolean',
            'specification.office_365' => 'required|boolean',
            'specification.email_365' => 'required|boolean'
        ]);

        try {
            DB::beginTransaction();

            $itemStock = ItemStock::findOrFail($id);
            
            // Update ItemStock
            $itemStock->update([
                'nama_barang' => $validated['nama_barang'],
                'kategori_id' => $validated['kategori_id'],
                'barang_masuk' => $validated['barang_masuk'],
                'status_inventaris' => $validated['status_inventaris']
            ]);

            // Update specification
            if ($itemStock->specification) {
                $itemStock->specification->update($validated['specification']);
            } else {
                $itemStock->specification()->create($validated['specification']);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Item stock updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'error' => 'Failed to update item stock: ' . $e->getMessage()
            ]);
        }
    }

    public function stockdestroy($id)
    {
        try {
            DB::beginTransaction();

            $itemStock = ItemStock::findOrFail($id);
            
            // Check if any items are borrowed
            if ($itemStock->barang_dipinjam > 0) {
                return redirect()->back()->withErrors([
                    'error' => 'Cannot delete item stock while items are borrowed'
                ]);
            }

            // Delete related records and the item stock
            if ($itemStock->specification) {
                $itemStock->specification->delete();
            }
            $itemStock->items()->delete();
            $itemStock->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Item stock deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'error' => 'Failed to delete item stock: ' . $e->getMessage()
            ]);
        }
    }
    public function updateSerialNumbers(Request $request, $id)
{
    try {
        DB::beginTransaction();

        $itemStock = ItemStock::findOrFail($id);
        
        // Cek duplikasi dalam request
        $duplicatesInRequest = array_diff_key(
            $request->serial_numbers, 
            array_unique($request->serial_numbers)
        );
        if (!empty($duplicatesInRequest)) {
            throw new \Exception('Duplicate serial numbers found in your input');
        }

        // Cek serial number yang sudah ada
        $existingSerialNumbers = Item::whereIn('serial_number', $request->serial_numbers)
            ->pluck('serial_number')
            ->toArray();
        
        if (!empty($existingSerialNumbers)) {
            throw new \Exception('Serial number(s) ' . implode(', ', $existingSerialNumbers) . ' already exist in database');
        }

        $items = Item::where('item_stock_id', $id)
                    ->whereNull('serial_number')
                    ->limit(count($request->serial_numbers))
                    ->get();

        if ($items->count() < count($request->serial_numbers)) {
            throw new \Exception('Not enough items available for serial number assignment');
        }

        // Update serial numbers
        foreach ($items as $index => $item) {
            $item->update([
                'serial_number' => $request->serial_numbers[$index]
            ]);
        }

        DB::commit();
        
        return response()->json([
            'success' => true,
            'message' => 'Successfully added ' . count($request->serial_numbers) . ' serial numbers',
            'item_name' => $itemStock->nama_barang,
            'total_registered' => Item::where('item_stock_id', $id)
                                    ->whereNotNull('serial_number')
                                    ->count(),
            'total_items' => $itemStock->barang_masuk
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 422);
    }
}

public function getItemsWithoutSN($id)
{
    try {
        $items = Item::where('item_stock_id', $id)
                    ->whereNull('serial_number')
                    ->get();

        return response()->json([
            'success' => true,
            'items' => $items,
            'count' => $items->count(),

        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch items: ' . $e->getMessage(),
        ], 500);
    }
}
public function itemindex()
    {
        return Inertia::render('Manager/Items/Index', [
            'items' => Item::with(['itemStock', 'specification', 'employee'])
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama_barang' => $item->itemStock->nama_barang,
                        'kategori' => $item->itemStock->category->nama,
                        'merk' => $item->specification->merk,
                        'warna' => $item->specification->warna,
                        'serial_number' => $item->serial_number,
                        'spesifikasi' => $item->specification->spesifikasi,
                        'tahun_inventaris' => $item->specification->tahun_inventaris,
                        'os_status' => $item->specification->os,
                        'office_status' => $item->specification->office ? 'Yes' : 'No',
                        'office_365_status' => $item->specification->office_365 ? 'Yes' : 'No',
                        'email_365_status' => $item->specification->email_365 ? 'Yes' : 'No',
                        'status' => $item->status,
                        'wellness' => $item->wellness,
                        'employee' => $item->employee ? [
                            'id' => $item->employee->id,
                            'nama' => $item->employee->nama,
                            'nip' => $item->employee->nip,
                            'divisi' => $item->employee->divisi,
                            'jabatan' => $item->employee->jabatan,
                            'lokasi' => $item->employee->lokasi_gedung . ' - ' . $item->employee->lokasi_ruang,
                        ] : null,
                        'tanggal_terima' => $item->tanggal_terima,
                        'tanggal_kembali' => $item->tanggal_kembali,
                        'riwayat_pemakai' => $item->riwayat_pemakai ?? [],
                        'riwayat_perbaikan' => $item->riwayat_perbaikan ?? [],
                        'catatan' => $item->catatan,
                        'created_by' => $item->created_by,
                        'updated_by' => $item->updated_by,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                    ];
                }),
            'employees' => Employee::select('id', 'nama', 'nip', 'divisi', 'jabatan')
                ->get()
                ->map(function ($employee) {
                    return [
                        'value' => $employee->id,
                        'label' => "{$employee->nama} - {$employee->divisi} ({$employee->nip})"
                    ];
                }),
            'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
            'currentUser' => Auth::user()->name
        ]);
    }

    public function borrowItem(Request $request, Item $item)
    {
        try {
            DB::beginTransaction();
            
            // Lock the row untuk mencegah race condition
            $item = Item::lockForUpdate()->find($item->id);
            
            if ($item->employee_id) {
                throw new \Exception('Item is already borrowed by someone else.');
            }

            $validated = $request->validate([
                'employee_id' => 'required|exists:employees,id',
                'item_id' => 'required|exists:items,id'
            ]);

            // Validate item status
            if ($item->status !== 'bagus') {
                throw new \Exception('Item cannot be borrowed because its status is ' . $item->status);
            }

            $employee = Employee::findOrFail($validated['employee_id']);
            
            // Update item
            $item->employee_id = $employee->id;
            $item->tanggal_terima = now();
            
            // Update riwayat_pemakai
            $history = $item->riwayat_pemakai ?? [];
            $history[] = [
                'nama' => $employee->nama,
                'tanggal_terima' => now()->toDateTimeString(),
                'tanggal_kembali' => null
            ];
            $item->riwayat_pemakai = $history;
            $item->updated_by = Auth::user()->name;
            
            $item->save();

            DB::commit();
            return response()->json(['message' => 'Item has been borrowed successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function updateStatus(Request $request, Item $item)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:bagus,rusak,hilang,unknown',
                'wellness' => 'required|integer|min:0|max:100',
                'repair_note' => 'nullable|string'
            ]);

            DB::beginTransaction();

            // Update riwayat_perbaikan jika ada repair_note
            if (!empty($validated['repair_note'])) {
                $repairHistory = $item->riwayat_perbaikan ?? [];
                $repairHistory[] = [
                    'tanggal' => now()->toDateTimeString(),
                    'keterangan' => $validated['repair_note'],
                    'updated_by' => Auth::user()->name
                ];
                $item->riwayat_perbaikan = $repairHistory;
            }

            $item->status = $validated['status'];
            $item->wellness = $validated['wellness'];
            $item->updated_by = Auth::user()->name;
            $item->save();

            DB::commit();
            return response()->json(['message' => 'Status updated successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }


    public function returnItem(Item $item)
{
    try {
        DB::beginTransaction();

        // Lock the row untuk mencegah race condition
        $item = Item::lockForUpdate()->find($item->id);

        if (!$item->employee_id) {
            throw new \Exception('Item is not currently borrowed.');
        }

        // Update riwayat_pemakai
        $history = $item->riwayat_pemakai ?? [];
        if (!empty($history)) {
            $lastIndex = count($history) - 1;
            $history[$lastIndex]['tanggal_kembali'] = now()->toDateTimeString();
        }

        // Update item
        $item->employee_id = null;
        $item->tanggal_kembali = now();
        $item->riwayat_pemakai = $history;
        $item->updated_by = Auth::user()->name;
        $item->save();

        DB::commit();
        return response()->json(['message' => 'Item has been returned successfully.']);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Return error:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return response()->json(['error' => $e->getMessage()], 400);
    }
}

    public function getEmployees(Request $request)
    {
        return response()->json(
            Employee::where('nama', 'like', "%{$request->search}%")
                ->orWhere('nip', 'like', "%{$request->search}%")
                ->select('id', 'nama', 'nip', 'divisi', 'jabatan')
                ->get()
                ->map(function ($employee) {
                    return [
                        'value' => $employee->id,
                        'label' => "{$employee->nama} - {$employee->divisi} ({$employee->nip})"
                    ];
                })
        );
    }

    public function employeeindex()
    {
        $employees = Employee::query()
            ->select('id', 'nip', 'nama', 'email', 'divisi', 'jabatan', 'lokasi_gedung', 'lokasi_ruang', 'group_asman')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Manager/Employees/Index', [
            'employees' => $employees
        ]);
    }

    public function employeestore(Request $request)
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

    public function employeeupdate(Request $request, $id)
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

    public function employeedestroy($id)
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

    public function ctindex()
    {
        $categoriestask = CategoryTask::query()
            ->select('id', 'tugas')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Manager/CategoriesTask/Index', [
            'category_task' => $categoriestask
        ]);
    }

    public function ctstore(Request $request)
    {
        $validated = $request->validate([
            'tugas' => 'required|string|max:255'
        ]);

        try {
            DB::beginTransaction();
            CategoryTask::create($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category Task created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create category Task');
        }
    }

    public function ctupdate(Request $request, $id)
    {
        $validated = $request->validate([
            'tugas' => 'required|string|max:255'
        ]);

        try {
            DB::beginTransaction();
            $categorytask = CategoryTask::findOrFail($id);
            $categorytask->update($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category Task updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update category task');
        }
    }

    public function ctdestroy($id)
    {
        try {
            DB::beginTransaction();
            CategoryTask::findOrFail($id)->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Category Task deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete category task');
        }
    }
    public function cindex()
    {
        $categories = Category::query()
            ->select('id', 'nama', 'kode', 'deskripsi')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Manager/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function cstore(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:255|unique:categories',
            'deskripsi' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();
            Category::create($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to create category');
        }
    }

    public function cupdate(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => "required|string|max:255|unique:categories,kode,{$id}",
            'deskripsi' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();
            $category = Category::findOrFail($id);
            $category->update($validated);
            DB::commit();

            return redirect()->back()->with('success', 'Category updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to update category');
        }
    }

    public function cdestroy($id)
    {
        try {
            DB::beginTransaction();
            Category::findOrFail($id)->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Category deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Failed to delete category');
        }
    }
}
