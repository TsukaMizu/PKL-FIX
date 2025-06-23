<?php

namespace App\Http\Controllers;

use App\Models\ItemStock;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ItemStockController extends Controller
{
    public function index()
{
    return Inertia::render('AsistenManager/ItemStock/Index', [
        'stocks' => ItemStock::with(['specification', 'category','items'])->get(),
        'categories' => Category::all(),
        'currentTime' => now()->setTimezone('UTC')->format('Y-m-d H:i:s'),
    ]);
}

public function store(Request $request)
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

    public function update(Request $request, $id)
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

    public function destroy($id)
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

}