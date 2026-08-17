import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Save, Settings, ShieldCheck, Globe, UploadCloud, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlobalSettings {
    site_name: string;
    contact_email: string;
    maintenance_mode: boolean;
    allow_registrations: boolean;
    require_email_verification: boolean;
    notify_admins_on_registration: boolean;
    seo_title: string;
    seo_description: string;
    logo: string | null;
}

const SuperAdminSettings: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [settings, setSettings] = useState<GlobalSettings>({
        site_name: '',
        contact_email: '',
        maintenance_mode: false,
        allow_registrations: true,
        require_email_verification: false,
        notify_admins_on_registration: true,
        seo_title: '',
        seo_description: '',
        logo: null
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/superadmin/settings');
                setSettings(response.data);
                setLogoPreview(response.data.logo || null);
            } catch (error) {
                toast.error("Erreur lors de la récupération des paramètres");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setDirty(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            setDirty(true);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview(settings.logo);
        setLogoFile(null);
        setDirty(true);
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('site_name', settings.site_name);
            formData.append('contact_email', settings.contact_email);
            formData.append('maintenance_mode', String(settings.maintenance_mode));
            formData.append('allow_registrations', String(settings.allow_registrations));
            formData.append('require_email_verification', String(settings.require_email_verification));
            formData.append('notify_admins_on_registration', String(settings.notify_admins_on_registration));
            formData.append('seo_title', settings.seo_title);
            formData.append('seo_description', settings.seo_description);

            // POST /superadmin/settings is used in SettingController update, but wait it says update is usually POST with _method=PUT or just POST? 
            // In routes/api.php, the route is likely POST /superadmin/settings
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const res = await api.post('/superadmin/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const newLogoUrl = res.data.logo || settings.logo;
            setSettings(prev => ({ ...prev, logo: newLogoUrl }));
            setLogoPreview(newLogoUrl);
            
            toast.success("Configuration sauvegardée avec succès");
            setDirty(false);
            setLogoFile(null);
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Chargement de la configuration...</p>
            </div>
        );
    }

    return (
        <div className="pb-24 max-w-5xl mx-auto space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Configuration Globale</h1>
                    <p className="text-slate-500 font-medium">Gérez l'identité visuelle et les paramètres de Vanda Studio</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex items-center gap-3 z-50 sticky top-4 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm"
                >
                    {dirty && (
                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                            Non sauvegardé
                        </span>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !dirty}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            saving || !dirty 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:scale-95'
                        }`}
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </motion.div>
            </div>

            {/* Section Identité & Contact */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors duration-300"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                        <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Identité Visuelle & Contact</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Upload Logo */}
                    <div className="col-span-1">
                        <div 
                            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 h-full min-h-[200px] bg-slate-50/50 hover:bg-green-50/50 hover:border-green-400 transition-all group"
                        >
                            {logoPreview ? (
                                <div className="relative w-full h-full flex justify-center items-center">
                                    <img src={logoPreview} alt="Logo" className="max-h-32 object-contain" />
                                    <button 
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-3 -right-3 bg-white text-red-500 hover:text-white hover:bg-red-500 rounded-full p-1.5 shadow-md border border-slate-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                                    <p className="text-sm font-medium text-slate-500 mb-4">Aucun logo configuré</p>
                                </div>
                            )}
                            
                            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()} 
                                className={`mt-auto text-sm font-bold border rounded-xl px-4 py-2 transition-colors ${
                                    logoPreview ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-white text-green-600 border-green-200 hover:bg-green-50 shadow-sm'
                                }`}
                            >
                                {logoPreview ? 'Changer de Logo' : 'Uploader un Logo'}
                            </button>
                        </div>
                    </div>

                    <div className="col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Nom de la Plateforme</label>
                            <input
                                type="text" name="site_name" value={settings.site_name} onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email de Contact Support</label>
                            <input
                                type="email" name="contact_email" value={settings.contact_email} onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Section Sécurité & Accès */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors duration-300"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Paramètres Système & Accès</h2>
                </div>

                <div className="space-y-2">
                    {/* Mode Maintenance */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                        settings.maintenance_mode ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                        <div className="flex items-start gap-4">
                            <AlertTriangle className={`w-6 h-6 mt-0.5 ${settings.maintenance_mode ? 'text-red-500' : 'text-slate-400'}`} />
                            <div>
                                <h3 className={`font-bold ${settings.maintenance_mode ? 'text-red-700' : 'text-slate-700'}`}>Mode Maintenance</h3>
                                <p className="text-sm text-slate-500">Désactive l'accès public — seuls les administrateurs peuvent se connecter.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                        </label>
                    </div>

                    <div className="h-px bg-slate-100 my-4"></div>

                    {/* Autoriser Inscriptions */}
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                            <h3 className="font-bold text-slate-700">Ouverture des Inscriptions</h3>
                            <p className="text-sm text-slate-500">Permet aux nouveaux photographes de créer un compte librement.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" name="allow_registrations" checked={settings.allow_registrations} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                        </label>
                    </div>

                    <div className="h-px bg-slate-100 my-2"></div>

                    {/* Vérification Email */}
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                            <h3 className="font-bold text-slate-700">Vérification Email Obligatoire</h3>
                            <p className="text-sm text-slate-500">Exige que l'utilisateur valide son adresse email pour activer son compte.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" name="require_email_verification" checked={settings.require_email_verification} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                        </label>
                    </div>

                    <div className="h-px bg-slate-100 my-2"></div>

                    {/* Notifier Admins */}
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div>
                            <h3 className="font-bold text-slate-700">Notifier les Administrateurs</h3>
                            <p className="text-sm text-slate-500">Envoie un email de notification lors de l'inscription d'un nouveau photographe.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" name="notify_admins_on_registration" checked={settings.notify_admins_on_registration} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                        </label>
                    </div>
                </div>
            </motion.div>

            {/* Section SEO */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors duration-300"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Référencement Naturel (SEO)</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Balise Title Globale</label>
                        <input
                            type="text" name="seo_title" value={settings.seo_title} onChange={handleChange}
                            placeholder="ex: Vanda Studio - La plateforme pour photographes"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors"
                        />
                        <p className="text-xs font-medium text-slate-400 ml-1">Titre principal affiché dans les onglets du navigateur et les résultats Google.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Meta Description Globale</label>
                        <textarea
                            name="seo_description" value={settings.seo_description} onChange={handleChange}
                            rows={3}
                            placeholder="Créez votre site vitrine en quelques clics..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                        />
                        <p className="text-xs font-medium text-slate-400 ml-1">
                            {settings.seo_description?.length || 0}/160 caractères recommandés pour un bon référencement.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SuperAdminSettings;
