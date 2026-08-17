import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Users, Image, CreditCard, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import TiltCard from '@/components/Common/TiltCard';

interface DashboardStats {
    metrics: {
        total_photographers: number;
        total_galleries: number;
        active_subscriptions: number;
        monthly_revenue: number;
    };
    growth_data: Array<{
        name: string;
        photographes: number;
        ca: number;
    }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-4 rounded-xl border border-white/20 shadow-xl">
                <p className="font-bold mb-2 text-slate-800">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.name} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                        <span className="text-sm font-semibold text-slate-600 capitalize">{p.name}:</span>
                        <span className="text-sm font-bold text-slate-900">
                            {p.value} {p.name.includes("Chiffre") ? "Fcfa" : ""}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const SuperAdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/superadmin/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Chargement des analytiques...</p>
            </div>
        );
    }

    const cards = [
        { title: 'Total Photographes', value: stats.metrics.total_photographers, icon: Users, color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.1)', sub: 'Inscrits sur la plateforme' },
        { title: 'Abonnements Actifs', value: stats.metrics.active_subscriptions, icon: CreditCard, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', sub: 'Forfaits SaaS en cours' },
        { title: 'CA Mensuel (SaaS)', value: `${stats.metrics.monthly_revenue} Fcfa`, icon: TrendingUp, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', sub: 'Revenus récurrents' },
        { title: 'Galeries Créées', value: stats.metrics.total_galleries, icon: Image, color: '#84cc16', bg: 'rgba(132, 204, 22, 0.1)', sub: 'Hébergées sur nos serveurs' },
    ];

    return (
        <div className="pb-10">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">Tableau de Bord Pro</h1>
                    <p className="text-slate-500 font-medium">Suivi macroscopique et analytique de VANDA Studio</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-green-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-200">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold">Données en direct</span>
                </motion.div>
            </div>

            {/* Grille de KPIs avec TiltCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {cards.map((card, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: idx * 0.1 }}
                        className="h-full"
                    >
                        <TiltCard scaleOnHover={1.03} sx={{
                            p: 3,
                            borderRadius: '20px',
                            bgcolor: 'white',
                            border: `1px solid ${card.color}30`,
                            boxShadow: `0 8px 24px ${card.color}15`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Icône en arrière-plan géante */}
                            <div className="absolute -top-6 -right-6 opacity-[0.04] pointer-events-none transform scale-[2.5]" style={{ color: card.color }}>
                                <card.icon size={100} />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
                                    <card.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</h3>
                            </div>
                            
                            <p className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{card.value}</p>
                            
                            <div className="flex items-center gap-1.5 mt-2" style={{ color: card.color }}>
                                <TrendingUp size={14} />
                                <span className="text-xs font-bold">{card.sub}</span>
                            </div>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>

            {/* Graphique avec filtres SVG et AreaChart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors duration-300"
                style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.03)' }}
            >
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Croissance du Réseau</h2>
                    <p className="text-sm text-slate-500 font-medium">Évolution des inscriptions et des revenus (7 derniers jours)</p>
                </div>
                
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.growth_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPhoto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <filter id="shadowGlow" height="200%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.2"/>
                                </filter>
                            </defs>
                            
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 12 }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 12 }} dx={-10} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 12 }} dx={10} />
                            
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            
                            <Area 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey="photographes" 
                                stroke="#4f46e5" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorPhoto)" 
                                name="Photographes"
                                style={{ filter: 'url(#shadowGlow)' }} 
                            />
                            <Area 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey="ca" 
                                stroke="#6366f1" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorCA)" 
                                name="Chiffre d'Affaires" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Section Dernières Transactions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 }}
                className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Dernières Transactions</h2>
                        <p className="text-sm text-slate-500 font-medium">Aperçu des paiements récents</p>
                    </div>
                    <a href="/superadmin/transactions" className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-full transition-colors">
                        Voir tout
                    </a>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold rounded-tl-xl">Date</th>
                                <th className="p-4 font-bold">Client</th>
                                <th className="p-4 font-bold">Forfait</th>
                                <th className="p-4 font-bold">Statut Paiement</th>
                                <th className="p-4 font-bold rounded-tr-xl">Cart ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* We will fetch and display recent transactions here using a separate state */}
                            <RecentTransactionsTable />
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

// Component for recent transactions
const RecentTransactionsTable = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const response = await api.get('/superadmin/dashboard/transactions?limit=5');
                setTransactions(response.data);
            } catch (error) {
                console.error("Failed to fetch recent transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Payé</span>;
            case 'waiting_payment': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">En attente</span>;
            default: return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Échoué</span>;
        }
    };

    if (loading) {
        return <tr><td colSpan={5} className="p-4 text-center text-slate-500 text-sm">Chargement...</td></tr>;
    }

    if (transactions.length === 0) {
        return <tr><td colSpan={5} className="p-4 text-center text-slate-500 text-sm">Aucune transaction récente</td></tr>;
    }

    return (
        <>
            {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-700 font-medium">
                        {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm">{tx.user?.name || 'Inconnu'}</div>
                        <div className="text-xs text-slate-500">{tx.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                        {tx.plan?.name || '-'}
                    </td>
                    <td className="p-4">
                        {getStatusBadge(tx.payment_status)}
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-400">
                        {tx.maketou_cart_id ? tx.maketou_cart_id.split('-')[0] + '...' : '-'}
                    </td>
                </tr>
            ))}
        </>
    );
};

export default SuperAdminDashboard;
