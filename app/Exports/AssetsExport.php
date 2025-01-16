<?php

namespace App\Exports;

use App\Models\Asset;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AssetsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Asset::with(['currentEmployee', 'location', 'specification', 'software']);

        if (!empty($this->filters['search'])) {
            $query->where('nama_barang', 'like', '%' . $this->filters['search'] . '%');
        }

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['divisi']) && $this->filters['divisi'] !== 'all') {
            $query->whereHas('currentEmployee', function($q) {
                $q->where('divisi', $this->filters['divisi']);
            });
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Nama Barang',
            'Status',
            'Pengguna',
            'Divisi',
            'Lokasi',
            'Computer Name',
            'Merk',
            'Serial Number',
            'No AT',
            'Operating System',
            'Office',
            'Office 365',
            'Email 365',
            'Tahun Inventaris',
            'Terakhir Diperbarui'
        ];
    }

    public function map($asset): array
    {
        return [
            $asset->nama_barang,
            $asset->status,
            $asset->currentEmployee ? $asset->currentEmployee->nama : '-',
            $asset->currentEmployee ? $asset->currentEmployee->divisi : '-',
            $asset->location ? "{$asset->location->lokasi_gedung} - {$asset->location->lokasi_ruang}" : '-',
            $asset->specification ? $asset->specification->computer_name : '-',
            $asset->specification ? $asset->specification->merk : '-',
            $asset->specification ? $asset->specification->serial_number : '-',
            $asset->specification ? $asset->specification->no_at : '-',
            $asset->software ? $asset->software->os : '-',
            $asset->software ? $asset->software->office : '-',
            $asset->software ? $asset->software->office_365 : '-',
            $asset->software ? $asset->software->email_365 : '-',
            $asset->specification ? $asset->specification->tahun_inventaris : '-',
            $asset->updated_at->format('d/m/Y H:i:s'),
        ];
    }
}