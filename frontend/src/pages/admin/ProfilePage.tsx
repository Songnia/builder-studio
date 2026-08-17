import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Shield, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/services/api';
import { authService } from '@/services/authService';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || '',
                email: currentUser.email || ''
            }));
        }
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await api.patch('/user/profile', payload);
            
            // Mettre à jour le localStorage avec le user retourné via authService
            const updatedUser = authService.updateCurrentUser(response.data.user);
            setUser(updatedUser);

            if (formData.password) {
                toast.success('Profil et mot de passe mis à jour avec succès');
            } else {
                toast.success('Profil mis à jour avec succès');
            }
            
            setFormData(prev => ({ ...prev, password: '' })); // Reset password field
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour:', error);
            const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const displayName = formData.name || user?.name || 'Admin';
    const roleLabel = user?.role === 'superadmin' ? 'Super Admin' : 'Administrateur';
    const roleColor = user?.role === 'superadmin' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Mon Profil
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 mt-2">
                    Gérez vos informations personnelles et paramètres de sécurité
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne de gauche : Avatar et résumé */}
                <div className="lg:col-span-1">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center"
                    >
                        <div className="relative mb-4">
                            <Avatar className="w-32 h-32 border-4 border-white dark:border-zinc-800 shadow-lg">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-extrabold text-4xl">
                                    {displayName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            {displayName}
                        </h2>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">
                            {formData.email || user?.email}
                        </p>
                        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${roleColor}`}>
                            {roleLabel}
                        </div>
                    </motion.div>
                </div>

                {/* Colonne de droite : Formulaire */}
                <div className="lg:col-span-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden"
                    >
                        <div className="p-6 md:p-8 space-y-8">
                            
                            {/* Section Informations Personnelles */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Informations Personnelles
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Nom complet</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Adresse Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="pl-9 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100 dark:border-zinc-800" />

                            {/* Section Sécurité */}
                            <section>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Sécurité
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 pl-11">
                                    Saisissez un nouveau mot de passe pour le modifier, ou laissez vide pour le conserver.
                                </p>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Nouveau Mot de passe (optionnel)</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input 
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            placeholder="Laissez vide pour ne pas changer"
                                            className="pl-9 pr-10 h-11 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
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
                            </section>

                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 bg-slate-50/50 dark:bg-zinc-900/80 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="h-11 px-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-md shadow-green-500/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Sauvegarder les modifications
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
