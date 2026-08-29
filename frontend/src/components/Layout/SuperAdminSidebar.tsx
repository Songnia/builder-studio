import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    User,
    Receipt,
    History,
    Database
} from 'lucide-react';
import { authService } from '../../services/authService';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';

interface SuperAdminSidebarProps {
    className?: string;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ className = '' }) => {

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    const links = [
        { name: 'Tableau de bord', path: '/superadmin/dashboard', icon: LayoutDashboard },
        { name: 'Utilisateurs', path: '/superadmin/photographers', icon: Users },
        { name: 'Ressources', path: '/superadmin/resources', icon: Database },
        { name: 'Forfaits', path: '/superadmin/plans', icon: CreditCard },
        { name: 'Transactions', path: '/superadmin/transactions', icon: Receipt },
        { name: 'Journal d’audit', path: '/superadmin/audit-log', icon: History },
        { name: 'Mon Profil', path: '/superadmin/profile', icon: User },
        { name: 'Paramètres', path: '/superadmin/settings', icon: Settings },
    ];

    return (
        <div className={`flex flex-col h-full bg-white whitespace-nowrap ${className}`}>
            <div className="h-20 flex items-center px-4 border-b border-slate-200 gap-3">
                <img
                    src={vandaLogo}
                    alt="Vanda Studio Logo"
                    style={{ height: '42px', objectFit: 'contain' }}
                />
                <span className="transition-all duration-300 md:opacity-0 md:-translate-x-2 opacity-100 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0 md:pointer-events-none pointer-events-auto group-hover:pointer-events-auto"
                    style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.2
                    }}>
                    VANDA<br />STUDIO
                </span>
            </div>

            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden mt-6">
                <div className="px-3 mb-2">
                    <span className="text-[10px] font-extrabold tracking-[0.1em] text-slate-400 uppercase transition-all duration-300 md:opacity-0 md:-translate-x-2 opacity-100 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0">
                        Menu Principal
                    </span>
                </div>

                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 ${isActive
                                ? 'bg-green-50/80 text-green-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                            }`
                        }
                    >
                        <div className="min-w-[24px] flex items-center justify-center">
                            <link.icon className="w-[22px] h-[22px]" />
                        </div>
                        <span className="transition-all duration-300 md:opacity-0 md:-translate-x-2 opacity-100 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0 md:pointer-events-none pointer-events-auto group-hover:pointer-events-auto">
                            {link.name}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-100/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-3 py-3 text-sm font-semibold text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                    <div className="min-w-[24px] flex items-center justify-center">
                        <LogOut className="w-[22px] h-[22px]" />
                    </div>
                    <span className="transition-all duration-300 md:opacity-0 md:-translate-x-2 opacity-100 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0 md:pointer-events-none pointer-events-auto group-hover:pointer-events-auto">
                        Déconnexion
                    </span>
                </button>
            </div>
        </div>
    );
};
