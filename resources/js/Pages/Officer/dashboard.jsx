import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
    ChartBarIcon, 
    ClipboardDocumentListIcon, 
    ComputerDesktopIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { Line, Pie, Bar } from 'react-chartjs-2';
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

export default function OfficerDashboard({ stats, currentTime, currentUser }) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { name: 'Overview', icon: ChartBarIcon },
        { name: 'Tasks', icon: ClipboardDocumentListIcon },
        { name: 'Inventory', icon: ComputerDesktopIcon },
    ];

    // Filter Section Component
    const FilterSection = () => (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="">All Categories</option>
                        {stats.filters.categories.map(category => (
                            <option key={category.id} value={category.id}>{category.tugas}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="">All Statuses</option>
                        {stats.filters.statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    // Overview Panel
    const OverviewPanel = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="My Tasks"
                    value={stats.overview.my_tasks}
                    icon={ClipboardDocumentListIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Tasks"
                    value={stats.overview.pending_tasks}
                    icon={ClipboardDocumentCheckIcon}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Completed Tasks"
                    value={stats.overview.completed_tasks}
                    icon={ClipboardDocumentCheckIcon}
                    color="bg-green-500"
                />
                <StatCard
                    title="Items Handled"
                    value={stats.overview.items_handled}
                    icon={ComputerDesktopIcon}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">My Task Status Distribution</h3>
                    <Pie
                        data={{
                            labels: stats.tasks.status_distribution.map(item => item.status),
                            datasets: [{
                                data: stats.tasks.status_distribution.map(item => item.count),
                                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
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
                    <h3 className="text-lg font-semibold mb-4">Monthly Task Trends</h3>
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
            </div>
        </div>
    );

    // Tasks Panel Component
    const TasksPanel = () => (
        <div className="space-y-6">
            {/* Task Categories Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Tasks by Category</h3>
                <Bar
                    data={{
                        labels: stats.tasks.category_distribution.map(item => item.name),
                        datasets: [{
                            label: 'Tasks',
                            data: stats.tasks.category_distribution.map(item => item.count),
                            backgroundColor: '#3B82F6',
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
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

            {/* Recent Tasks Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Task
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recent_activity.map((activity, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {activity.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {activity.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={activity.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(activity.timestamp), 'dd MMM yyyy HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Inventory Panel Component
    const InventoryPanel = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Items"
                    value={stats.inventory.total_items}
                    icon={ComputerDesktopIcon}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Available Items"
                    value={stats.inventory.available_items}
                    icon={ComputerDesktopIcon}
                    color="bg-green-500"
                />
                <StatCard
                    title="Borrowed Items"
                    value={stats.inventory.borrowed_items}
                    icon={ComputerDesktopIcon}
                    color="bg-yellow-500"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
                <Bar
                    data={{
                        labels: stats.inventory.category_distribution.map(item => 
                            item.category?.nama || 'Uncategorized'
                        ),
                        datasets: [{
                            label: 'Items',
                            data: stats.inventory.category_distribution.map(item => item.total),
                            backgroundColor: '#3B82F6',
                        }],
                    }}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
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
            role="Officer"
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Officer Dashboard
                    </h2>
                    <div className="text-sm text-gray-500">
                        {format(new Date(currentTime), 'yyyy-MM-dd HH:mm:ss')} UTC | {currentUser}
                    </div>
                </div>
            }
        >
            <Head title="Officer Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filter Section */}
                    <FilterSection />

                    {/* Main Content */}
                    <div className="mb-6">
                        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                            {/* Tab Navigation */}
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

                            {/* Tab Panels */}
                            <Tab.Panels className="mt-6">
                                <Tab.Panel>
                                    <OverviewPanel />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <TasksPanel />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <InventoryPanel />
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
                                            activity.type === 'task' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {activity.type === 'task' ? 
                                                <ClipboardDocumentListIcon className="h-5 w-5" /> : 
                                                <ComputerDesktopIcon className="h-5 w-5" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(activity.timestamp), 'PPp')}
                                                </span>
                                                {activity.category && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs text-gray-500">{activity.category}</span>
                                                    </>
                                                )}
                                                {activity.status && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <StatusBadge status={activity.status} small />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Information */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Last updated: {format(new Date(currentTime), 'PPpp')}</p>
                        <p>Officer: {currentUser}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper Components
const StatusBadge = ({ status, small = false }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Close':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancel':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`
            ${small ? 'px-2 text-xs' : 'px-3 text-sm'} 
            inline-flex items-center rounded-full font-medium
            ${getStatusColor(status)}
        `}>
            {status}
        </span>
    );
};

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