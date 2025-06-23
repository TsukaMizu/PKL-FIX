
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
    ChartBarIcon, 
    ClipboardDocumentListIcon, 
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

export default function HelperDashboard({ stats, currentTime, currentUser }) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { name: 'Overview', icon: ChartBarIcon },
        { name: 'Task Details', icon: ClipboardDocumentListIcon },
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
                    title="Total Tasks"
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
                    title="Cancelled Tasks"
                    value={stats.overview.cancelled_tasks}
                    icon={ClipboardDocumentCheckIcon}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                    <Pie
                        data={{
                            labels: stats.tasks.status_distribution.map(item => item.status),
                            datasets: [{
                                data: stats.tasks.status_distribution.map(item => item.count),
                                backgroundColor: [
                                    '#10B981', // Completed
                                    '#F59E0B', // Pending
                                    '#EF4444', // Cancelled
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
        </div>
    );

    // Task Details Panel
    const TaskDetailsPanel = () => (
        <div className="space-y-6">
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

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recent_tasks.map((task, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{task.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{task.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={task.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(task.created_at), 'dd MMM yyyy HH:mm')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            role="Helper"
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Helper Dashboard
                    </h2>
                    <div className="text-sm text-gray-500">
                        {format(new Date(currentTime), 'yyyy-MM-dd HH:mm:ss')} UTC | {currentUser}
                    </div>
                </div>
            }
        >
            <Head title="Helper Dashboard" />

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
                                    <TaskDetailsPanel />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="mt-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Tasks Activity</h3>
                            <div className="space-y-4">
                                {stats.recent_tasks.map((task, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                                        <div className={`p-2 rounded-full ${
                                            task.status === 'Close' ? 'bg-green-100 text-green-600' :
                                            task.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            <ClipboardDocumentListIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{task.description}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(task.created_at), 'PPp')}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-xs text-gray-500">{task.category}</span>
                                                <span className="text-gray-300">•</span>
                                                <StatusBadge status={task.status} small />
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
                        <p>Helper: {currentUser}</p>
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