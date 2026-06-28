import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Palette,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';

const navItems = [
    {
        path: '/admin/dashboard',
        label: 'Tableau de bord',
        icon: LayoutDashboard
    },
    {
        path: '/admin/dashboard', // Mapping to dashboard as Livraisons for now
        label: 'Livraisons',
        icon: Package,
    },
    {
        path: '/admin/invoices',
        label: 'Facturation',
        icon: FileText,
    },
    {
        path: '/admin/site-builder',
        label: 'Mon Site',
        icon: Palette,
    },
    
];

interface SidebarProps {
    className?: string;
    showLogo?: boolean;
}

export function Sidebar({ className, showLogo = true }: SidebarProps) {
    return (
        <div className={cn("flex flex-col h-full bg-slate-50 border-r border-slate-200", className)}>
            {/* Logo */}
            {showLogo && (
                <div className="h-20 flex items-center px-4 border-b border-slate-200 gap-3">
                    <img
                        src={vandaLogo}
                        alt="Vanda Studio Logo"
                        style={{ height: '42px', objectFit: 'contain' }}
                    />
                    <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.2
                    }}>
                        VANDA<br/>STUDIO
                    </span>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            "text-slate-600 hover:bg-white hover:text-slate-900 border-l-4 border-transparent",
                            isActive && "bg-white text-slate-900 shadow-sm border-l-[#4caf50]"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
