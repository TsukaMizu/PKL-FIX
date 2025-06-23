import { Link, usePage } from "@inertiajs/react";
import React from "react";
import MenuItems from "../../Helper/Constants/MenuItems";
// import Routes from "../../Constants/Routes";

const Sidebar = ({ role }) => {
    const { url } = usePage();

    const isActive = (path) => {
        return route().current(path);
    };

    const renderSubMenu = (subMenu) => {
        return subMenu?.map((item) => (
            <Link
                key={item.id}
                href={route(item.path)}
                className={`pl-11 py-2 text-sm block transition-all duration-300 ${
                    isActive(item.path)
                        ? "text-blue-600 font-medium bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
                {item.title}
            </Link>
        ));
    };

    const renderMenuItem = (item) => {
        const active = isActive(item.path);
        const hasSubMenu = item.subMenu && item.subMenu.length > 0;

        return (
            <div key={item.id} className="mb-1">
                <Link
                    href={route(item.path)}
                    className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                        active
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                    <i className={`${item.icon} w-5 mr-3 text-center`}></i>
                    <span className="flex-1">{item.title}</span>
                    {hasSubMenu && (
                        <i
                            className={`fas fa-chevron-right text-xs transition-transform duration-300 ${
                                active ? "rotate-90" : ""
                            }`}
                        ></i>
                    )}
                </Link>
                {hasSubMenu && active && (
                    <div className="mt-1">{renderSubMenu(item.subMenu)}</div>
                )}
            </div>
        );
    };

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300 shadow-sm">
            <div className="flex flex-col h-full">
                <div className="flex-1 px-3 py-4 overflow-y-auto">
                    {MenuItems[role]?.map(renderMenuItem)}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        © 2024 SIMA. All rights reserved.
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;