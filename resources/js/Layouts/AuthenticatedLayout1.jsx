import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

function AuthenticatedLayout1({ header, children, role }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [categoryAccordionOpen, setCategoryAccordionOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(true);
    const [userAccordionOpen, setUserAccordionOpen] = useState(false);
    const [assetAccordionOpen, setAssetAccordionOpen] = useState(false);
    const [taskAccordionOpen, setTaskAccordionOpen] = useState(false);
    const [dashboardManagerOpen, setDashboardManagerOpen] = useState(false);
    const [categoryAccordionOpen1, setCategoryAccordionOpen1] = useState(false);
    const [dashboardOpen1, setDashboardOpen1] = useState(true);
    const [userAccordionOpen1, setUserAccordionOpen1] = useState(false);
    const [assetAccordionOpen1, setAssetAccordionOpen1] = useState(false);
    const [taskAccordionOpen1, setTaskAccordionOpen1] = useState(false);
    const [dashboardManagerOpen1, setDashboardManagerOpen1] = useState(false);
    const [categoryAccordionOpen2, setCategoryAccordionOpen2] = useState(false);
    const [dashboardOpen2, setDashboardOpen2] = useState(true);
    const [userAccordionOpen2, setUserAccordionOpen2] = useState(false);
    const [assetAccordionOpen2, setAssetAccordionOpen2] = useState(false);
    const [taskAccordionOpen2, setTaskAccordionOpen2] = useState(false);
    const [dashboardManagerOpen2, setDashboardManagerOpen2] = useState(false);
    const [categoryAccordionOpen3, setCategoryAccordionOpen3] = useState(false);
    const [dashboardOpen3, setDashboardOpen3] = useState(true);
    const [userAccordionOpen3, setUserAccordionOpen3] = useState(false);
    const [assetAccordionOpen3, setAssetAccordionOpen3] = useState(false);
    const [taskAccordionOpen3, setTaskAccordionOpen3] = useState(false);
    const [dashboardManagerOpen3, setDashboardManagerOpen3] = useState(false);
    const [userManagerAccordionOpen, setUserManagerAccordionOpen] = useState(false);

    const user = usePage().props.auth.user;
const roles = role || []; // Default to an empty array if roles is undefined
console.log("Roles:", roles); // Debugging line

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

    const renderNavLinks = () => {
        if (roles === "Manager") {
            return (
                <>
                    {/* Manager Section */}
                    {/* Dashboard */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setDashboardManagerOpen(!dashboardManagerOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    dashboardManagerOpen ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${dashboardManagerOpen ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("dashboard.manager")}
                                active={route().current("dashboard.manager")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Overview
                            </NavLink>
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setUserAccordionOpen(!userAccordionOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>User Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    userAccordionOpen ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${userAccordionOpen ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("manager.users.index")}
                                active={route().current("manager.users.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                User List
                            </NavLink>
                            
                            <NavLink
                                href={route("manager.employee.index")}
                                active={route().current("manager.employee.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Employee Management
                            </NavLink>
                        </div>
                    </div>

                    {/* Asset Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setAssetAccordionOpen(!assetAccordionOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>Asset Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    assetAccordionOpen ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${assetAccordionOpen ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("manager.items.index")}
                                active={route().current("manager.items.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Asset List
                            </NavLink>
                            
                            <NavLink
                                href={route("manager.itemstock.index")}
                                active={route().current("manager.itemstock.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                Stock Management
                            </NavLink>
                        </div>
                    </div>

                    {/* Task Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setTaskAccordionOpen(!taskAccordionOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>Task Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    taskAccordionOpen ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${taskAccordionOpen ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("manager.task.index")}
                                active={route().current("manager.task.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Task List
                            </NavLink>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setCategoryAccordionOpen(!categoryAccordionOpen)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Categories</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    categoryAccordionOpen ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${categoryAccordionOpen ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("manager.categories.index")}
                                active={route().current("manager.categories.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Category Item
                            </NavLink>
                            
                            <NavLink
                                href={route("manager.categorytask.index")}
                                active={route().current("manager.categorytask.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Category Task
                            </NavLink>
                        </div>
                    </div>
                </>


            );
        } else if (roles=== "Asisten Manager") {
            return (                
                <>
                    {/* Asisten Manager Section */}
                    {/* Dashboard */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setDashboardOpen1(!dashboardOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    dashboardOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${dashboardOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("dashboard.asistenmanager")}
                                active={route().current("dashboard.asistenmanager")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Overview
                            </NavLink>
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setUserAccordionOpen1(!userAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>User Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    userAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${userAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("asman.users.index")}
                                active={route().current("asman.users.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                User List
                            </NavLink>
                            
                            <NavLink
                                href={route("asman.employee.index")}
                                active={route().current("asman.employee.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Employee Management
                            </NavLink>
                        </div>
                    </div>

                    {/* Asset Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setAssetAccordionOpen1(!assetAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>Asset Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    assetAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${assetAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("asman.items.index")}
                                active={route().current("asman.items.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Asset List
                            </NavLink>
                            
                            <NavLink
                                href={route("asman.itemstock.index")}
                                active={route().current("asman.itemstock.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                Stock Management
                            </NavLink>
                        </div>
                    </div>

                    {/* Task Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setTaskAccordionOpen1(!taskAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>Task Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    taskAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${taskAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("asman.task.index")}
                                active={route().current("asman.task.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Task List
                            </NavLink>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setCategoryAccordionOpen1(!categoryAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Categories</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    categoryAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${categoryAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("asman.categories.index")}
                                active={route().current("asman.categories.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Category Item
                            </NavLink>
                            
                            <NavLink
                                href={route("asman.categorytask.index")}
                                active={route().current("asman.categorytask.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Category Task
                            </NavLink>
                        </div>
                    </div>
                </>
            );
        } else if (roles === "Officer") {
            return (
                <>
                    {/* Asisten Manager Section */}
                    {/* Dashboard */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setDashboardOpen1(!dashboardOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    dashboardOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${dashboardOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("dashboard.officer")}
                                active={route().current("dashboard.officer")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Overview
                            </NavLink>
                        </div>
                    </div>

                    {/* User Management */}
                    {/* <div className="space-y-1">
                        <button
                            onClick={() => setUserAccordionOpen1(!userAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>User Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    userAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>                        
                        <div className={`${userAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>                        
                            <NavLink
                                href={route("asman.employee.index")}
                                active={route().current("asman.employee.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Employee Management
                            </NavLink>
                        </div>
                    </div> */}

                    {/* Asset Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setAssetAccordionOpen1(!assetAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>Asset Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    assetAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${assetAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("officer.items.index")}
                                active={route().current("officer.items.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Asset List
                            </NavLink>
                            
                            <NavLink
                                href={route("officer.itemstock.index")}
                                active={route().current("officer.itemstock.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                Stock Management
                            </NavLink>
                        </div>
                    </div>

                    {/* Task Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setTaskAccordionOpen1(!taskAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>Task Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    taskAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${taskAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("officer.task.index")}
                                active={route().current("officer.task.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Task List
                            </NavLink>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setCategoryAccordionOpen1(!categoryAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Categories</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    categoryAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${categoryAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("officer.categories.index")}
                                active={route().current("officer.categories.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Category Item
                            </NavLink>
                            
                            <NavLink
                                href={route("officer.categorytask.index")}
                                active={route().current("officer.categorytask.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Category Task
                            </NavLink>
                        </div>
                    </div>
                </>
            );
        } else if (roles ==="Helper") {
            return (
                <>
                {/* Dashboard */}
                <div className="space-y-1">
                        <button
                            onClick={() => setDashboardOpen1(!dashboardOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    dashboardOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${dashboardOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("dashboard.helper")}
                                active={route().current("dashboard.helper")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Overview
                            </NavLink>
                        </div>
                    </div>
                    {/* Task Management */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setTaskAccordionOpen1(!taskAccordionOpen1)}
                            className="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span>Task Management</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    taskAccordionOpen1 ? 'transform rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        <div className={`${taskAccordionOpen1 ? 'block' : 'hidden'} pl-7`}>
                            <NavLink
                                href={route("helper.task.index")}
                                active={route().current("helper.task.index")}
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Task List
                            </NavLink>
                        </div>
                    </div>

                </>
            );
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
                        {renderNavLinks()}
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