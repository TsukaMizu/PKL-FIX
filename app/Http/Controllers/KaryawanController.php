<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;   
use Inertia\Inertia;

class KaryawanController extends Controller
{
    public function index()
{
    try {
        $karyawan = Karyawan::all();
        return response()->json($karyawan);
    } catch (\Exception $e) {
        return response()->json([], 500);
    }
}

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nip' => 'required|string|max:255|unique:karyawan',
                'jabatan' => 'required|string|max:255',
            ]);

            $karyawan = Karyawan::create($validated);
            return response()->json([
                'message' => 'Karyawan created successfully',
                'data' => $karyawan
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating karyawan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create karyawan'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $karyawan = Karyawan::findOrFail($id);
            
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nip' => 'required|string|max:255|unique:karyawan,nip,' . $id,
                'jabatan' => 'required|string|max:255',
            ]);

            $karyawan->update($validated);
            
            return response()->json([
                'message' => 'Karyawan updated successfully',
                'data' => $karyawan
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating karyawan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update karyawan'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $karyawan = Karyawan::findOrFail($id);
            $karyawan->delete();
            
            return response()->json([
                'message' => 'Karyawan deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting karyawan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete karyawan'], 500);
        }
    }

    public function exportCsv()
    {
        try {
            $karyawan = Karyawan::all();
            $filename = "karyawan-" . date('Y-m-d') . ".csv";
            
            $headers = [
                "Content-type" => "text/csv",
                "Content-Disposition" => "attachment; filename=$filename",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            ];

            $callback = function() use ($karyawan) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['Nama', 'NIP', 'Jabatan', 'Tanggal Dibuat']);

                foreach ($karyawan as $row) {
                    fputcsv($handle, [
                        $row->nama,
                        $row->nip,
                        $row->jabatan,
                        $row->created_at->format('Y-m-d')
                    ]);
                }

                fclose($handle);
            };

            return Response::stream($callback, 200, $headers);
        } catch (\Exception $e) {
            Log::error('Error exporting karyawan data: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to export karyawan data'], 500);
        }
    }


    public function importCsv(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:csv,txt|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $file = $request->file('file');
            $path = $file->getRealPath();
            
            $records = array_map('str_getcsv', file($path));
            
            // Remove header row
            $header = array_shift($records);
            
            // Validate header format
            $requiredHeaders = ['nama', 'nip', 'jabatan'];
            $headerLower = array_map('strtolower', $header);
            
            if (count(array_intersect($requiredHeaders, $headerLower)) !== count($requiredHeaders)) {
                return response()->json([
                    'error' => 'Format CSV tidak valid. Header harus berisi: Nama, NIP, Jabatan'
                ], 400);
            }

            $successCount = 0;
            $errors = [];

            foreach ($records as $index => $record) {
                $row = array_combine($header, $record);
                
                try {
                    $validator = Validator::make($row, [
                        'nama' => 'required|string|max:255',
                        'nip' => 'required|string|max:255|unique:karyawan,nip',
                        'jabatan' => 'required|string|max:255',
                    ]);

                    if ($validator->fails()) {
                        $errors[] = "Baris " . ($index + 2) . ": " . implode(', ', $validator->errors()->all());
                        continue;
                    }

                    Karyawan::create($row);
                    $successCount++;
                } catch (\Exception $e) {
                    $errors[] = "Baris " . ($index + 2) . ": Gagal import data";
                }
            }

            return response()->json([
                'message' => "Berhasil import $successCount data",
                'errors' => $errors
            ], $errors ? 422 : 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengimport file: ' . $e->getMessage()
            ], 500);
        }
    }
}