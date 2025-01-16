// resources/js/Pages/Assets/KelolaAset.tsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { 
    Table, TableBody, TableCaption, TableCell, 
    TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/Components/ui/Badge";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';

function KelolaAset({ assets, employees, filters, perPageOptions }) {
    // State Management
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDivisi, setFilterDivisi] = useState('all');
    const [data, setData] = useState({
        // Basic Info
        nama_barang: '',
        status: 'bagus',
        current_employee_id: '',
        
        // Location
        lokasi_gedung: '',
        lokasi_ruang: '',
        
        // Specification
        computer_name: '',
        merk: '',
        warna: '',
        spesifikasi: '',
        tahun_inventaris: new Date().getFullYear(),
        serial_number: '',
        no_at: '',
        
        // Software
        os: '',
        office: '',
        office_365: '',
        email_365: '',
    });

    // Filter Functions
    const handleFilter = () => {
        router.get(
            route('officer.kelola-aset'),
            { 
                ...filters, 
                status: filterStatus, 
                divisi: filterDivisi,
                page: 1 
            },
            { 
                preserveState: true 
            }
        );
    };

// Form Handling Functions
const resetForm = () => {
    setData({
        nama_barang: '',
        status: 'bagus',
        current_employee_id: '',
        lokasi_gedung: '',
        lokasi_ruang: '',
        computer_name: '',
        merk: '',
        warna: '',
        spesifikasi: '',
        tahun_inventaris: new Date().getFullYear(),
        serial_number: '',
        no_at: '',
        os: '',
        office: '',
        office_365: '',
        email_365: '',
    });
};

const handleSearch = (e) => {
    router.get(
        route('officer.kelola-aset'),
        { ...filters, search: e.target.value, page: 1 },
        { preserveState: true }
    );
};

const handleSubmit = () => {
    if (editingAsset) {
        router.put(route('officer.update-aset', editingAsset.id), data, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingAsset(null);
                resetForm();
                Swal.fire('Sukses', 'Data aset berhasil diperbarui', 'success');
            },
            onError: (errors) => {
                Swal.fire('Error', Object.values(errors)[0], 'error');
            }
        });
    } else {
        router.post(route('officer.store-aset'), data, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetForm();
                Swal.fire('Sukses', 'Aset baru berhasil ditambahkan', 'success');
            },
            onError: (errors) => {
                Swal.fire('Error', Object.values(errors)[0], 'error');
            }
        });
    }
};

const handleEdit = (asset) => {
    setEditingAsset(asset);
    setData({
        nama_barang: asset.nama_barang,
        status: asset.status,
        current_employee_id: asset.current_employee_id?.toString() || '',
        lokasi_gedung: asset.location?.lokasi_gedung || '',
        lokasi_ruang: asset.location?.lokasi_ruang || '',
        computer_name: asset.specification?.computer_name || '',
        merk: asset.specification?.merk || '',
        warna: asset.specification?.warna || '',
        spesifikasi: asset.specification?.spesifikasi || '',
        tahun_inventaris: asset.specification?.tahun_inventaris || new Date().getFullYear(),
        serial_number: asset.specification?.serial_number || '',
        no_at: asset.specification?.no_at || '',
        os: asset.software?.os || '',
        office: asset.software?.office || '',
        office_365: asset.software?.office_365 || '',
        email_365: asset.software?.email_365 || '',
    });
    setIsEditModalOpen(true);
};

const handleDelete = (asset) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data aset akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('officer.destroy-aset', asset.id), {
                onSuccess: () => {
                    Swal.fire('Terhapus!', 'Data aset berhasil dihapus.', 'success');
                }
            });
        }
    });
};

    // Export Functions
    const handleExport = (type) => {
        router.post(route('officer.export-aset'), {
            type,
            filters: { status: filterStatus, divisi: filterDivisi }
        });
    };

    // QR Code Generator
    const generateQRCode = (asset) => {
        router.post(route('officer.generate-qr'), {
            asset_id: asset.id
        }, {
            onSuccess: (response) => {
                window.open(response.qr_url, '_blank');
            }
        });
    };

    // Form Components
    const BasicInfoTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="nama_barang">Nama Barang</label>
                    <Input
                        id="nama_barang"
                        value={data.nama_barang}
                        onChange={e => setData({ ...data, nama_barang: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Status</label>
                    <Select
                        value={data.status}
                        onValueChange={value => setData({ ...data, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bagus">Bagus</SelectItem>
                            <SelectItem value="rusak">Rusak</SelectItem>
                            <SelectItem value="hilang">Hilang</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label>Pengguna</label>
                <Select
                    value={data.current_employee_id}
                    onValueChange={value => setData({ ...data, current_employee_id: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Tidak Ada</SelectItem>
                        {employees.map(employee => (
                            <SelectItem key={employee.id} value={String(employee.id)}>
                                {employee.nama} - {employee.divisi}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const LocationTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Gedung</label>
                    <Input
                        value={data.lokasi_gedung}
                        onChange={e => setData({ ...data, lokasi_gedung: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Ruangan</label>
                    <Input
                        value={data.lokasi_ruang}
                        onChange={e => setData({ ...data, lokasi_ruang: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );

    const SpecificationTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Computer Name</label>
                    <Input
                        value={data.computer_name}
                        onChange={e => setData({ ...data, computer_name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Merk</label>
                    <Input
                        value={data.merk}
                        onChange={e => setData({ ...data, merk: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Warna</label>
                    <Input
                        value={data.warna}
                        onChange={e => setData({ ...data, warna: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Tahun Inventaris</label>
                    <Input
                        type="number"
                        value={data.tahun_inventaris}
                        onChange={e => setData({ ...data, tahun_inventaris: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label>Spesifikasi</label>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    value={data.spesifikasi}
                    onChange={e => setData({ ...data, spesifikasi: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Serial Number</label>
                    <Input
                        value={data.serial_number}
                        onChange={e => setData({ ...data, serial_number: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Nomor AT</label>
                    <Input
                        value={data.no_at}
                        onChange={e => setData({ ...data, no_at: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );

    const SoftwareTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Operating System</label>
                    <Input
                        value={data.os}
                        onChange={e => setData({ ...data, os: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Office</label>
                    <Input
                        value={data.office}
                        onChange={e => setData({ ...data, office: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label>Office 365</label>
                    <Input
                        value={data.office_365}
                        onChange={e => setData({ ...data, office_365: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label>Email 365</label>
                    <Input
                        value={data.email_365}
                        onChange={e => setData({ ...data, email_365: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout role="Officer">
            <Head title="Kelola Aset" />
            <Card className="mx-auto max-w-7xl">
            <CardHeader>
    <div className="flex justify-between items-center">
        <CardTitle>Manajemen Aset</CardTitle>
        <div className="space-x-2">
            <Button onClick={() => setIsCreateModalOpen(true)}>
                Tambah Aset
            </Button>
            <Button onClick={() => handleExport('excel')}>
                Export Excel
            </Button>
            <Button onClick={() => handleExport('pdf')}>
                Export PDF
            </Button>
        </div>
    </div>
</CardHeader>
                <CardContent>
                    {/* Filter Section */}
                    <div className="mb-6 grid grid-cols-4 gap-4">
                        <Input
                            placeholder="Cari aset..."
                            value={filters.search || ''}
                            onChange={handleSearch}
                        />
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="bagus">Bagus</SelectItem>
                                <SelectItem value="rusak">Rusak</SelectItem>
                                <SelectItem value="hilang">Hilang</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterDivisi} onValueChange={setFilterDivisi}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter Divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Divisi</SelectItem>
                                {/* Add your divisions here */}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFilter}>
                            Terapkan Filter
                        </Button>
                    </div>

                    {/* Asset Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Barang</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead>QR Code</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.data.map(asset => (
                                <TableRow key={asset.id}>
                                    <TableCell>{asset.nama_barang}</TableCell>
                                    <TableCell>
                                    <Badge variant={
                                            asset.status === 'bagus' ? 'success' :
                                            asset.status === 'rusak' ? 'destructive' :
                                            'secondary'
                                        }>
                                            {asset.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {asset.current_employee ? 
                                            `${asset.current_employee.nama} - ${asset.current_employee.divisi}` : 
                                            '-'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {asset.location ? 
                                            `${asset.location.lokasi_gedung} - ${asset.location.lokasi_ruang}` :
                                            '-'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => generateQRCode(asset)}
                                        >
                                            Generate QR
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(asset)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(asset)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Menampilkan {assets.from} - {assets.to} dari {assets.total} aset
                        </div>
                        <div className="flex gap-2">
                            {assets.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    disabled={!link.url}
                                    onClick={() => {
                                        if (link.url) {
                                            router.get(link.url, {}, {
                                                preserveState: true,
                                                preserveScroll: true
                                            });
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Create/Edit Modal */}
                    <Dialog open={isCreateModalOpen || isEditModalOpen} 
                           onOpenChange={(open) => {
                               if (!open) {
                                   setIsCreateModalOpen(false);
                                   setIsEditModalOpen(false);
                                   setEditingAsset(null);
                                   resetForm();
                               }
                           }}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAsset ? 'Edit Aset' : 'Tambah Aset Baru'}
                                </DialogTitle>
                            </DialogHeader>
                            
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                                    <TabsTrigger value="location">Lokasi</TabsTrigger>
                                    <TabsTrigger value="specification">Spesifikasi</TabsTrigger>
                                    <TabsTrigger value="software">Software</TabsTrigger>
                                </TabsList>
                                <TabsContent value="basic">
                                    <BasicInfoTab />
                                </TabsContent>
                                <TabsContent value="location">
                                    <LocationTab />
                                </TabsContent>
                                <TabsContent value="specification">
                                    <SpecificationTab />
                                </TabsContent>
                                <TabsContent value="software">
                                    <SoftwareTab />
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setIsEditModalOpen(false);
                                    setEditingAsset(null);
                                    resetForm();
                                }}>
                                    Batal
                                </Button>
                                <Button onClick={handleSubmit}>
                                    {editingAsset ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}

export default KelolaAset;