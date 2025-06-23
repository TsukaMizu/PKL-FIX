import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useForm } from '@inertiajs/inertia-react';

const MySwal = withReactContent(Swal);

const ItemStockIndex = ({ stocks = [], categories, specifications = [] }) => {
    const [isSerialNumberModalOpen, setIsSerialNumberModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [serialNumbers, setSerialNumbers] = useState([]);
    const [availableItems, setAvailableItems] = useState([]);
    const [existingSerialNumbers, setExistingSerialNumbers] = useState([]);

    const serialNumberForm = useForm({
        serial_numbers: []
    });
    // Form Data untuk Step 1
    const [stockFormData, setStockFormData] = useState({
        nama_barang: '',
        kategori_id: '',
        barang_masuk: '',
        status_inventaris: ''
    });

    // Form Data untuk Step 2
    const [specFormData, setSpecFormData] = useState({
        merk: '',
        warna: '',
        spesifikasi: '',
        tahun_inventaris: new Date().getFullYear(),
        os: '',
        office: false,
        office_365: false,
        email_365: false
    });

    const handleFirstStepSubmit = (e) => {
        e.preventDefault();
        
        if (!stockFormData.nama_barang || !stockFormData.kategori_id || !stockFormData.barang_masuk ||!stockFormData.status_inventaris) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill all required fields'
            });
            return;
        }

        setCurrentFormStep(2);
    };

    const handleSpecSubmit = (e) => {
        e.preventDefault();

        if (!specFormData.merk || !specFormData.warna || !specFormData.spesifikasi || 
            !specFormData.tahun_inventaris || !specFormData.os) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill all required fields'
            });
            return;
        }

        // Validasi tipe data
        if (isNaN(parseInt(stockFormData.kategori_id)) || 
            isNaN(parseInt(stockFormData.barang_masuk)) || 
            isNaN(parseInt(specFormData.tahun_inventaris))) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Invalid numeric values'
            });
            return;
        }

        // Format data flat
        const finalData = {
            nama_barang: stockFormData.nama_barang,
            kategori_id: parseInt(stockFormData.kategori_id),
            barang_masuk: parseInt(stockFormData.barang_masuk),
            status_inventaris: stockFormData.status_inventaris,
            merk: specFormData.merk,
            warna: specFormData.warna,
            spesifikasi: specFormData.spesifikasi,
            tahun_inventaris: parseInt(specFormData.tahun_inventaris),
            os: specFormData.os,
            office: Boolean(specFormData.office),
            office_365: Boolean(specFormData.office_365),
            email_365: Boolean(specFormData.email_365)
        };

        console.log('Submitting data:', finalData);

        Inertia.post('/AsistenManager/Itemstock', finalData, {
            onSuccess: () => {
                setIsDialogOpen(false);
                resetForm();
                MySwal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item stock created successfully'
                });
            },
            onError: (errors) => {
                console.error('Submit errors:', errors);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: Object.values(errors)[0]
                });
            }
        });
    };

    const resetForm = () => {
        setStockFormData({
            nama_barang: '',
            kategori_id: '',
            barang_masuk: '',
            status_inventaris: ''
        });
        setSpecFormData({
            merk: '',
            warna: '',
            spesifikasi: '',
            tahun_inventaris: new Date().getFullYear(),
            os: '',
            office: false,
            office_365: false,
            email_365: false
        });
        setCurrentFormStep(1);
    };

    const checkAvailability = async (stock) => {
        setSelectedStock(stock);
    
    fetch(`/AsistenManager/Itemstock/${stock.id}/items-without-sn`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Initialize array sesuai jumlah item yang belum memiliki serial number
                setSerialNumbers(Array(data.count).fill(''));
            }
            setIsSerialNumberModalOpen(true);
        })
        .catch(error => {
            console.error('Error:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch items information'
            });
        });

    };
    const handleSerialNumberChange = (index, value) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = value;
        setSerialNumbers(newSerialNumbers);
    };
    const handleSerialNumberSubmit = () => {
        // Validasi field kosong
        if (serialNumbers.some(sn => !sn)) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill all serial numbers'
            });
            return;
        }
    
        // Validasi duplikasi
        const duplicates = serialNumbers.filter((item, index) => 
            serialNumbers.indexOf(item) !== index
        );
    
        if (duplicates.length > 0) {
            MySwal.fire({
                icon: 'error',
                title: 'Duplicate Serial Numbers',
                text: `Found duplicate serial numbers: ${duplicates.join(', ')}`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
    
        Inertia.post(`/AsistenManager/Itemstock/${selectedStock.id}/serial-numbers`, {
            serial_numbers: serialNumbers
        }, {
            preserveScroll: true,
            onSuccess: (response) => {
                setIsSerialNumberModalOpen(false);
                setSerialNumbers([]);
                
                // Tampilkan success message yang lebih informatif
                MySwal.fire({
                    icon: 'success',
                    title: 'Serial Numbers Added Successfully',
                    html: `
                        <div class="text-left">
                            <p><strong>Item:</strong> ${response?.item_name}</p>
                            <p><strong>Added:</strong> ${serialNumbers.length} serial numbers</p>
                            <p><strong>Total Registered:</strong> ${response?.total_registered} of ${response?.total_items} items</p>
                        </div>
                    `,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Done'
                }).then(() => {
                    window.location.reload();
                });
            },
            onError: (error) => {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.message || 'Failed to update serial numbers',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        });
    };
    return (
        <AuthenticatedLayout role="Asisten Manager">
            <Head title="Item Stock Management" />
            <div className="container mx-auto p-4">
            
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Item Stock Management</h1>
                    <div className="text-sm text-gray-600">
                    </div>
                </div>
                
                {/* Add Button */}
                <button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Add New Item Stock
                </button>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Item Name</th>
                                <th className="py-3 px-6 text-left">Category</th>
                                <th className="py-3 px-6 text-left">Stock</th>
                                <th className="py-3 px-6 text-left">Items In</th>
                                <th className="py-3 px-6 text-left">Items Borrowed</th>
                                <th className="py-3 px-6 text-left">Ownership Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <React.Fragment key={stock.id}>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-6">{stock.nama_barang}</td>
                                        <td className="py-3 px-6">
                                            {categories.find(cat => cat.id === stock.kategori_id)?.nama}
                                        </td>
                                        <td className="py-3 px-6">{stock.stok}</td>
                                        <td className="py-3 px-6">{stock.barang_masuk}</td>
                                        <td className="py-3 px-6">{stock.barang_dipinjam}</td>
                                        <td className="py-3 px-6">
                                            <span className={`px-2 py-1 rounded text xs ${
                                                stock.status_inventaris  === 'Milik' ? 'bg-green-200 text-green-800' :
                                                stock.status_inventaris === 'Sewa' ? 'bg-yellow-200 text-yellow-800':
                                                'bg-red-100 text-red-700'
                                            }`}>{stock.status_inventaris}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => checkAvailability(stock)}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                                            >
                                                Check
                                            </button>
                                                <button
                                                    onClick={() => setOpenAccordion(openAccordion === stock.id ? null : stock.id)}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                                                >
                                                    {openAccordion === stock.id ? 'Hide Details' : 'Show Details'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {openAccordion === stock.id && (
                                        <tr>
                                            <td colSpan="6" className="bg-gray-50 p-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold">Specifications</h4>
                                                        <p><span className="font-medium">Brand:</span> {stock.specification?.merk}</p>
                                                        <p><span className="font-medium">Color:</span> {stock.specification?.warna}</p>
                                                        <p><span className="font-medium">Year:</span> {stock.specification?.tahun_inventaris}</p>
                                                        <p><span className="font-medium">OS:</span> {stock.specification?.os}</p>
                                                        <p className="whitespace-pre-wrap">
                                                            <span className="font-medium">Details:</span><br/>
                                                            {stock.specification?.spesifikasi}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold">Software</h4>
                                                        <div className="space-y-1">
                                                            <p>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                                    stock.specification?.office ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></span>
                                                                Office
                                                            </p>
                                                            <p>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                                    stock.specification?.office_365 ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></span>
                                                                Office 365
                                                            </p>
                                                            <p>
                                                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                                    stock.specification?.email_365 ? 'bg-green-500' : 'bg-red-500'
                                                                }`}></span>
                                                                Email 365
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal Dialog */}
                {isDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    Add New Item Stock - Step {currentFormStep}
                                </h3>
                                <button 
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>

                            {currentFormStep === 1 ? (
                                <form onSubmit={handleFirstStepSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                            <input
                                                type="text"
                                                value={stockFormData.nama_barang}
                                                onChange={(e) => setStockFormData({
                                                    ...stockFormData,
                                                    nama_barang: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                            <div>
                                            <label className="block text-sm font-medium text-gray-700">Ownership Status</label>
                                            <select
                                                value={stockFormData.status_inventaris}
                                                onChange={(e) => setStockFormData({
                                                    ...stockFormData,
                                                    status_inventaris: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Milik">Milik</option>
                                                <option value="Sewa">Sewa</option>
                                            </select>
                                        </div>
                                        </div>
                                        <div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <select
                                                value={stockFormData.kategori_id}
                                                onChange={(e) => setStockFormData({
                                                    ...stockFormData,
                                                    kategori_id: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.nama}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                            <label className="block text-sm font-medium text-gray-700">Items In</label>
                                            <input
                                                type="number"
                                                value={stockFormData.barang_masuk}
                                                onChange={(e) => setStockFormData({
                                                    ...stockFormData,
                                                    barang_masuk: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsDialogOpen(false);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSpecSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                                            <input
                                                type="text"
                                                value={specFormData.merk}
                                                onChange={(e) => setSpecFormData({
                                                    ...specFormData,
                                                    merk: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Color</label>
                                            <input
                                                type="text"
                                                value={specFormData.warna}
                                                onChange={(e) => setSpecFormData({...specFormData,
                                                    warna: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Specifications</label>
                                            <textarea
                                                value={specFormData.spesifikasi}
                                                onChange={(e) => setSpecFormData({
                                                    ...specFormData,
                                                    spesifikasi: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                rows="3"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Year</label>
                                            <input
                                                type="number"
                                                value={specFormData.tahun_inventaris}
                                                onChange={(e) => setSpecFormData({
                                                    ...specFormData,
                                                    tahun_inventaris: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                min="2000"
                                                max="2099"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Operating System</label>
                                            <select
                                                value={specFormData.os}
                                                onChange={(e) => setSpecFormData({
                                                    ...specFormData,
                                                    os: e.target.value
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            >
                                                <option value="">Select OS</option>
                                                <option value="Windows 11">Windows 11</option>
                                                <option value="Windows 10">Windows 10</option>
                                                <option value="Linux">Linux</option>
                                                <option value="MacOS">MacOS</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        
                                        {/* Software Checkboxes */}
                                        <div className="col-span-2 space-y-2">
                                            <h4 className="font-medium text-gray-700">Software</h4>
                                            <div className="space-y-2">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={specFormData.office}
                                                        onChange={(e) => setSpecFormData({
                                                            ...specFormData,
                                                            office: e.target.checked
                                                        })}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="ml-2">Office</span>
                                                </label>
                                                
                                                <label className="inline-flex items-center ml-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={specFormData.office_365}
                                                        onChange={(e) => setSpecFormData({
                                                            ...specFormData,
                                                            office_365: e.target.checked
                                                        })}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="ml-2">Office 365</span>
                                                </label>
                                                
                                                <label className="inline-flex items-center ml-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={specFormData.email_365}
                                                        onChange={(e) => setSpecFormData({
                                                            ...specFormData,
                                                            email_365: e.target.checked
                                                        })}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="ml-2">Email 365</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentFormStep(1)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

{/* Serial Number Modal */}
{isSerialNumberModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    Serial Number Management
                </h3>
                <button 
                    onClick={() => {
                        setIsSerialNumberModalOpen(false);
                        setSerialNumbers([]);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
            </div>

            <div className="mb-4">
                <h4 className="font-medium mb-2">Item Details:</h4>
                <p><span className="font-medium">Name:</span> {selectedStock?.nama_barang}</p>
                <p><span className="font-medium">Category:</span> {categories.find(cat => cat.id === selectedStock?.kategori_id)?.nama}</p>
                <p><span className="font-medium">Total Items:</span> {selectedStock?.barang_masuk}</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {/* Existing Serial Numbers */}
                {selectedStock?.items?.filter(item => item.serial_number).length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Registered Serial Numbers:</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {selectedStock?.items
                                ?.filter(item => item.serial_number)
                                .map((item, index) => (
                                    <div key={`existing-${index}`} className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Serial Number {index + 1}
                                        </label>
                                        <input
                                            type="text"
                                            value={item.serial_number}
                                            disabled
                                            className="w-full rounded-md border-gray-300 bg-gray-100"
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* New Serial Numbers Input Fields */}
                {serialNumbers.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {serialNumbers.map((serialNumber, index) => (
                            <div key={index} className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Serial Number {selectedStock?.items?.filter(item => item.serial_number).length + index + 1}
                                </label>
                                <input
                                    type="text"
                                    value={serialNumber}
                                    onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder={`Enter serial number ${selectedStock?.items?.filter(item => item.serial_number).length + index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={() => {
                        setIsSerialNumberModalOpen(false);
                        setSerialNumbers([]);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Close
                </button>
                {/* Tampilkan tombol Save All hanya jika ada serial numbers yang belum diisi */}
                {serialNumbers.length > 0 && (
                    <button
                        onClick={handleSerialNumberSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Save All
                    </button>
                )}
            </div>
        </div>
    </div>
)}      
            </div>
        </AuthenticatedLayout>
    );
};

export default ItemStockIndex;