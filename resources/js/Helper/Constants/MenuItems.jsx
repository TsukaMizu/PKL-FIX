const MenuItems = {
    Helper: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            path: 'dashboard.helper',
            icon: 'fas fa-home'
        }
    ],
    Officer: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            path: 'dashboard.officer',
            icon: 'fas fa-home'
        },
        {
            id: 'asset',
            title: 'Asset Management',
            path: 'assets.index',
            icon: 'fas fa-laptop',
            subMenu: [
                {
                    id: 'asset-list',
                    title: 'Daftar Asset',
                    path: 'assets.index'
                },
                {
                    id: 'asset-create',
                    title: 'Tambah Asset',
                    path: 'assets.create'
                }
            ]
        },
        {
            id: 'loans',
            title: 'Peminjaman',
            path: 'loans.index',
            icon: 'fas fa-handshake',
            subMenu: [
                {
                    id: 'loans-list',
                    title: 'Daftar Peminjaman',
                    path: 'loans.index'
                },
                {
                    id: 'loans-create',
                    title: 'Buat Peminjaman',
                    path: 'loans.create'
                }
            ]
        },
        {
            id: 'maintenance',
            title: 'Maintenance',
            path: 'maintenance.index',
            icon: 'fas fa-tools',
            subMenu: [
                {
                    id: 'maintenance-list',
                    title: 'Daftar Maintenance',
                    path: 'maintenance.index'
                },
                {
                    id: 'maintenance-create',
                    title: 'Tambah Maintenance',
                    path: 'maintenance.create'
                }
            ]
        }
    ],
    'Asisten Manager': [
        {
            id: 'dashboard',
            title: 'Dashboard',
            path: 'dashboard.asistenmanager',
            icon: 'fas fa-home'
        },
        {
            id: 'approvals',
            title: 'Approvals',
            path: 'approvals.index',
            icon: 'fas fa-check-circle',
            subMenu: [
                {
                    id: 'pending-approvals',
                    title: 'Pending Approvals',
                    path: 'approvals.pending'
                },
                {
                    id: 'approval-history',
                    title: 'Approval History',
                    path: 'approvals.history'
                }
            ]
        },
        {
            id: 'reports',
            title: 'Reports',
            path: 'reports.index',
            icon: 'fas fa-file-alt',
            subMenu: [
                {
                    id: 'asset-report',
                    title: 'Asset Report',
                    path: 'reports.asset'
                },
                {
                    id: 'loan-report',
                    title: 'Loan Report',
                    path: 'reports.loan'
                }
            ]
        }
    ],
    Manager: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            path: 'dashboard.manager',
            icon: 'fas fa-home'
        },
        {
            id: 'management',
            title: 'Management',
            path: 'management.index',
            icon: 'fas fa-users-cog',
            subMenu: [
                {
                    id: 'user-management',
                    title: 'User Management',
                    path: 'management.users'
                },
                {
                    id: 'role-management',
                    title: 'Role Management',
                    path: 'management.roles'
                }
            ]
        }
    ]
};

export default MenuItems;