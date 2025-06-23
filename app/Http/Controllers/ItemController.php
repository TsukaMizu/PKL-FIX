<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use \Illuminate\Support\Facades\Auth;
use \Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('AsistenManager/Items/Index', [
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
}