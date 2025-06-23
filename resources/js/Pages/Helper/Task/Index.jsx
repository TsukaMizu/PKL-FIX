import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head, usePage } from '@inertiajs/react';

const MySwal = withReactContent(Swal);

const TasksIndex = () => {
    const { tasks = [], employees = [], categories = [], currentDateTime = '2025-01-21 02:57:53', flash } = usePage().props;
 
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [formData, setFormData] = useState({
        karyawan_id: '',
        kategori_id: '',
        trouble: '',
        solusi: '',
        status: 'Pending',
        keterangan: ''
    });

    // Tambahkan state untuk detail karyawan yang dipilih
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

    useEffect(() => {
        if (formData.karyawan_id) {
            const employee = employees.find(emp => emp.id.toString() === formData.karyawan_id.toString());
            setSelectedEmployeeDetails(employee);
        } else {
            setSelectedEmployeeDetails(null);
        }
    }, [formData.karyawan_id]);

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
        
        // Include current date time in submission
        const submitData = {
            ...formData,
            tanggal_laporan: currentDateTime
        };
        
        if (currentTask) {
            Inertia.put(`/Helper/Task/${currentTask.id}`, submitData);
        } else {
            Inertia.post('/Helper/Task', submitData);
        }
    };

    const handleEdit = (task) => {
        setCurrentTask(task);
        setFormData({
            karyawan_id: task.karyawan_id,
            kategori_id: task.kategori_id,
            trouble: task.trouble,
            solusi: task.solusi,
            status: task.status,
            keterangan: task.keterangan
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (taskId) => {
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
                Inertia.delete(`/Helper/Task/${taskId}`);
            }
        });
    };

    return (
        <AuthenticatedLayout role="Helper">
            <Head title="Task Management" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Task Management</h1>

                <button 
                    onClick={() => setIsDialogOpen(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Add Task
                </button>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Employee</th>
                                <th className="py-3 px-6 text-left">Location</th>
                                <th className="py-3 px-6 text-left">Report Date</th>
                                <th className="py-3 px-6 text-left">Trouble</th>
                                <th className="py-3 px-6 text-left">Solution</th>
                                <th className="py-3 px-6 text-left">Category</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Notes</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{task.karyawan?.nama}</td>
                                    <td className="py-3 px-6">
                                        {`${task.karyawan?.lokasi_gedung} - ${task.karyawan?.lokasi_ruang}`}
                                    </td>
                                    <td className="py-3 px-6">{task.tanggal_laporan}</td>
                                    <td className="py-3 px-6">{task.trouble}</td>
                                    <td className="py-3 px-6">{task.solusi}</td>
                                    <td className="py-3 px-6">{task.kategori?.tugas}</td>
                                    <td className="py-3 px-6">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            task.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                                            task.status === 'Close' ? 'bg-green-200 text-green-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">{task.keterangan}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button 
                                            onClick={() => handleEdit(task)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(task.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {currentTask ? 'Edit Task' : 'Add Task'}
                                </h3>
                                <button onClick={() => setIsDialogOpen(false)} className="text-gray-500">×</button>
                            </div>

                            {/* Current DateTime Display in Form */}
                            <div className="mb-4 p-2 bg-gray-50 rounded">
                                <div className="text-sm">
                                    <span className="font-medium">Report Date and Time:</span> {currentDateTime}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Employee</label>
                                        <select
                                            value={formData.karyawan_id}
                                            onChange={(e) => setFormData({ ...formData, karyawan_id: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(employee => (
                                                <option 
                                                    key={employee.id} 
                                                    value={employee.id}
                                                >
                                                    {`${employee.nama} - ${employee.lokasi_gedung} ${employee.lokasi_ruang}`}
                                                </option>
                                            ))}
                                        </select>

                                        {selectedEmployeeDetails && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="font-medium">Building:</span> {selectedEmployeeDetails.lokasi_gedung}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Room:</span> {selectedEmployeeDetails.lokasi_ruang}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={formData.kategori_id}
                                            onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.tugas}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Trouble</label>
                                        <input
                                            type="text"
                                            value={formData.trouble}
                                            onChange={(e) => setFormData({ ...formData, trouble: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Solution</label>
                                        <input
                                            type="text"
                                            value={formData.solusi}
                                            onChange={(e) => setFormData({ ...formData, solusi: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Close">Close</option>
                                            <option value="Cancel">Cancel</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                                        <input
                                            type="text"
                                            value={formData.keterangan}
                                            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        {currentTask ? 'Update Task' : 'Add Task'}
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

export default TasksIndex;