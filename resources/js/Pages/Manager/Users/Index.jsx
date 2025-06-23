import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head, usePage } from '@inertiajs/react';

const MySwal = withReactContent(Swal);

const Users = ({ users = [], roles = [], auth }) => {
    const { props } = usePage();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123'
    });
    const [roleFormData, setRoleFormData] = useState({
        role_id: ''
    });

    useEffect(() => {
        // Check if we have a newly created user in the props
        if (props.flash && props.flash.user) {
            setCurrentUser(props.flash.user);
            setCurrentFormStep(2);
        }
    }, [props.flash]);

    const handleFirstStepSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            MySwal.fire({
                icon: 'warning',
                title: 'Validation Failed',
                text: 'Please complete all required fields!',
            });
            return;
        }
    
        // Move to second step
        setCurrentFormStep(2);
    };
    
    const handleRoleSubmit = (e) => {
        e.preventDefault();
        if (!roleFormData.role_id) {
            MySwal.fire({
                icon: 'warning',
                title: 'Validation Failed',
                text: 'Please select a role!',
            });
            return;
        }
    
        // Combine data from both steps
        const finalData = {
            ...formData,
            role_id: roleFormData.role_id
        };
    
        if (currentUser) {
            // Update existing user
            Inertia.put(`/Manager/Users/${currentUser.id}`, finalData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User updated successfully!',
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
            // Create new user
            Inertia.post('Manager/Users', finalData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User created successfully!',
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

    const handleDelete = (userId) => {
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
                Inertia.delete(`/Manager/Users/${userId}`);
            }
        });
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: 'password123'
        });
        setRoleFormData({
            role_id: user.roles.length ? user.roles[0].id : ''
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            MySwal.fire({
                icon: 'warning',
                title: 'Validation Failed',
                text: 'Please complete all required fields!',
            });
            return;
        }

        if (currentUser) {
            // Update existing user
            Inertia.put(`/Manager/Users/${currentUser.id}`, formData, {
                onSuccess: () => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'User updated successfully!',
                    });
                    setIsDialogOpen(false);
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
            // Create new user
            Inertia.post('/Manager/Users', formData, {
                preserveScroll: true,
                onSuccess: (page) => {
                    // If we have a user in the response, move to step 2
                    if (page.props.flash && page.props.flash.user) {
                        setCurrentUser(page.props.flash.user);
                        setCurrentFormStep(2);
                    }
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

    const closeDialog = () => {
        setIsDialogOpen(false);
        setCurrentFormStep(1);
        setCurrentUser(null);
        setFormData({
            name: '',
            email: '',
            password: 'password123'
        });
        setRoleFormData({ role_id: '' });
    };

    return (
        <AuthenticatedLayout role="Manager">
            <Head title="Users Management" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <button 
                    onClick={() => setIsDialogOpen(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4 inline-block"
                >
                    Add User
                </button>
                
                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Role</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                                    <td className="py-3 px-6 text-left">{user.email}</td>
                                    <td className="py-3 px-6 text-left">
                                        {user.roles && user.roles.map(role => (
                                            <span key={role.id} className="bg-gray-300 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                {role.nama}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center">
                                            <button 
                                                onClick={() => handleEdit(user)} 
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition duration-300 mx-1"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
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
                    {currentUser ? 'Edit User' : 'Add User'} - Step {currentFormStep}
                </h3>
                <button onClick={closeDialog} className="text-gray-600 hover:text-gray-900">&times;</button>
            </div>

            {currentFormStep === 1 ? (
                // First step form
                <form onSubmit={handleFirstStepSubmit}>
                    <div className="form-group mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            required
                        />
                    </div>
                    <div className="text-right">
                        <button 
                            type="button" 
                            onClick={closeDialog}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mx-2"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </form>
            ) : (
                // Second step form
                <form onSubmit={handleRoleSubmit}>
                    <div className="form-group mb-4">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={roleFormData.role_id}
                            onChange={(e) => setRoleFormData({ ...roleFormData, role_id: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.nama}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-right">
                        <button 
                            type="button" 
                            onClick={() => setCurrentFormStep(1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mx-2"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {currentUser ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    </div>
)}
            </div>

        </AuthenticatedLayout>
    );
};

export default Users;