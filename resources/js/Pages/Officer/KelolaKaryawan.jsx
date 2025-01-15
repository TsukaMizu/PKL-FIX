import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';

function KelolaKaryawan({ employees, filters, perPageOptions }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [data, setData] = useState({
        nama: '',
        nip: '',
        jabatan: '',
        divisi: '',
        email: ''
    });

    const handleSearch = (e) => {
        router.get(
            route('officer.kelola-karyawan'),
            { ...filters, search: e.target.value, page: 1 },
            { preserveState: true }
        );
    };

    const handlePerPageChange = (value) => {
        router.get(
            route('officer.kelola-karyawan'),
            { ...filters, per_page: value, page: 1 },
            { preserveState: true }
        );
    };

    const validateForm = () => {
        if (!data.nama || data.nama.length < 3) return 'Nama karyawan harus diisi minimal 3 karakter.';
        if (!data.nip || data.nip.length < 5) return 'NIP harus diisi minimal 5 karakter.';
        if (!data.jabatan) return 'Jabatan harus diisi.';
        if (!data.divisi) return 'Divisi harus diisi.';
        if (data.email && !/\S+@\S+\.\S+/.test(data.email)) return 'Format email tidak valid.';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorMsg = validateForm();
        if (errorMsg) {
            Swal.fire('Error', errorMsg, 'error');
            return;
        }

        if (editingEmployee) {
            router.put(route('officer.update-karyawan', editingEmployee.id), data, {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setEditingEmployee(null);
                    resetForm();
                    Swal.fire('Sukses', 'Data karyawan berhasil diperbarui', 'success');
                },
                onError: (errors) => {
                    Swal.fire('Error', Object.values(errors)[0], 'error');
                }
            });
        } else {
            router.post(route('officer.store-karyawan'), data, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    Swal.fire('Sukses', 'Karyawan baru berhasil ditambahkan', 'success');
                },
                onError: (errors) => {
                    Swal.fire('Error', Object.values(errors)[0], 'error');
                }
            });
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setData({
            nama: employee.nama,
            nip: employee.nip,
            jabatan: employee.jabatan,
            divisi: employee.divisi,
            email: employee.email || ''
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (employee) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data karyawan akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('officer.destroy-karyawan', employee.id), {
                    onSuccess: () => {
                        Swal.fire('Terhapus!', 'Data karyawan berhasil dihapus.', 'success');
                    }
                });
            }
        });
    };

    const resetForm = () => {
        setData({
            nama: '',
            nip: '',
            jabatan: '',
            divisi: '',
            email: ''
        });
    };

    const EmployeeForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="nama" className="text-sm font-medium">Nama Karyawan</label>
                <Input
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama karyawan"
                    value={data.nama}
                    onChange={e => setData({ ...data, nama: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="nip" className="text-sm font-medium">NIP</label>
                <Input
                    id="nip"
                    type="text"
                    placeholder="Masukkan NIP"
                    value={data.nip}
                    onChange={e => setData({ ...data, nip: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="jabatan" className="text-sm font-medium">Jabatan</label>
                <Input
                    id="jabatan"
                    type="text"
                    placeholder="Masukkan jabatan"
                    value={data.jabatan}
                    onChange={e => setData({ ...data, jabatan: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="divisi" className="text-sm font-medium">Divisi</label>
                <Input
                    id="divisi"
                    type="text"
                    placeholder="Masukkan divisi"
                    value={data.divisi}
                    onChange={e => setData({ ...data, divisi: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                />
            </div>

            <Button type="submit" className="w-full">
                {editingEmployee ? 'Update Karyawan' : 'Tambah Karyawan'}
            </Button>
        </form>
    );

    return (
        <AuthenticatedLayout role = "Officer">
        <Head title="Kelola Karyawan" />
        <Card className="mx-auto max-w-7xl">
            <CardHeader>
                <CardTitle>Manajemen Karyawan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-6">
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>Tambah Karyawan</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                            </DialogHeader>
                            <EmployeeForm />
                        </DialogContent>
                    </Dialog>

                    <div className="flex gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Cari karyawan..."
                            value={filters.search || ''}
                            onChange={handleSearch}
                            className="max-w-sm"
                        />

                        <Select
                            value={String(filters.per_page || 10)}
                            onValueChange={handlePerPageChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih jumlah per halaman" />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map(option => (
                                    <SelectItem key={option} value={String(option)}>
                                        {option} per halaman
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIP</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Divisi</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.data.map(employee => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.nama}</TableCell>
                                <TableCell>{employee.nip}</TableCell>
                                <TableCell>{employee.jabatan}</TableCell>
                                <TableCell>{employee.divisi}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleEdit(employee)}
                                                className="mr-2"
                                            >
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Karyawan</DialogTitle>
                                            </DialogHeader>
                                            <EmployeeForm />
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(employee)}
                                    >
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Menampilkan {employees.from} - {employees.to} dari {employees.total} karyawan
                    </div>
                    <div className="flex gap-2">
                        {employees.links.map((link, i) => (
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
            </CardContent>
        </Card>
        </AuthenticatedLayout>
    );
}

export default KelolaKaryawan;