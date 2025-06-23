// AsistenOfficer/Item/Index.jsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Inertia } from '@inertiajs/inertia';
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function Index({ auth, items, employees, currentTime, currentUser }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
    const [isBorrowOpen, setIsBorrowOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [borrowForm, setBorrowForm] = useState({
        employee_id: '',
        item_id: ''
    });
    const [statusForm, setStatusForm] = useState({
        status: '',
        wellness: 100,
        repair_note: ''
    });

    useEffect(() => {
        if (!isBorrowOpen) {
            setSelectedEmployee(null);
            setBorrowForm({
                employee_id: '',
                item_id: ''
            });
        }
    }, [isBorrowOpen]);


    // Format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle peminjaman item
    const handleBorrow = () => {
        if (!selectedEmployee || !selectedItem || isSubmitting) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select employee'
            });
            return;
        }
    
        setIsSubmitting(true);
        
        const formData = {
            employee_id: selectedEmployee.value,
            item_id: selectedItem.id
        };
    
        axios.post(`/Officer/Items/${selectedItem.id}/borrow`, formData)
            .then(response => {
                setIsBorrowOpen(false);
                setSelectedEmployee(null);
                setBorrowForm({
                    employee_id: '',
                    item_id: ''
                });
                setIsSubmitting(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item has been borrowed successfully'
                });
                // Refresh halaman atau update state
                window.location.reload();
            })
            .catch(error => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to borrow item'
                });
            });
    };
    // Handle pengembalian item
    // Di komponen React
const handleReturn = (item) => {
    Swal.fire({
        title: 'Return Item',
        text: 'Are you sure you want to return this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, return it!'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post(`/Officer/Items/${item.id}/return`)
                .then(response => {
                    Swal.fire(
                        'Returned!',
                        'Item has been returned successfully.',
                        'success'
                    );
                    // Refresh halaman atau update state
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Return error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response?.data?.error || 'Failed to return item'
                    });
                });
        }
    });
};

    // Handle update status
    const handleUpdateStatus = () => {
        if (!selectedItem) return;
    
        axios.put(`/Officer/Items/${selectedItem.id}/status`, statusForm)
            .then(response => {
                setIsUpdateStatusOpen(false);
                setSelectedItem(null);
                setStatusForm({ status: '', wellness: 100, repair_note: '' });
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Status updated successfully'
                });
                // Refresh halaman atau update state
                window.location.reload();
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Failed to update status'
                });
            });
    };

    return (
        <AuthenticatedLayout role={"Officer"} user={auth.user} title="Asset Management">
            <Head title="Asset Management" />

            <div className="">
                <div className="max-w-10xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <h1 className="text-xl font-semibold text-gray-800">
                                    Asset Management
                                </h1>
                                <div className="text-sm text-gray-500">
                                    <div>Current User: {currentUser}</div>
                                    <div>Last Updated: {formatDate(currentTime)}</div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item Information
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Specifications
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Current User
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                History
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">{item.nama_barang}</p>
                                                        <p className="text-gray-500">Category: {item.kategori}</p>
                                                        <p className="text-gray-500">S/N: {item.serial_number}</p>
                                                        <p className="text-gray-500">Brand: {item.merk}</p>
                                                        <p className="text-gray-500">Color: {item.warna}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <details className="cursor-pointer">
                                                            <summary className="text-blue-600">View Specifications</summary>
                                                            <div className="mt-2 space-y-1 text-gray-600">
                                                                <p>Year: {item.tahun_inventaris}</p>
                                                                <p>OS: {item.os_status}</p>
                                                                <p>Office: {item.office_status}</p>
                                                                <p>O365: {item.office_365_status}</p>
                                                                <p>Email: {item.email_365_status}</p>
                                                                <p className="text-xs mt-2">Specs: {item.spesifikasi}</p>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${item.status === 'bagus' ? 'bg-green-100 text-green-800' : 
                                                              item.status === 'rusak' ? 'bg-red-100 text-red-800' :
                                                              item.status === 'hilang' ? 'bg-yellow-100 text-yellow-800' :
                                                              'bg-gray-100 text-gray-800'}`}>
                                                            {item.status?.toUpperCase()}
                                                        </span>
                                                        <p className="mt-1">Wellness: {item.wellness}%</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Updated by: {item.updated_by}
                                                            <br />
                                                            at: {formatDate(item.updated_at)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.employee ? (
                                                        <div className="text-sm">
                                                            <p className="font-medium text-gray-900">{item.employee.nama}</p>
                                                            <p className="text-gray-500">{item.employee.nip}</p>
                                                            <p className="text-gray-500">{item.employee.divisi}</p>
                                                            <p className="text-gray-500">{item.employee.lokasi}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Since: {formatDate(item.tanggal_terima)}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">Available</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm space-y-2">
                                                        <details className="cursor-pointer">
                                                            <summary className="text-blue-600">Usage History</summary>
                                                            <div className="mt-2 max-h-40 overflow-y-auto">
                                                                {item.riwayat_pemakai?.map((history, idx) => (
                                                                    <div key={idx} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                                                                        <p className="font-medium">{history.nama}</p>
                                                                        <p>{formatDate(history.tanggal_terima)} - {formatDate(history.tanggal_kembali)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </details>
                                                        <details className="cursor-pointer">
                                                            <summary className="text-blue-600">Repair History</summary>
                                                            <div className="mt-2 max-h-40 overflow-y-auto">
                                                                {item.riwayat_perbaikan?.map((repair, idx) => (
                                                                    <div key={idx} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                                                                        <p className="font-medium">{formatDate(repair.tanggal)}</p>
                                                                        <p>{repair.keterangan}</p>
                                                                        <p className="text-gray-500 mt-1">By: {repair.updated_by}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </details>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-2">
                                                        {!item.employee ? (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setIsBorrowOpen(true);
                                                                }}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            >
                                                                Borrow
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleReturn(item)}
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                Return
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem(item);
                                                                setStatusForm({
                                                                    status: item.status,
                                                                    wellness: item.wellness,
                                                                    repair_note: ''
                                                                });
                                                                setIsUpdateStatusOpen(true);
                                                            }}
                                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Update Status
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {isUpdateStatusOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Item Status</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="bagus">Bagus</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="hilang">Hilang</option>
                                    <option value="unknown">Unknown</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wellness (%)
                                </label>
                                <input
                                    type="number"
                                    value={statusForm.wellness}
                                    onChange={(e) => setStatusForm({ ...statusForm, wellness: parseInt(e.target.value) })}
                                    min="0"
                                    max="100"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repair Note (Optional)
                                </label>
                                <textarea
                                    value={statusForm.repair_note}
                                    onChange={(e) => setStatusForm({ ...statusForm, repair_note: e.target.value })}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Enter repair details if needed..."
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsUpdateStatusOpen(false);
                                    setSelectedItem(null);
                                    setStatusForm({ status: '', wellness: 100, repair_note: '' });
                                }}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

{/* Borrow Modal */}
{isBorrowOpen && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Borrow Item</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Employee
                    </label>
                    <Select
                        options={employees}
                        value={selectedEmployee}
                        onChange={setSelectedEmployee}
                        isSearchable
                        placeholder="Search employee..."
                        className="text-sm"
                    />
                </div>
                {selectedItem && (
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-700">Selected Item:</p>
                        <p className="text-sm text-gray-600">{selectedItem.nama_barang}</p>
                        <p className="text-xs text-gray-500">S/N: {selectedItem.serial_number}</p>
                    </div>
                )}
            </div>
            <div className="mt-5 flex justify-end space-x-3">
                <button
                    onClick={() => {
                        setIsBorrowOpen(false);
                        setSelectedItem(null);
                        setSelectedEmployee(null);
                    }}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
        onClick={handleBorrow}
        disabled={!selectedEmployee || isSubmitting || !selectedItem?.serial_number}
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
        {isSubmitting ? (
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            </span>
        ) : (
            'Confirm Borrow'
        )}
    </button>
            </div>
        </div>
    </div>
)}
        </AuthenticatedLayout>
    );
}