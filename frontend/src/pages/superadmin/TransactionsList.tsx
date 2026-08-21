import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
    id: number;
    user_id: number;
    subscription_plan_id: number;
    billing_cycle: 'monthly' | 'yearly';
    status: string;
    payment_status: string;
    maketou_cart_id: string;
    starts_at: string;
    ends_at: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
    plan?: {
        name: string;
        price: number;
        yearly_price: number | null;
    };
}

export default function TransactionsList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/superadmin/dashboard/transactions?limit=100');
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Payé</span>;
            case 'waiting_payment':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">En attente</span>;
            case 'payment_failed':
            case 'abandoned':
                return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Échoué</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{status}</span>;
        }
    };

    const getSubStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Actif</span>;
            case 'canceled':
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">Annulé/Inactif</span>;
            case 'expired':
                return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">Expiré</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/superadmin/dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Toutes les Transactions</h1>
                    <p className="text-gray-500 mt-1">Historique détaillé des paiements et abonnements</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Client</th>
                                <th className="p-4 font-semibold">Forfait</th>
                                <th className="p-4 font-semibold">Paiement</th>
                                <th className="p-4 font-semibold">Abonnement</th>
                                <th className="p-4 font-semibold">Validité</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm text-gray-900 whitespace-nowrap">
                                        {format(new Date(tx.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{tx.user?.name || 'Inconnu'}</div>
                                        <div className="text-sm text-gray-500">{tx.user?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{tx.plan?.name || 'Inconnu'}</div>
                                        <div className="text-sm text-gray-500">
                                            {tx.plan
                                                ? `${tx.billing_cycle === 'yearly' ? tx.plan.yearly_price : tx.plan.price} F / ${tx.billing_cycle === 'yearly' ? 'an' : 'mois'}`
                                                : ''}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            {getStatusBadge(tx.payment_status)}
                                            <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={tx.maketou_cart_id}>
                                                {tx.maketou_cart_id ? tx.maketou_cart_id.split('-')[0] + '...' : '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getSubStatusBadge(tx.status)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {tx.ends_at ? (
                                            <div>
                                                Jusqu'au <span className="font-medium text-gray-900">{format(new Date(tx.ends_at), 'dd MMM yyyy', { locale: fr })}</span>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Aucune transaction trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
