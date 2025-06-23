import { Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Dropdown from "@/Components/Dropdown";

const Navbar = () => {
    const { auth } = usePage().props;
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
            <div className="px-4 mx-auto">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-gray-800">
                                SIMA
                            </span>
                        </Link>
                    </div>

                    {/* Center - DateTime */}
                    <div className="flex items-center">
                        <div className="text-gray-600 bg-gray-50 px-4 py-1.5 rounded-lg text-sm">
                            <i className="far fa-clock mr-2"></i>
                            {currentTime.toLocaleString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center">
                        {/* Notifications */}
                        <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                            <i className="far fa-bell text-xl"></i>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center px-3 py-2 ml-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-2 text-left">
                                        <div className="text-sm font-medium text-gray-800">
                                            {auth.user.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {auth.user.role}
                                        </div>
                                    </div>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    <i className="far fa-user mr-2"></i>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;