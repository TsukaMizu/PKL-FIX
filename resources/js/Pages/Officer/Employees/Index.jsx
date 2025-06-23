import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head, usePage } from '@inertiajs/react';

const MySwal = withReactContent(Swal);

const EmployeesIndex = () => {
    const { employees = [], flash } = usePage().props;
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [formData, setFormData] = useState({
        nip: '',
        nama: '',
        email: '',
        divisi: '',
        jabatan: '',
        lokasi_gedung: '',
        lokasi_ruang: '',
        group_asman: ''
    });

    useEffect(() => {
        if (flash?.success) {
            MySwal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
            });
        }
        if (flash?.error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
            });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nip || !formData.nama || !formData.email || !formData.divisi || !formData.jabatan || !formData.lokasi_gedung || !formData.lokasi_ruang || !formData.group_asman) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill all required fields!',
            });
            return;
        }
        if (currentEmployee){
            Inertia.put(`/Officer/Employee/${currentEmployee.id}`, formData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Employee updated successfully!',
                    });
                    closeDialog();
                },
                onError: (errors) => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: Object.values(errors)[0],
                    });
                }
            });
        } else {
            Inertia.post('/Officer/Employee', formData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Employee added successfully!',
                    });
                    closeDialog();
                },
                onError: (errors) => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: Object.values(errors)[0],
                    });
                }
            });
        }
    };

    const handleEdit = (employee) => {
        setCurrentEmployee(employee);
        setFormData({
            nip: employee.nip,
            nama: employee.nama,
            email: employee.email,
            divisi: employee.divisi,
            jabatan: employee.jabatan,
            lokasi_gedung: employee.lokasi_gedung,
            lokasi_ruang: employee.lokasi_ruang,
            group_asman: employee.group_asman,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (employeeId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(`/Officer/Employee/${employeeId}`);
            }
        });
    };

    const resetForm = () => {
        setCurrentEmployee(null);
        setFormData({
            nip: '',
            nama: '',
            email: '',
            divisi: '',
            jabatan: '',
            lokasi_gedung: '',
            lokasi_ruang: '',
            group_asman: ''
        });
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    return (
        <AuthenticatedLayout role="Officer">
            <Head title="Employees Management" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Employees Management</h1>
                <button 
                    onClick={() => setIsDialogOpen(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Add Employee
                </button>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">NIP</th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Division</th>
                                <th className="py-3 px-6 text-left">Position</th>
                                <th className="py-3 px-6 text-left">Location</th>
                                <th className="py-3 px-6 text-left">Group</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(employees) && employees.length > 0 ? (
                                employees.map(employee => (
                                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-6">{employee.nip}</td>
                                        <td className="py-3 px-6">{employee.nama}</td>
                                        <td className="py-3 px-6">{employee.email}</td>
                                        <td className="py-3 px-6">{employee.divisi}</td>
                                        <td className="py-3 px-6">{employee.jabatan}</td>
                                        <td className="py-3 px-6">{`${employee.lokasi_gedung} - ${employee.lokasi_ruang}`}</td>
                                        <td className="py-3 px-6">{employee.group_asman}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button 
                                                onClick={() => handleEdit(employee)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(employee.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-3 px-6 text-center">
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {currentEmployee ? 'Edit Employee' : 'Add Employee'}
                                </h3>
                                <button 
                                    onClick={closeDialog}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            NIP
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nip}
                                            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Division
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.divisi}
                                            onChange={(e) => setFormData({ ...formData, divisi: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.jabatan}
                                            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Building Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lokasi_gedung}
                                            onChange={(e) => setFormData({ ...formData, lokasi_gedung: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Room Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lokasi_ruang}
                                            onChange={(e) => setFormData({ ...formData, lokasi_ruang: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Assistant Manager Group
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.group_asman}
                                            onChange={(e) => setFormData({ ...formData, group_asman: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeDialog}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
                                    >
                                        {currentEmployee ? 'Update Employee' : 'Add Employee'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default EmployeesIndex;