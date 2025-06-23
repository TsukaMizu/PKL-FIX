import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head, usePage } from '@inertiajs/react';

const MySwal = withReactContent(Swal);

const CategoriesTaskIndex = () => {
    const { category_task = [], flash } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        tugas: ''
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
        if (!formData.tugas.trim()) {
        MySwal.fire({
            icon: 'warning',
            title: 'Validation Failed',
            text: 'Please enter a task category name!',
        });
    return;
}

        if (currentCategory) {
            Inertia.put(`/AsistenManager/Category/Task/${currentCategory.id}`, formData);
        } else {
            Inertia.post('/AsistenManager/Category/Task', formData);
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setFormData({
            tugas: category.tugas
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (categoryId) => {
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
                Inertia.delete(`/AsistenManager/Category/Task/${categoryId}`);
            }
        });
    };
    const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentCategory(null);
    setFormData(() => ({ tugas: '' }));

};


    return (
        <AuthenticatedLayout role="Asisten Manager">
            <Head title="Category Task Management" />
            <Head>
                <link rel="icon" type="image/jpeg" href="/images/Indonesia_Power_Logo.png" />
            </Head>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Category Task Management</h1>
                </div>
                <button 
                    onClick={() => {
                        setCurrentCategory(null);
                        setFormData({ tugas: '' });
                        setIsDialogOpen(true);
                    }} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Add Category Task
                </button>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Task Category</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category_task.map(category => (
                                <tr key={category.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{category.id}</td>
                                    <td className="py-3 px-6">{category.tugas}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button 
                                            onClick={() => handleEdit(category)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(category.id)}
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
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {currentCategory ? 'Edit Category Task' : 'Add Category Task'}
                                </h3>
                                <button 
                                    onClick={closeDialog}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tugas}
                                        onChange={(e) => setFormData({ ...formData, tugas: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeDialog}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        {currentCategory ? 'Update Category' : 'Add Category'}
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

export default CategoriesTaskIndex;