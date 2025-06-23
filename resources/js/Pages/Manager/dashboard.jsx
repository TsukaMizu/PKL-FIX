import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { 
    ChartBarIcon, 
    UsersIcon, 
    ClipboardDocumentListIcon, 
    ComputerDesktopIcon,
    ClipboardDocumentCheckIcon,
    BuildingOfficeIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
);

export default function Dashboard({ stats, currentTime, currentUser }) {
    const [filters, setFilters] = useState({
        dateRange: 'month',
        category: '',
        status: '',
        startDate: '',
        endDate: '',
    });

    const [activeTab, setActiveTab] = useState(0);

    // Komponen Statistik Card
    const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    // Komponen Filter
    const FilterSection = () => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        {stats?.categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.tugas || category.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="Close">Close</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => handleFilterSubmit()}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );

    const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
        <div className="flex space-x-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                />
            </div>
        </div>
    );

    // Tab Data
    const tabs = [
        { name: 'Overview', icon: ChartBarIcon },
        { name: 'Tasks', icon: ClipboardDocumentListIcon },
        { name: 'Inventory', icon: ComputerDesktopIcon },
        { name: 'Employees', icon: UsersIcon },
    ];

    // Statistik Overview
    const OverviewPanel = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Tasks"
                    value={stats.overview.total_tasks}
                    subtitle="All time tasks"
                    icon={ClipboardDocumentListIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Inventory"
                    value={stats.overview.total_inventory}
                    subtitle="Available items"
                    icon={ComputerDesktopIcon}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Employees"
                    value={stats.overview.total_employees}
                    subtitle="Active employees"
                    icon={UsersIcon}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Pending Tasks"
                    value={stats.overview.pending_tasks}
                    subtitle="Needs attention"
                    icon={ClipboardDocumentCheckIcon}
                    color="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-6">Task Status Distribution</h3>
                    <Pie
                        data={{
                            labels: stats.tasks.status_distribution.map(item => item.status),
                            datasets: [{
                                data: stats.tasks.status_distribution.map(item => item.count),
                                backgroundColor: [
                                    '#10B981', // Green for Completed
                                    '#F59E0B', // Yellow for Pending
                                    '#EF4444', // Red for Cancelled
                                ],
                            }],
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                        height={300}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-6">Monthly Task Trends</h3>
                    <Line
                        data={{
                            labels: stats.tasks.monthly_trends.map(item => 
                                format(new Date(item.month), 'MMM yyyy')
                            ),
                            datasets: [{
                                label: 'Tasks',
                                data: stats.tasks.monthly_trends.map(item => item.count),
                                borderColor: '#3B82F6',
                                tension: 0.1,
                                fill: false,
                            }],
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0,
                                    },
                                },
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                        height={300}
                    />
                </div>
            </div>
        </>
    );

    // Statistik Tasks Panel
    // TasksPanel Component
const TasksPanel = () => {
    // Pastikan data kategori ada dan memiliki properti yang dibutuhkan
    const categoryData = stats.tasks.category_distribution.map(item => ({
        label: item.kategori?.tugas || 'Uncategorized', // Gunakan optional chaining
        count: item.count || 0
    }));

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Tasks by Status</h3>
                    <div className="space-y-2">
                        {stats.tasks.status_distribution.map((status, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-600">{status.status || 'Unknown'}</span>
                                <span className="font-semibold">{status.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Tasks by Category</h3>
                    <Bar
                        data={{
                            labels: categoryData.map(item => item.label),
                            datasets: [{
                                label: 'Tasks',
                                data: categoryData.map(item => item.count),
                                backgroundColor: '#3B82F6',
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0
                                    }
                                }
                            }
                        }}
                        height={200}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Monthly Trends</h3>
                    <Line
                        data={{
                            labels: stats.tasks.monthly_trends.map(item => 
                                format(new Date(item.month), 'MMM yyyy')
                            ),
                            datasets: [{
                                label: 'Tasks',
                                data: stats.tasks.monthly_trends.map(item => item.count),
                                borderColor: '#3B82F6',
                                tension: 0.1
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0
                                    }
                                }
                            }
                        }}
                        height={200}
                    />
                </div>
            </div>

            {/* Recent Tasks Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.recent_activity
                                    .filter(activity => activity.type === 'task')
                                    .map((task, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {task.description.split(' for ')[1] || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {task.category || 'Uncategorized'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    task.status === 'Close' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(task.timestamp), 'dd MMM yyyy HH:mm')}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
    
    

    // Statistik Inventory Panel
    const InventoryPanel = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6">Inventory by Category</h3>
                <Doughnut
                    data={{
                        labels: stats.inventory.category_distribution.map(item => item.category.nama),
                        datasets: [{
                            data: stats.inventory.category_distribution.map(item => item.total),
                            backgroundColor: [
                                '#3B82F6',
                                '#10B981',
                                '#F59E0B',
                                '#EF4444',
                                '#8B5CF6',
                            ],
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                        },
                    }}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6">Items Status</h3>
                <Bar
                    data={{
                        labels: ['Available', 'Borrowed', 'Maintenance'],
                        datasets: [{
                            label: 'Items by Status',
                            data: [
                                stats.inventory.available_items,
                                stats.inventory.borrowed_items,
                                stats.inventory.maintenance_items,
                            ],
                            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );

    // Statistik Employees Panel
    const EmployeesPanel = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6">Employees by Division</h3>
                <Pie
                    data={{
                        labels: stats.employees.division_distribution.map(item => item.divisi),
                        datasets: [{
                            data: stats.employees.division_distribution.map(item => item.count),
                            backgroundColor: [
                                '#3B82F6',
                                '#10B981',
                                '#F59E0B',
                                '#EF4444',
                                '#8B5CF6',
                            ],
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                        },
                    }}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-6">Employee Location Distribution</h3>
                <Bar
                    data={{
                        labels: stats.employees.location_distribution.map(item => item.lokasi_gedung),
                        datasets: [{
                            label: 'Employees per Location',
                            data: stats.employees.location_distribution.map(item => item.count),
                            backgroundColor: '#3B82F6',
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            role="Manager"
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Manager
                    </h2>
                    <div className="text-sm text-gray-500">
                        {format(new Date(currentTime), 'PPpp')} | {currentUser}
                    </div>
                </div>
            }
        >
            <Head title="Asisten Manager Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <FilterSection />

                    <div className="mb-6">
                        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                                            ${
                                                selected
                                                ? 'bg-white text-blue-700 shadow'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                        }`
                                    }
                                >
                                    <div className="flex items-center justify-center">
                                        <tab.icon className="h-5 w-5 mr-2" />
                                        {tab.name}
                                    </div>
                                </Tab>
                            ))}
                        </Tab.List>

                        <Tab.Panels className="mt-6">
                            <Tab.Panel>
                                <OverviewPanel />
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard
                                        title="Total Tasks"
                                        value={stats.tasks.total}
                                        subtitle="All tasks"
                                        icon={ClipboardDocumentListIcon}
                                        color="bg-blue-500"
                                    />
                                    <StatCard
                                        title="Pending Tasks"
                                        value={stats.tasks.pending}
                                        subtitle="Needs attention"
                                        icon={ClipboardDocumentCheckIcon}
                                        color="bg-yellow-500"
                                    />
                                    <StatCard
                                        title="Completed Tasks"
                                        value={stats.tasks.completed}
                                        subtitle="Successfully finished"
                                        icon={ClipboardDocumentCheckIcon}
                                        color="bg-green-500"
                                    />
                                </div>
                                <TasksPanel />
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard
                                        title="Total Items"
                                        value={stats.inventory.total_items}
                                        subtitle="All inventory items"
                                        icon={ComputerDesktopIcon}
                                        color="bg-blue-500"
                                    />
                                    <StatCard
                                        title="Items Borrowed"
                                        value={stats.inventory.items_borrowed}
                                        subtitle="Currently in use"
                                        icon={ComputerDesktopIcon}
                                        color="bg-yellow-500"
                                    />
                                    <StatCard
                                        title="Available Items"
                                        value={stats.inventory.items_available}
                                        subtitle="Ready to use"
                                        icon={ComputerDesktopIcon}
                                        color="bg-green-500"
                                    />
                                </div>
                                <InventoryPanel />
                            </Tab.Panel>

                            <Tab.Panel>
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard
                                        title="Total Employees"
                                        value={stats.employees.total}
                                        subtitle="Active employees"
                                        icon={UsersIcon}
                                        color="bg-blue-500"
                                    />
                                    <StatCard
                                        title="Divisions"
                                        value={stats.employees.total_divisions}
                                        subtitle="Active divisions"
                                        icon={BuildingOfficeIcon}
                                        color="bg-purple-500"
                                    />
                                    <StatCard
                                        title="Locations"
                                        value={stats.employees.total_locations}
                                        subtitle="Office locations"
                                        icon={BuildingOfficeIcon}
                                        color="bg-green-500"
                                    />
                                </div>
                                <EmployeesPanel />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {stats.recent_activity?.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className={`p-2 rounded-full ${
                                        activity.type === 'task' ? 'bg-blue-100 text-blue-600' :
                                        activity.type === 'inventory' ? 'bg-green-100 text-green-600' :
                                        'bg-purple-100 text-purple-600'
                                    }`}>
                                        {activity.type === 'task' ? <ClipboardDocumentListIcon className="h-5 w-5" /> :
                                         activity.type === 'inventory' ? <ComputerDesktopIcon className="h-5 w-5" /> :
                                         <UsersIcon className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(activity.timestamp), 'PPp')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Last updated: {format(new Date('2025-01-30 22:27:34'), 'PPpp')}</p>
                    <p>User: TsukaMizu</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);
}