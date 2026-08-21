import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
    id: number;
    name: string;
    price: string;
    yearly_price: string | null;
    features: string[];
    is_active: boolean;
    maketou_product_id: string | null;
    maketou_yearly_product_id: string | null;
}

const SubscriptionPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        yearly_price: '',
        features: '',
        maketou_product_id: '',
        maketou_yearly_product_id: '',
        is_active: true
    });

    const fetchPlans = async () => {
        try {
            const response = await api.get('/superadmin/plans');
            setPlans(response.data);
        } catch {
            toast.error("Erreur lors de la récupération des forfaits");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                price: plan.price,
                yearly_price: plan.yearly_price || '',
                features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
                maketou_product_id: plan.maketou_product_id || '',
                maketou_yearly_product_id: plan.maketou_yearly_product_id || '',
                is_active: plan.is_active
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                price: '',
                yearly_price: '',
                features: '',
                maketou_product_id: '',
                maketou_yearly_product_id: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                features: formData.features.split('\n').filter(f => f.trim() !== '')
            };

            if (editingPlan) {
                await api.put(`/superadmin/plans/${editingPlan.id}`, payload);
                toast.success("Forfait mis à jour");
            } else {
                await api.post('/superadmin/plans', payload);
                toast.success("Forfait créé avec succès");
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch {
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const deletePlan = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce forfait ?")) return;
        try {
            await api.delete(`/superadmin/plans/${id}`);
            setPlans(prev => prev.filter(p => p.id !== id));
            toast.success("Forfait supprimé");
        } catch {
            toast.error("Erreur lors de la suppression");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Chargement des forfaits...</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Forfaits SaaS</h1>
                    <p className="text-slate-500 font-medium">Gérez les offres d'abonnement proposées aux créatifs</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Créer un forfait
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                    <motion.div 
                        key={plan.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 flex flex-col relative overflow-hidden hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group card-static"
                    >
                        {/* Effet lumineux de fond */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px]" />
                        
                        <div className="absolute top-4 right-4 flex gap-2 z-10 flex-col items-end">
                            {plan.maketou_product_id && plan.maketou_yearly_product_id ? (
                                <div className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                                    ✓ Maketou OK
                                </div>
                            ) : (
                                <div className="bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Manque ID Maketou
                                </div>
                            )}
                            {!plan.is_active && (
                                <div className="bg-slate-100/80 backdrop-blur-sm border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                                    Inactif
                                </div>
                            )}
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline text-slate-900 mb-2">
                                <span className="text-5xl font-black tracking-tighter">{plan.price} F</span>
                                <span className="ml-1.5 text-lg font-bold text-slate-400">/mois</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                                {plan.yearly_price ?? '—'} F / an
                            </p>
                            <div className="h-px w-full bg-gradient-to-r from-slate-200 to-transparent my-6" />
                            
                            <ul className="space-y-4 flex-1 mb-8">
                                {plan.features && plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-600 text-sm font-medium items-start">
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                                        <span className="leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto relative z-10 flex items-center justify-between gap-3 pt-4 border-t border-slate-100/80">
                            <button 
                                onClick={() => handleOpenModal(plan)}
                                className="flex-1 text-sm font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
                            >
                                <Edit className="w-4 h-4" />
                                Éditer
                            </button>
                            <button 
                                onClick={() => deletePlan(plan.id)}
                                className="text-sm font-bold bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center border border-slate-200 hover:border-red-200"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {plans.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-[32px] border border-slate-200 border-dashed p-16 text-center shadow-sm"
                >
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <Plus className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun forfait configuré</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">Créez votre première offre d'abonnement pour permettre aux créatifs de s'inscrire et d'utiliser la plateforme.</p>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all active:scale-95 inline-flex items-center gap-2"
                    >
                        Créer le premier forfait
                    </button>
                </motion.div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingPlan ? "Modifier le forfait" : "Créer un forfait"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nom du forfait</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Prix mensuel (F CFA)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Prix annuel (F CFA)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.yearly_price}
                                    onChange={(e) => setFormData({...formData, yearly_price: e.target.value})}
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Identifiant produit Maketou mensuel <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-slate-500 mb-2">
                                    L'identifiant public Maketou (UUID). <br/>
                                    <em>Ex: 550e8400-e29b-41d4-a716-446655440000</em>
                                </p>
                                <input 
                                    type="text" 
                                    value={formData.maketou_product_id}
                                    onChange={(e) => setFormData({...formData, maketou_product_id: e.target.value})}
                                    placeholder="UUID public Maketou..."
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Identifiant produit Maketou annuel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.maketou_yearly_product_id}
                                    onChange={(e) => setFormData({...formData, maketou_yearly_product_id: e.target.value})}
                                    placeholder="UUID public Maketou annuel..."
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Fonctionnalités (une par ligne)</label>
                                <textarea 
                                    rows={4}
                                    value={formData.features}
                                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                    placeholder="50 Go de stockage&#10;Galeries illimitées..."
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    id="isActive"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Forfait actif</label>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlans;
