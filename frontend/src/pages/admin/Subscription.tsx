import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

type BillingCycle = 'monthly' | 'yearly';
type PlanFeature = string | { name?: string };

interface Plan {
    id: number;
    name: string;
    policy_key: 'starter' | 'pro' | 'studio';
    description: string;
    price: number;
    yearly_price: number | null;
    promo_monthly_price: number | null;
    promo_months: number | null;
    popular: boolean;
    features: PlanFeature[] | null;
    is_active: boolean;
}

const apiErrorMessage = (error: unknown, fallback: string) => {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    const data = error.response?.data;
    const message = typeof data?.message === 'string' ? data.message : '';
    const providerError = typeof data?.error === 'string' ? data.error : '';
    const code = typeof data?.code === 'string' ? data.code : '';
    const diagnostic = `${code} ${providerError} ${message}`;

    if (diagnostic.includes('INVALID_API_KEY') || code === 'payment_configuration_error') {
        return 'Le service de paiement est mal configuré. Contactez l’administrateur avant de réessayer.';
    }

    if (diagnostic.includes('INVALID_PRODUCT') || code === 'plan_payment_unavailable') {
        return 'Ce forfait n’est pas disponible au paiement. Contactez l’administrateur.';
    }

    if (diagnostic.includes('RATE_LIMITED') || code === 'payment_rate_limited') {
        return 'Le service de paiement reçoit trop de demandes. Réessayez dans quelques instants.';
    }

    return message || fallback;
};

export default function Subscription() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
    const [checkoutErrorKey, setCheckoutErrorKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>(() =>
        localStorage.getItem('selectedBillingCycle') === 'yearly' ? 'yearly' : 'monthly'
    );
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/plans');
            setPlans(response.data);
            
            // Check for auto-checkout from landing page
            const autoCheckoutPlanName = searchParams.get('auto_checkout');
            if (autoCheckoutPlanName && response.data.length > 0) {
                // Try to find a plan that loosely matches the name (e.g. "mensuel" -> "Mensuel")
                const targetPlan = response.data.find((p: Plan) => p.name.toLowerCase().includes(autoCheckoutPlanName.toLowerCase()));
                if (targetPlan) {
                    const selectedCycle = localStorage.getItem('selectedBillingCycle') === 'yearly' ? 'yearly' : 'monthly';
                    localStorage.removeItem('selectedPlan'); // clean up
                    handleSubscribe(targetPlan.id, selectedCycle);
                }
            }
        } catch (err: unknown) {
            setError(apiErrorMessage(err, 'Erreur lors du chargement des forfaits.'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId: number, cycle: BillingCycle = billingCycle) => {
        const checkoutKey = `${planId}:${cycle}`;
        setCheckoutLoading(checkoutKey);
        setError(null);
        setCheckoutErrorKey(null);
        try {
            const response = await api.post('/payment/checkout', {
                plan_id: planId,
                billing_cycle: cycle,
                redirect_url: window.location.origin + '/admin/dashboard'
            });
            
            if (response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            } else {
                throw new Error('URL de redirection manquante.');
            }
        } catch (err: unknown) {
            const message = apiErrorMessage(err, 'Erreur lors de la préparation du paiement.');
            setError(message);
            setCheckoutErrorKey(checkoutKey);
            setCheckoutLoading(null);
        }
    };

    const selectBillingCycle = (cycle: BillingCycle) => {
        setBillingCycle(cycle);
        localStorage.setItem('selectedBillingCycle', cycle);
        setError(null);
        setCheckoutErrorKey(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    Abonnements
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    Passez à la vitesse supérieure et publiez votre site sans limites.
                </p>
            </div>

            {error && checkoutErrorKey === null && (
                <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="mb-10 flex justify-center">
                <div className="inline-flex rounded-xl bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => selectBillingCycle('monthly')}
                        className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
                            billingCycle === 'monthly' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
                        }`}
                    >
                        Mensuel
                    </button>
                    <button
                        type="button"
                        onClick={() => selectBillingCycle('yearly')}
                        className={`rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
                            billingCycle === 'yearly' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
                        }`}
                    >
                        Annuel
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {plans.map((plan, index) => {
                    const monthlyPrice = Number(plan.price);
                    const yearlyPrice = plan.yearly_price === null ? null : Number(plan.yearly_price);
                    const promoMonthlyPrice = plan.promo_monthly_price === null ? null : Number(plan.promo_monthly_price);
                    const displayedPrice = billingCycle === 'yearly'
                        ? yearlyPrice
                        : (promoMonthlyPrice ?? monthlyPrice);
                    const checkoutKey = `${plan.id}:${billingCycle}`;
                    const isPopular = plan.popular;
                    
                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-2xl shadow-xl flex flex-col p-8 border-2 ${
                                isPopular ? 'border-blue-500 scale-105' : 'border-transparent'
                            }`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-4 h-4 fill-white" />
                                        Populaire
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="mt-2 text-gray-500">{plan.description}</p>
                            </div>

                            <div className="mb-6 flex-grow">
                                {billingCycle === 'monthly' && promoMonthlyPrice !== null && plan.promo_months !== null && (
                                    <div className="mb-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                        Prix lancement · {plan.promo_months} premiers mois
                                    </div>
                                )}
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900">
                                        {displayedPrice?.toLocaleString('fr-FR') ?? '—'} F
                                    </span>
                                    <span className="text-gray-500 font-medium">/{billingCycle === 'yearly' ? 'an' : 'mois'}</span>
                                </div>
                                {billingCycle === 'monthly' && promoMonthlyPrice !== null && (
                                    <p className="-mt-4 mb-6 text-sm text-gray-500">
                                        <span className="line-through">{monthlyPrice.toLocaleString('fr-FR')} F/mois</span>
                                        <span className="ml-2 font-semibold text-green-700">puis {monthlyPrice.toLocaleString('fr-FR')} F/mois</span>
                                    </p>
                                )}

                                <ul className="space-y-4">
                                    {plan.features && Array.isArray(plan.features) ? plan.features.map((feature, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-blue-500 shrink-0" />
                                            <span className="text-gray-600">
                                                {typeof feature === 'string' ? feature : feature.name || 'Fonctionnalité incluse'}
                                            </span>
                                        </li>
                                    )) : (
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-blue-500 shrink-0" />
                                            <span className="text-gray-600">Accès complet aux fonctionnalités</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan.id, billingCycle)}
                                disabled={checkoutLoading !== null || displayedPrice === null}
                                className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${
                                    isPopular
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                } flex justify-center items-center`}
                            >
                                {checkoutLoading === checkoutKey ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    checkoutErrorKey === checkoutKey ? 'Réessayer' : 'S\'abonner'
                                )}
                            </button>
                            {error && checkoutErrorKey === checkoutKey && (
                                <p role="alert" aria-live="assertive" className="mt-3 text-sm font-medium text-red-600">
                                    {error}
                                </p>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            {plans.length === 0 && !loading && !error && (
                <div className="text-center text-gray-500 py-12">
                    Aucun forfait n'est disponible pour le moment.
                </div>
            )}
        </div>
    );
}
