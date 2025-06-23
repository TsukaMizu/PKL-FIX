const Routes = {
    auth: {
        login: 'login',
        logout: 'logout',
        register: 'register',
        forgotPassword: 'password.request',
        resetPassword: 'password.reset',
        profile: 'profile.edit'
    },
    helper: {
        dashboard: 'dashboard.helper'
    },
    officer: {
        dashboard: 'dashboard.officer',
        assets: {
            index: 'assets.index',
            create: 'assets.create',
            edit: 'assets.edit',
            show: 'assets.show',
            delete: 'assets.destroy',
            history: 'assets.history',
            maintenance: 'assets.maintenance'
        },
        loans: {
            index: 'loans.index',
            create: 'loans.create',
            edit: 'loans.edit',
            show: 'loans.show',
            delete: 'loans.destroy',
            approve: 'loans.approve',
            reject: 'loans.reject',
            return: 'loans.return'
        },
        maintenance: {
            index: 'maintenance.index',
            create: 'maintenance.create',
            edit: 'maintenance.edit',
            show: 'maintenance.show',
            delete: 'maintenance.destroy',
            complete: 'maintenance.complete'
        },
        karyawan: {
            index: 'kelolaKaryawan.officer',
            create: 'kelolaKaryawan.create',
            edit: 'kelolaKaryawan.edit',
            show: 'kelolaKaryawan.show',
            delete: 'kelolaKaryawan.destroy'
        }
    },
    asistenManager: {
        dashboard: 'dashboard.asistenmanager',
        approvals: {
            index: 'approvals.index',
            pending: 'approvals.pending',
            history: 'approvals.history',
            approve: 'approvals.approve',
            reject: 'approvals.reject'
        },
        reports: {
            index: 'reports.index',
            assets: 'reports.assets',
            loans: 'reports.loans',
            maintenance: 'reports.maintenance',
            export: {
                excel: 'reports.export.excel',
                pdf: 'reports.export.pdf'
            }
        }
    },
    manager: {
        dashboard: 'dashboard.manager',
        management: {
            users: {
                index: 'management.users.index',
                create: 'management.users.create',
                edit: 'management.users.edit',
                show: 'management.users.show',
                delete: 'management.users.destroy'
            },
            roles: {
                index: 'management.roles.index',
                create: 'management.roles.create',
                edit: 'management.roles.edit',
                delete: 'management.roles.destroy',
                permissions: 'management.roles.permissions'
            }
        },
        reports: {
            summary: 'reports.summary',
            analytics: 'reports.analytics',
            performance: 'reports.performance',
            export: {
                excel: 'reports.manager.export.excel',
                pdf: 'reports.manager.export.pdf'
            }
        },
        settings: {
            general: 'settings.general',
            email: 'settings.email',
            notification: 'settings.notification',
            backup: 'settings.backup'
        }
    },
    common: {
        notifications: 'notifications.index',
        profile: {
            show: 'profile.show',
            edit: 'profile.edit',
            password: 'profile.password',
            avatar: 'profile.avatar'
        },
        search: 'search',
        error: {
            403: 'error.403',
            404: 'error.404',
            500: 'error.500'
        }
    }
};

// Helper function untuk mendapatkan route dengan parameter
const getRoute = (path, params = {}) => {
    const route = path.split('.').reduce((obj, key) => obj[key], Routes);
    if (typeof route === 'function') {
        return route(params);
    }
    return route;
};

export { Routes as default, getRoute };