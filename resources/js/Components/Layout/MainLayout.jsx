import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children, role }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Sidebar role={role} />

            {/* Main Content */}
            <div className="pl-64 pt-16">
                <main className="p-6">
                    {/* Breadcrumb bisa ditambahkan di sini */}
                    <div className="mb-6">
                        {/* Content */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-4 text-center text-sm text-gray-600">
                    <p>
                        SIMA - Sistem Informasi Manajemen Asset © {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;