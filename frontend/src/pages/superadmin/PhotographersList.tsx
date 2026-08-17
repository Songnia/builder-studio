import React, { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, CheckCircle2, XCircle, Calendar, Eye, Trash2, AlertTriangle, Shield, UserPlus, Key, Lock, Mail, Phone, X, Edit, MessageCircle, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    active_plan: string | null;
    phone?: string;
    avatar?: string;
    role?: string;
    is_published?: boolean;
    site_config_id?: number | null;
}

const PhotographersList: React.FC = () => {
    const [photographers, setPhotographers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Tabs & Admin Modal
    const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users');
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [editAdminId, setEditAdminId] = useState<number | null>(null);
    const [adminForm, setAdminForm] = useState({ name: '', email: '', phone: '', password: '', role: 'admin' });
    const [adminFormLoading, setAdminFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fetchPhotographers = async () => {
        try {
            const response = await api.get('/superadmin/users');
            setPhotographers(response.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotographers();
    }, []);

    const toggleStatus = async (id: number) => {
        try {
            const response = await api.patch(`/superadmin/users/${id}/toggle-active`);
            setPhotographers(prev => prev.map(p => 
                p.id === id ? { ...p, is_active: response.data.is_active } : p
            ));
            toast.success("Statut mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const togglePublish = async (id: number) => {
        try {
            const response = await api.patch(`/superadmin/users/${id}/toggle-publish`);
            setPhotographers(prev => prev.map(p => 
                p.id === id ? { ...p, is_published: response.data.is_published } : p
            ));
            toast.success(response.data.is_published ? "Site publié avec succès" : "Site dépublié avec succès");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erreur lors de la modification du statut du site");
        }
    };

    const executeDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await api.delete(`/superadmin/users/${deleteTarget.id}`);
            setPhotographers(prev => prev.filter(p => p.id !== deleteTarget.id));
            toast.success("Utilisateur supprimé avec succès");
            setDeleteTarget(null);
            setDeleteConfirmText('');
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return photographers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const isAdmin = user.role === 'admin' || user.role === 'superadmin';
            
            if (activeTab === 'admins') return isAdmin && matchesSearch;
            return !isAdmin && matchesSearch;
        });
    }, [photographers, searchQuery, activeTab]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-slate-500 dark:text-zinc-400 font-medium animate-pulse">Chargement des utilisateurs...</p>
            </div>
        );
    }

    return (
        <div className="pb-10 max-w-7xl mx-auto space-y-8">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                        {activeTab === 'users' ? 'Utilisateurs' : 'Administrateurs'}
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">
                        {activeTab === 'users' ? 'Gérez tous les acteurs de la plateforme' : 'Gérez les accès au panel d\'administration'}
                    </p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
                >
                    <div className="flex bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-xl w-full sm:w-auto">
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-white dark:bg-zinc-700 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
                        >
                            Utilisateurs
                        </button>
                        <button 
                            onClick={() => setActiveTab('admins')}
                            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'admins' ? 'bg-white dark:bg-zinc-700 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
                        >
                            Administrateurs
                        </button>
                    </div>

                    {activeTab === 'admins' && (
                        <Button 
                            onClick={() => {
                                setAdminForm({ name: '', email: '', phone: '', password: '', role: 'admin' });
                                setEditAdminId(null);
                                setAdminModalOpen(true);
                            }}
                            className="w-full sm:w-auto h-10 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 font-bold gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Nouvel Admin
                        </Button>
                    )}

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            type="text" 
                            placeholder="Rechercher..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 focus-visible:ring-green-500 rounded-xl w-full"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Table Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-zinc-800/60 overflow-hidden transition-all duration-300"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-5 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Utilisateur</th>
                                {activeTab === 'users' ? (
                                    <th className="px-6 py-5 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Abonnement</th>
                                ) : (
                                    <th className="px-6 py-5 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Rôle</th>
                                )}
                                <th className="px-6 py-5 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Date d'inscription</th>
                                <th className="px-6 py-5 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Statut</th>
                                <th className="px-6 py-5 text-right text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            <AnimatePresence>
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr 
                                        key={user.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-green-50/30 dark:hover:bg-zinc-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-10 h-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 dark:text-zinc-100">{user.name}</p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {activeTab === 'users' ? (
                                                user.active_plan ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 shadow-sm">
                                                        {user.active_plan}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-zinc-500 italic font-medium text-xs">Aucun forfait</span>
                                                )
                                            ) : (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${user.role === 'superadmin' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                                                    <Shield className="w-3.5 h-3.5 mr-1" />
                                                    {user.role === 'superadmin' ? 'Super Admin' : 'Administrateur'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-zinc-400 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
                                                user.is_active 
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50' 
                                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50'
                                            }`}>
                                                {user.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                {user.is_active ? 'Actif' : 'Désactivé'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-slate-200 dark:border-zinc-800">
                                                    {activeTab === 'users' ? (
                                                        <>
                                                            <DropdownMenuItem 
                                                                onClick={() => toast.info("Aperçu du profil (bientôt disponible)")}
                                                                className="gap-2 cursor-pointer font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-800/50"
                                                            >
                                                                <Eye className="h-4 w-4 text-green-500" />
                                                                <span>Voir le profil</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => toast.info("Modification du candidat (bientôt disponible)")}
                                                                className="gap-2 cursor-pointer font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-800/50"
                                                            >
                                                                <Edit className="h-4 w-4 text-amber-500" />
                                                                <span>Modifier</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => {
                                                                    if (user.email) {
                                                                        window.location.href = `mailto:${user.email}`;
                                                                    } else {
                                                                        toast.error("Cet utilisateur n'a pas d'adresse email");
                                                                    }
                                                                }}
                                                                className="gap-2 cursor-pointer font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-800/50"
                                                            >
                                                                <MessageCircle className="h-4 w-4 text-green-500" />
                                                                <span>Contacter</span>
                                                            </DropdownMenuItem>
                                                            {user.site_config_id && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => togglePublish(user.id)}
                                                                    className="gap-2 cursor-pointer font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-800/50"
                                                                >
                                                                    <Globe className={`h-4 w-4 ${user.is_published ? 'text-amber-500' : 'text-green-500'}`} />
                                                                    <span>{user.is_published ? 'Dépublier le site' : 'Publier le site'}</span>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <DropdownMenuItem 
                                                            onClick={() => {
                                                                setAdminForm({ name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role || 'admin' });
                                                                setEditAdminId(user.id);
                                                                setAdminModalOpen(true);
                                                            }}
                                                            className="gap-2 cursor-pointer font-medium text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-800/50"
                                                        >
                                                            <Shield className="h-4 w-4 text-amber-500" />
                                                            <span>Modifier l'accès</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                                    <DropdownMenuItem 
                                                        onClick={() => toggleStatus(user.id)}
                                                        className={`gap-2 cursor-pointer font-medium ${user.is_active ? 'text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/20' : 'text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-900/20'}`}
                                                    >
                                                        {user.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                        <span>{user.is_active ? 'Désactiver' : 'Activer'}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setDeleteTarget(user);
                                                            setDeleteConfirmText('');
                                                        }}
                                                        className="gap-2 cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Supprimer</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500">
                                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                                {activeTab === 'admins' ? <Shield className="w-8 h-8 opacity-50" /> : <Search className="w-8 h-8 opacity-50" />}
                                            </div>
                                            <p className="font-extrabold text-lg text-slate-600 dark:text-zinc-300 mb-1">
                                                {activeTab === 'admins' ? 'Aucun administrateur trouvé' : 'Aucun utilisateur trouvé'}
                                            </p>
                                            <p className="text-sm font-medium">Modifiez votre recherche ou ajoutez un nouveau compte.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Admin Modal (Create/Edit) */}
            <AnimatePresence>
                {adminModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                            onClick={() => !adminFormLoading && setAdminModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.15)] border border-slate-200 dark:border-zinc-800 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                            {editAdminId ? "Modifier l'Administrateur" : "Nouvel Administrateur"}
                                        </h2>
                                        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                                            Gérez les accès sécurisés au back-office
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setAdminModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Nom complet</label>
                                        <div className="relative">
                                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                value={adminForm.name} 
                                                onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                                                placeholder="Ex: Jean Dupont" 
                                                className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                type="email"
                                                value={adminForm.email} 
                                                onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                                                placeholder="admin@vanda.com" 
                                                className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Téléphone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                value={adminForm.phone} 
                                                onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                                                placeholder="+33 6 00 00 00 00" 
                                                className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Rôle d'accès</label>
                                        <select 
                                            value={adminForm.role}
                                            onChange={(e) => setAdminForm({...adminForm, role: e.target.value})}
                                            className="w-full flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white"
                                        >
                                            <option value="admin">Administrateur (Accès standard)</option>
                                            <option value="superadmin">Super Admin (Tous les droits)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                                            {editAdminId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe temporaire'}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                type={showPassword ? "text" : "password"}
                                                value={adminForm.password} 
                                                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                                                placeholder="Min. 8 caractères" 
                                                className="pl-9 pr-10 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700" 
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 focus:outline-none transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30 flex gap-3 mt-4">
                                    <Key className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800 dark:text-amber-500">Accès administrateur</p>
                                        <p className="text-xs font-medium text-amber-700/80 dark:text-amber-500/80 mt-1 leading-relaxed">
                                            Cet utilisateur aura accès au panneau de configuration. Assurez-vous de faire confiance à cette personne avant de lui accorder des droits.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setAdminModalOpen(false)}
                                    disabled={adminFormLoading}
                                    className="rounded-xl font-bold border-slate-200 dark:border-zinc-700 h-11 px-6 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    onClick={async () => {
                                        setAdminFormLoading(true);
                                        try {
                                            if (editAdminId) {
                                                await api.patch(`/superadmin/users/${editAdminId}`, adminForm);
                                                toast.success("Administrateur mis à jour avec succès");
                                            } else {
                                                await api.post(`/superadmin/users`, { ...adminForm, is_admin: true });
                                                toast.success("Administrateur créé avec succès");
                                            }
                                            setAdminModalOpen(false);
                                            fetchPhotographers();
                                        } catch(e) {
                                            toast.error("Erreur d'enregistrement de l'administrateur");
                                        } finally {
                                            setAdminFormLoading(false);
                                        }
                                    }}
                                    disabled={adminFormLoading || !adminForm.name || !adminForm.email || (!editAdminId && !adminForm.password)}
                                    className="rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 h-11 px-6"
                                >
                                    {adminFormLoading ? 'Enregistrement...' : (editAdminId ? 'Enregistrer les modifications' : 'Créer l\'administrateur')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Modal (Vercel Style) */}
            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                            onClick={() => !isDeleting && setDeleteTarget(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.15)] border border-slate-200 dark:border-zinc-800 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-red-600 mb-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        Supprimer l'utilisateur
                                    </h2>
                                </div>
                                
                                <p className="text-slate-600 dark:text-zinc-400 mb-4 text-sm leading-relaxed">
                                    Cette action est <strong className="text-slate-900 dark:text-white">irréversible</strong>. L'utilisateur <strong className="text-slate-900 dark:text-white">{deleteTarget.name}</strong> et toutes ses données associées seront supprimés définitivement.
                                </p>
                                
                                <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-zinc-800/50 dark:border-zinc-800/80">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                        Pour confirmer, tapez 
                                        <span className="mx-1 font-mono text-red-600 bg-red-50 dark:bg-red-900/40 px-1.5 py-0.5 rounded font-bold">
                                            {deleteTarget.name}
                                        </span> 
                                        ci-dessous :
                                    </label>
                                    <Input
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        className="font-mono text-sm border-slate-300 dark:border-zinc-700 focus-visible:ring-red-500 rounded-lg mt-2"
                                        placeholder={deleteTarget.name}
                                    />
                                </div>
                                
                                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteTarget(null)}
                                        disabled={isDeleting}
                                        className="rounded-xl font-bold border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 h-11 px-6"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={executeDelete}
                                        disabled={isDeleting || deleteConfirmText !== deleteTarget.name}
                                        className="rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 h-11 px-6"
                                    >
                                        {isDeleting ? "Suppression..." : "Supprimer"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotographersList;
