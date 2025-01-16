<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Employee;
use App\Models\AssetLocation;
use App\Models\AssetSpecification;
use App\Models\AssetSoftware;
use App\Exports\AssetsExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $assets = Asset::with(['currentEmployee', 'location', 'specification', 'software'])
            ->when($request->search, function ($query, $search) {
                $query->where('nama_barang', 'like', "%{$search}%");
            })
            ->when($request->status && $request->status !== 'all', function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->divisi && $request->divisi !== 'all', function ($query, $divisi) {
                $query->whereHas('currentEmployee', function($q) use ($divisi) {
                    $q->where('divisi', $divisi);
                });
            })
            ->paginate($request->input('per_page', 10))
            ->appends($request->query());

        $employees = Employee::select('id', 'nama', 'nip', 'divisi')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Assets/KelolaAset', [
            'assets' => $assets,
            'employees' => $employees,
            'filters' => $request->all(['search', 'status', 'divisi', 'per_page']),
            'perPageOptions' => [10, 25, 50, 100]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|min:3',
            'status' => 'required|in:bagus,rusak,hilang',
            'current_employee_id' => 'nullable|exists:employees,id',
            'lokasi_gedung' => 'required|string',
            'lokasi_ruang' => 'required|string',
            'computer_name' => 'nullable|string',
            'merk' => 'required|string',
            'warna' => 'required|string',
            'spesifikasi' => 'required|string',
            'tahun_inventaris' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'serial_number' => 'required|string|unique:asset_specifications,serial_number',
            'no_at' => 'required|string|unique:asset_specifications,no_at',
            'os' => 'nullable|string',
            'office' => 'nullable|string',
            'office_365' => 'nullable|string',
            'email_365' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();
        try {
            // Create Asset
            $asset = Asset::create([
                'nama_barang' => $request->nama_barang,
                'status' => $request->status,
                'current_employee_id' => $request->current_employee_id,
            ]);

            // Create Location
            AssetLocation::create([
                'asset_id' => $asset->id,
                'lokasi_gedung' => $request->lokasi_gedung,
                'lokasi_ruang' => $request->lokasi_ruang,
            ]);

            // Create Specification
            AssetSpecification::create([
                'asset_id' => $asset->id,
                'computer_name' => $request->computer_name,
                'merk' => $request->merk,
                'warna' => $request->warna,
                'spesifikasi' => $request->spesifikasi,
                'tahun_inventaris' => $request->tahun_inventaris,
                'serial_number' => $request->serial_number,
                'no_at' => $request->no_at,
            ]);

            // Create Software if applicable
            if ($request->os || $request->office || $request->office_365 || $request->email_365) {
                AssetSoftware::create([
                    'asset_id' => $asset->id,
                    'os' => $request->os,
                    'office' => $request->office,
                    'office_365' => $request->office_365,
                    'email_365' => $request->email_365,
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Aset berhasil ditambahkan');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan aset');
        }
    }

    public function update(Request $request, Asset $asset)
    {
        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|min:3',
            'status' => 'required|in:bagus,rusak,hilang',
            'current_employee_id' => 'nullable|exists:employees,id',
            'lokasi_gedung' => 'required|string',
            'lokasi_ruang' => 'required|string',
            'computer_name' => 'nullable|string',
            'merk' => 'required|string',
            'warna' => 'required|string',
            'spesifikasi' => 'required|string',
            'tahun_inventaris' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'serial_number' => 'required|string|unique:asset_specifications,serial_number,' . $asset->specification->id,
            'no_at' => 'required|string|unique:asset_specifications,no_at,' . $asset->specification->id,
            'os' => 'nullable|string',
            'office' => 'nullable|string',
            'office_365' => 'nullable|string',
            'email_365' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();
        try {
            // Update Asset
            $asset->update([
                'nama_barang' => $request->nama_barang,
                'status' => $request->status,
                'current_employee_id' => $request->current_employee_id,
            ]);

            // Update Location
            $asset->location()->update([
                'lokasi_gedung' => $request->lokasi_gedung,
                'lokasi_ruang' => $request->lokasi_ruang,
            ]);

            // Update Specification
            $asset->specification()->update([
                'computer_name' => $request->computer_name,
                'merk' => $request->merk,
                'warna' => $request->warna,
                'spesifikasi' => $request->spesifikasi,
                'tahun_inventaris' => $request->tahun_inventaris,
                'serial_number' => $request->serial_number,
                'no_at' => $request->no_at,
            ]);

            // Update or Create Software
            if ($request->os || $request->office || $request->office_365 || $request->email_365) {
                $asset->software()->updateOrCreate(
                    ['asset_id' => $asset->id],
                    [
                        'os' => $request->os,
                        'office' => $request->office,
                        'office_365' => $request->office_365,
                        'email_365' => $request->email_365,
                    ]
                );
            }

            DB::commit();
            return redirect()->back()->with('success', 'Aset berhasil diperbarui');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui aset');
        }
    }

    public function destroy(Asset $asset)
    {
        try {
            $asset->delete();
            return redirect()->back()->with('success', 'Aset berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus aset');
        }
    }

    public function export(Request $request)
    {
        return Excel::download(
            new AssetsExport($request->all()),
            'assets-' . date('Y-m-d') . '.xlsx'
        );
    }

    public function generateQr(Asset $asset)
    {
        $qrCode = QrCode::size(300)
            ->format('svg')
            ->generate(route('officer.show-aset', $asset->id));

        return response($qrCode)
            ->header('Content-Type', 'image/svg+xml');
    }
}