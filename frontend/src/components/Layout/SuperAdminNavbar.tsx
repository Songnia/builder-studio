import { useEffect, useState } from 'react';
import { LogOut, ChevronDown, Settings, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export function SuperAdminNavbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        const handleUserUpdate = () => {
            setUser(authService.getCurrentUser());
        };

        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 items-center justify-between px-4 md:px-6 sticky top-0 z-40 hidden md:flex shrink-0">
            {/* LEFT: Title */}
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-600 tracking-tight">
                    Administration Vanda Studio
                </h2>
            </div>

            {/* RIGHT: Actions & Profile */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-auto p-1.5 md:p-2 hover:bg-slate-100 rounded-2xl flex items-center gap-3 transition-all focus-visible:ring-2 focus-visible:ring-green-500">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-extrabold text-slate-800 leading-none mb-1">{user?.name || 'Super Admin'}</p>
                                <p className="text-xs font-medium text-slate-500 leading-none">{user?.email || 'superadmin@vanda.com'}</p>
                            </div>
                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm">
                                    {user?.name?.charAt(0) || 'SA'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border-slate-100">
                        <div className="flex items-center gap-3 p-3 mb-1 bg-slate-50 rounded-xl">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
                                    {user?.name?.charAt(0) || 'SA'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-extrabold text-sm text-slate-800 truncate">{user?.name || 'Super Admin'}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{user?.email || 'superadmin@vanda.com'}</p>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="bg-slate-100" />

                        <div className="px-3 py-2 flex items-center justify-between text-sm hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <span className="font-medium text-slate-700">Français</span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>

                        <DropdownMenuSeparator className="bg-slate-100" />

                        <DropdownMenuItem
                            className="gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-slate-50 text-slate-700 font-medium"
                            onClick={() => navigate('/superadmin/profile')}
                        >
                            <User className="w-4 h-4 text-slate-400" />
                            <span>Mon Profil</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-slate-50 text-slate-700 font-medium"
                            onClick={() => navigate('/superadmin/settings')}
                        >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Paramètres système</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-100" />

                        <DropdownMenuItem
                            className="gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500 font-bold mt-1"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Se déconnecter</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
