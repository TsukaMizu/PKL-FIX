import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

function AuthenticatedLayout1({ header, children, role }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const user = usePage().props.auth.user;
    const roles = role;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        return currentTime.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const getDashboardRoute = () => {
        if (roles.includes("Helper")) {
            return route("dashboard.helper");
        } else if (roles.includes("Officer")) {
            return route("dashboard.officer");
        } else if (roles.includes("Asisten Manager")) {
            return route("dashboard.asistenmanager");
        } else if (roles.includes("Manager")) {
            return route("dashboard.manager");     
        } else if (roles.includes("pilihrole")) {
            return route("pilihrole.index");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                            <span className="ml-3 text-xl font-semibold">SIMA</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                {formatTime()}
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                                            {user.name}
                                            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route("logout")} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className={`fixed left-0 top-[57px] z-20 h-full w-64 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full overflow-y-auto bg-white border-r border-gray-200 py-4 px-3">
                    <ul className="space-y-2">
                        {roles.includes("Asisten Manager") && (
                            
                            <>
                                <li>
                                    <NavLink
                                        href={route("dashboard.asistenmanager")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("users.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        User Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("categories.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Category Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("employee.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Employees Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("itemstock.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Item Stock Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("task.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Task Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("categorytask.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Categories Task Management
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route("items.index")}
                                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                        Asset Management 
                                    </NavLink>
                                </li>
                                {/* Tambahkan menu lainnya dengan format yang sama */}
                            </>
                        )};
                        {/* Tambahkan kondisi untuk role lainnya */}
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`pt-[57px] transition-margin duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <div className="p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthenticatedLayout1;