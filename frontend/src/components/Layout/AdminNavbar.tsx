import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    Copy,
    ExternalLink,
    Check,
    LogOut,
    User,
    HelpCircle,
    Globe,
    ChevronDown,
    CreditCard,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authService } from '../../services/authService';
import { siteConfigService } from '../../services/siteConfigService';
import { getSiteUrl, getSiteTarget } from '@/utils/siteUrl';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';

interface AdminNavbarProps {
    onMenuClick?: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
    const [slug, setSlug] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        const fetchConfig = async () => {
            try {
                const configs = await siteConfigService.getMyConfigs();
                if (configs && configs.length > 0) {
                    // Use the first config found
                    setSlug(configs[0].slug);
                }
            } catch (error) {
                console.error("Failed to fetch site config", error);
            }
        };

        fetchConfig();

        const handleUserUpdate = () => {
            setUser(authService.getCurrentUser());
        };
        
        window.addEventListener('userUpdated', handleUserUpdate);
        return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }, []);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/admin' || path === '/admin/') {
            setBreadcrumbs(['Admin', 'Tableau de bord']);
        } else {
            const parts = path.split('/').filter(p => p && p !== 'admin');
            const formattedParts = parts.map(p => {
                return p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
            });
            setBreadcrumbs(['Admin', ...formattedParts]);
        }
    }, [location]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const copyLink = () => {
        if (!slug) return;
        const url = getSiteUrl(slug);
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
            {/* LEFT: Breadcrumbs & Back */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src={vandaLogo}
                        alt="Vanda Studio Logo"
                        className="h-[32px] md:h-[38px] object-contain"
                    />
                </div>

                <div className="hidden sm:flex items-center gap-1 text-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-gray-600 hover:text-gray-900 hidden md:flex"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center">
                            <span className="flex items-center max-w-[100px] md:max-w-none truncate">
                                {crumb}
                            </span>
                            {index < breadcrumbs.length - 1 && (
                                <span className="text-slate-300 mx-2">/</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CENTER: Search Bar */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Trouvez n'importe quoi..."
                        className="pl-9 bg-gray-100 border-none rounded-full h-10 focus-visible:ring-1 focus-visible:ring-green-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="flex items-center justify-center min-w-[20px] h-5 bg-white rounded border border-gray-200 text-[10px] text-gray-500 font-medium px-1">
                            ⌘K
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Actions & Profile */}
            <div className="flex items-center gap-2">
                {slug && (
                    <div className="flex items-center gap-2">
                        <a
                            href={getSiteUrl(slug)}
                            target={getSiteTarget(slug)}
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-full border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600 flex"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">Voir le site</span>
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 rounded-full transition-colors flex ${copied
                                ? 'border-green-400 text-green-600 bg-green-50'
                                : 'border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600'
                                }`}
                            onClick={copyLink}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline">{copied ? 'Lien copié !' : 'Copier le lien'}</span>
                        </Button>
                    </div>
                )}

                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-600"
                    onClick={onMenuClick}
                >
                    <Menu className="w-6 h-6" />
                </Button>

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 p-0 overflow-hidden border border-gray-200">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                                    {user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2">
                        <div className="flex items-center gap-3 p-2 mb-2">
                            <Avatar className="w-10 h-10 border border-gray-100">
                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                    {user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">{user?.name || 'Utilisateur'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        <div className="px-2 py-1.5 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <span>Français</span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => navigate('/pricing')}
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Mon abonnement</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="gap-2 cursor-not-allowed text-slate-300 focus:bg-transparent"
                            title="Bientôt disponible"
                        >
                            <User className="w-4 h-4 text-slate-300" />
                            <span>Mon Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                            <HelpCircle className="w-4 h-4" />
                            <span>Centre d'aide</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
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
