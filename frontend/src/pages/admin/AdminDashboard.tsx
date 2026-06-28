import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { galleryService } from '../../services/galleryService';
import { api } from '@/services/api';
import type { Gallery } from '../../types/gallery';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Share2, Heart, Download, Star, Youtube, Users, MessageSquare, MessageCircle, Image as ImageIcon } from 'lucide-react';
import ShareDialog from '../../components/Delivery/ShareDialog';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { UpgradeDialog } from '@/components/common/UpgradeDialog';

const GalleryThumbnail = ({ url }: { url: string }) => {
    const [error, setError] = useState(false);
    
    if (error || !url) {
        return (
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-[#2E7D32] bg-white/20 backdrop-blur-md flex items-center justify-center text-white/90 shadow-sm shrink-0">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
        );
    }
    
    return (
        <img 
            src={url} 
            alt="thumbnail" 
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-[#2E7D32] object-cover shrink-0"
            onError={() => setError(true)}
        />
    );
};

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'livraisons' | 'factures'>('livraisons');
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareUuid, setShareUuid] = useState('');
    const [shareSlug, setShareSlug] = useState<string | undefined>(undefined);
    const [sharePhone, setSharePhone] = useState<string | undefined>(undefined);
    const [user, setUser] = useState<any>(null);

    // Plan limits
    const { checkLimit, currentPlan } = usePlanLimits();
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState<'photos' | 'galleries' | 'domain' | 'branding'>('galleries');

    useEffect(() => {
        setUser(authService.getCurrentUser());
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [galleriesData, invoicesResponse] = await Promise.all([
                galleryService.getAllGalleries(),
                api.get('/admin/invoices').catch(() => ({ data: [] })) // Handle case if billing is not setup properly yet
            ]);
            setGalleries(galleriesData);
            
            // Sort invoices by date desc
            const sortedInvoices = (invoicesResponse.data || []).sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setInvoices(sortedInvoices);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette galerie ?')) {
            await galleryService.deleteGallery(uuid);
            loadDashboardData();
        }
    };

    const handleView = (uuid: string) => {
        navigate(`/admin/gallery/${uuid}`);
    };

    const handleShare = (uuid: string) => {
        const gallery = galleries.find(g => g.uuid === uuid);
        setShareUuid(uuid);
        setShareSlug(gallery?.photographerSlug);
        setSharePhone(gallery?.clientPhone);
        setShareDialogOpen(true);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    };

    // Computations
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0);
    const recentInvoices = invoices.slice(0, 2);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 px-4 sm:px-0">
            {/* Upgrade Banner */}
            {/* 
            <div className="bg-[#FFFAF0] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden border border-green-100 shadow-sm transition-all hover:shadow-md">
                <div className="z-10 relative space-y-4 max-w-xl">
                    <div className="text-green-600 font-bold tracking-wide text-xs uppercase">UPGRADE PRO</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">Passez au niveau supérieur.</h2>
                    <p className="text-slate-600 text-lg">
                        Débloquez toutes les fonctionnalités premium : Stockage illimité, noms de domaine personnalisés et bien plus encore.
                    </p>
                    <Button className="bg-[#4caf50] text-white hover:bg-[#45a049] font-bold rounded-full px-8 h-12 text-base transition-all transform hover:scale-105">
                        Passer Pro <span className="ml-2">&gt;</span>
                    </Button>
                </div>

                <div className="hidden md:block relative">
                    <div className="absolute -right-20 -top-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    <div className="absolute -right-10 top-10 w-60 h-60 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

                    <div className="relative w-72 h-44 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 rotate-3 transform transition-transform hover:rotate-0 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Star className="w-5 h-5 text-green-600 fill-green-600" />
                                </div>
                                <span className="font-bold text-slate-900">Pro Plan</span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">2026</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                            <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                        </div>
                        <div className="mt-8 text-2xl font-bold text-slate-900">
                            ILLIMITÉ
                        </div>
                    </div>
                </div>
            </div>
            */}
            {/* Greeting Section */}
            <div className="py-2">
                <h1 className="text-3xl font-serif text-slate-900 flex items-center gap-2">
                    {getGreeting()} {user?.name?.split(' ')[0]} ! ⛅
                </h1>
                <p className="text-slate-500 mt-2 flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    Que diriez-vous d'une nouvelle promotion ?
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 justify-start">
                {/* Livraisons Card */}
                <div className="bg-[#2E7D32] rounded-3xl p-4 sm:p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden sm:min-w-[300px]">
                    <div>
                        <div className="text-white/80 font-medium text-xs sm:text-sm tracking-wide uppercase mb-1">Livraisons</div>
                        <div className="text-3xl sm:text-4xl font-bold font-serif flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                            {galleries.length} <span className="text-xs sm:text-lg font-normal font-sans text-white/80 uppercase">Total</span>
                        </div>
                    </div>
                    
                    {/* Avatars / Thumbnails */}
                    <div className="flex -space-x-3 sm:-space-x-4 mt-4 sm:mt-6 mb-6 sm:mb-8">
                        {galleries.slice(0, 4).map((g, i) => (
                            <GalleryThumbnail key={i} url={g.images && g.images.length > 0 ? g.images[0].url : ''} />
                        ))}
                    </div>

                    <Button 
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full w-full justify-center transition-colors border-none text-xs sm:text-sm px-2"
                        onClick={() => {
                            if (checkLimit('galleries', galleries.length)) {
                                setUpgradeFeature('galleries');
                                setUpgradeDialogOpen(true);
                            } else {
                                navigate('/admin/new-delivery');
                            }
                        }}
                    >
                        <span className="hidden sm:inline">+ Nouvelle Livraison</span>
                        <span className="sm:hidden">+ Nouveau</span>
                    </Button>
                </div>

                {/* Factures Card */}
                <div className="bg-[#2E7D32] rounded-3xl p-4 sm:p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden sm:min-w-[300px]">
                    <div>
                        <div className="text-white/80 font-medium text-xs sm:text-sm tracking-wide uppercase mb-1">Factures</div>
                        <div className="text-2xl sm:text-4xl font-bold font-serif flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                            {totalRevenue.toLocaleString('fr-FR')} <span className="text-[10px] sm:text-lg font-normal font-sans text-white/80 uppercase">FCFA Revenu</span>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 space-y-1">
                        {recentInvoices.map((inv, i) => (
                            <div key={i} className="text-white/90 text-xs sm:text-sm font-medium line-clamp-1">
                                {inv.invoice_number}
                            </div>
                        ))}
                        {recentInvoices.length === 0 && (
                            <div className="text-white/70 text-xs sm:text-sm italic py-2">Aucune facture</div>
                        )}
                    </div>

                    <Button 
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full w-full justify-center transition-colors border-none text-xs sm:text-sm px-2"
                        onClick={() => navigate('/admin/invoices/new')}
                    >
                        <span className="hidden sm:inline">+ Créer une facture</span>
                        <span className="sm:hidden">+ Créer</span>
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mt-8">
                <button 
                    className={`flex-1 py-4 text-center font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'livraisons' ? 'text-green-700' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setActiveTab('livraisons')}
                >
                    Livraisons
                    {activeTab === 'livraisons' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-700 rounded-t-full"></div>
                    )}
                </button>
                <button 
                    className={`flex-1 py-4 text-center font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'factures' ? 'text-green-700' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setActiveTab('factures')}
                >
                    Factures
                    {activeTab === 'factures' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-700 rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Lists */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4">
                {activeTab === 'livraisons' ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="font-semibold text-slate-600">Client / Titre</TableHead>
                                <TableHead className="font-semibold text-slate-600 hidden sm:table-cell">Date</TableHead>
                                <TableHead className="font-semibold text-slate-600 hidden sm:table-cell">Photos</TableHead>
                                <TableHead className="font-semibold text-slate-600 hidden md:table-cell">Statut</TableHead>
                                <TableHead className="font-semibold text-slate-600 hidden md:table-cell">Likes</TableHead>
                                <TableHead className="font-semibold text-slate-600 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                                        Chargement...
                                    </TableCell>
                                </TableRow>
                            ) : galleries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                                        Aucune livraison trouvée.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                galleries.map((gallery) => (
                                    <TableRow key={gallery.uuid} className="group hover:bg-slate-50 cursor-pointer" onClick={() => handleView(gallery.uuid)}>
                                        <TableCell className="font-medium text-slate-900">
                                            {gallery.title}
                                            <div className="sm:hidden text-xs text-slate-500 mt-1">
                                                {new Date(gallery.createdAt).toLocaleDateString('fr-FR')} • {gallery.images.length} photos
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 hidden sm:table-cell">
                                            {new Date(gallery.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium rounded-full px-3">
                                                {gallery.images.length} photos
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-none font-medium rounded-full px-3">
                                                Livré
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                                                <span className="font-medium text-slate-700">
                                                    {gallery.images.filter(img => img.isLiked).length}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={(e) => { e.stopPropagation(); handleView(gallery.uuid); }}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); handleShare(gallery.uuid); }}>
                                                    <Share2 className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(gallery.uuid); }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="font-semibold text-slate-600">Client / N°</TableHead>
                                <TableHead className="font-semibold text-slate-600 hidden sm:table-cell">Date</TableHead>
                                <TableHead className="font-semibold text-slate-600">Montant</TableHead>
                                <TableHead className="font-semibold text-slate-600 text-right">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-32 text-slate-500">
                                        Chargement...
                                    </TableCell>
                                </TableRow>
                            ) : invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-32 text-slate-500">
                                        Aucune facture trouvée.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id} className="group cursor-pointer hover:bg-slate-50" onClick={() => navigate('/admin/billing')}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 line-clamp-1">{invoice.client_name}</span>
                                                <span className="text-xs text-slate-500">{invoice.invoice_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 hidden sm:table-cell">
                                            {new Date(invoice.issue_date).toLocaleDateString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-700 whitespace-nowrap">
                                            {Number(invoice.total_amount).toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge 
                                                className={`shadow-none font-medium rounded-full px-2 sm:px-3 border ${
                                                    invoice.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                                                    invoice.status === 'partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' :
                                                    'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                }`}
                                            >
                                                {invoice.status === 'paid' ? 'Payée' : invoice.status === 'partial' ? 'Partielle' : 'Impayée'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 mt-8">
                {/* Youtube Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Youtube className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Rejoignez-nous sur Youtube</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Découvrez des vidéos pratiques pour apprendre à utiliser VANDA STUDIO</p>
                    </div>
                    <Button 
                        className="bg-black text-white hover:bg-slate-800 rounded-full px-8"
                        onClick={() => window.open('https://youtube.com/@wscale2026?si=RUc9Khgr9eWy0SXq', '_blank')}
                    >
                        Accéder maintenant
                    </Button>
                </div>

                {/* Hub Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Rejoignez notre Hub</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Rejoignez la communauté d'entraide des créateurs VANDA STUDIO</p>
                    </div>
                    <Button 
                        className="bg-[#4caf50] text-white hover:bg-[#45a049] rounded-full px-8 font-medium"
                        onClick={() => window.open('https://chat.whatsapp.com/HgkhHmTrhkq0efVrmhgOb6', '_blank')}
                    >
                        Rejoindre maintenant
                    </Button>
                </div>

                {/* Suggestions */}
                <a 
                    href="https://wa.me/237686265447" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Partagez vos suggestions</h4>
                        <p className="text-slate-500 text-xs">Vos suggestions nous aident à améliorer VANDA STUDIO</p>
                    </div>
                </a>

                {/* WhatsApp */}
                <a 
                    href="https://whatsapp.com/channel/0029Vb8UoyiK5cDK8xak292B" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Rejoignez-nous sur WhatsApp</h4>
                        <p className="text-slate-500 text-xs">Rejoignez notre canal WhatsApp</p>
                    </div>
                </a>
            </div>

            <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                uuid={shareUuid}
                photographerSlug={shareSlug}
                clientPhone={sharePhone}
            />

            {/* Upgrade Dialog */}
            <UpgradeDialog
                open={upgradeDialogOpen}
                onClose={() => setUpgradeDialogOpen(false)}
                feature={upgradeFeature}
                currentPlan={currentPlan}
            />
        </div>
    );
};

export default AdminDashboard;
