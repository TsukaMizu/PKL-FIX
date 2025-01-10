import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function KelolaKaryawan({ auth }) {
    const [karyawan, setKaryawan] = useState([]);
    const [formData, setFormData] = useState({
        nama: '',
        nip: '',
        jabatan: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [importError, setImportError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchKaryawan();
    }, []);

    const fetchKaryawan = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('karyawan.index'));
            setKaryawan(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (error) {
            console.error('Full error:', error);
            setError('Gagal mengambil data karyawan');
            setKaryawan([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await put(route('karyawan.update', selectedId), formData);
            } else {
                await post(route('karyawan.store'), formData);
            }
            
            await fetchKaryawan();
            resetForm();
            alert(isEdit ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!');
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (data) => {
        setIsEdit(true);
        setSelectedId(data.id);
        setFormData({
            nama: data.nama || '',
            nip: data.nip || '',
            jabatan: data.jabatan || ''
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

        try {
            setLoading(true);
            await axios.delete(route('karyawan.destroy', id));
            await fetchKaryawan();
            alert('Data berhasil dihapus!');
        } catch (error) {
            setError('Gagal menghapus data');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nama: '',
            nip: '',
            jabatan: ''
        });
        setIsEdit(false);
        setSelectedId(null);
        setError(null);
    };

    const handleImportCsv = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
            setImportError('Please upload a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            setImportError(null);
            setImportSuccess(null);

            const response = await axios.post(route('karyawan.import'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setImportSuccess(response.data.message);
            if (response.data.errors && response.data.errors.length > 0) {
                setImportError(
                    <div>
                        <p>Beberapa data gagal diimport:</p>
                        <ul className="list-disc pl-5">
                            {response.data.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                );
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            await fetchKaryawan();

        } catch (error) {
            setImportError(error.response?.data?.error || 'Failed to import file');
        } finally {
            setLoading(false);
        }
    };

    const exportCsv = async () => {
        try {
            const response = await axios.get(route('karyawan.export'), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'karyawan.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Gagal mengexport data');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelola Karyawan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Kelola Karyawan</h1>

                            <div className="mb-4 flex gap-4">
                                <div className="relative">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImportCsv}
                                        accept=".csv"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        Import CSV
                                    </button>
                                </div>
                                
                                <button
                                    onClick={exportCsv}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    Export CSV
                                </button>
                            </div>

                            {importSuccess && (
                                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                    {importSuccess}
                                </div>
                            )}
                            
                            {importError && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {importError}
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            name="nama"
                                            value={formData.nama}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">NIP</label>
                                        <input
                                            type="text"
                                            name="nip"
                                            value={formData.nip}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                                        <input
                                            type="text"
                                            name="jabatan"
                                            value={formData.jabatan}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        disabled={loading}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        disabled={loading}
                                    >
                                        {loading ? '...' : (isEdit ? 'Update' : 'Simpan')}
                                    </button>
                                </div>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                NIP
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jabatan
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : karyawan.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            karyawan.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.nip}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.jabatan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                            disabled={loading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            disabled={loading}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}