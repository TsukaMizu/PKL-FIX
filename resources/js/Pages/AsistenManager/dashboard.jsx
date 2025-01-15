import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout1';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout role="Asisten Manager"
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Asisten Manager
                </h2>
            }
        >
            <Head title="Asisten Manager Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
