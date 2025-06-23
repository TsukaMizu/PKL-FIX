import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head, usePage } from '@inertiajs/react';

const MySwal = withReactContent(Swal);

const CategoryIndex = () => {
    const { props } = usePage();
    const { categories = [], flash } = props;
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        kode: '',
        deskripsi: ''
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
        if (!formData.nama || !formData.kode) {
            MySwal.fire({
                icon: 'warning',
                title: 'Validation Failed',
                text: 'Please complete all required fields!',
            });
            return;
        }

        if (currentCategory) {
            // Update existing category
            Inertia.put(`/Officer/Category/Item/${currentCategory.id}`, formData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Category updated successfully!',
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
            // Create new category
            Inertia.post('/Officer/Category/Item', formData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Category created successfully!',
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

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setFormData({
            nama: category.nama,
            kode: category.kode,
            deskripsi: category.deskripsi || ''
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
                Inertia.delete(`/Officer/Category/Item/${categoryId}`, {
                    onSuccess: () => {
                        MySwal.fire('Deleted!', 'Category has been deleted.', 'success');
                    }
                });
            }
        });
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setCurrentCategory(null);
        setFormData({
            nama: '',
            kode: '',
            deskripsi: ''
        });
    };

    return (
        <AuthenticatedLayout role="Officer">
            <Head title="Categories Management" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
                <button 
                    onClick={() => setIsDialogOpen(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4 inline-block"
                >
                    Add Category
                </button>

                {/* Categories Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Code</th>
                                <th className="py-3 px-6 text-left">Description</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {categories.map(category => (
                                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{category.nama}</td>
                                    <td className="py-3 px-6 text-left">{category.kode}</td>
                                    <td className="py-3 px-6 text-left">{category.deskripsi}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center">
                                            <button 
                                                onClick={() => handleEdit(category)} 
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition duration-300 mx-1"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(category.id)} 
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300 mx-1"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal Dialog */}
                {isDialogOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    {currentCategory ? 'Edit Category' : 'Add Category'}
                                </h3>
                                <button 
                                    onClick={closeDialog} 
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input 
                                            type="text" 
                                            id="nama" 
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="kode" className="block text-sm font-medium text-gray-700">
                                            Code
                                        </label>
                                        <input 
                                            type="text" 
                                            id="kode" 
                                            value={formData.kode}
                                            onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea 
                                            id="deskripsi" 
                                            value={formData.deskripsi}
                                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                                            rows="3"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={closeDialog}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
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

export default CategoryIndex;