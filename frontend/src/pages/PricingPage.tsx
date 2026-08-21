import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check,
    X,
    Star,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Building2,
    Lock,
    ShieldCheck,
    Zap,
    RefreshCcw,
    CreditCard,
    Globe,
    HelpCircle,
} from 'lucide-react'
import { SeoNavbar, SeoFooter } from '@/pages/seo/SeoLayout'

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://app.vanda-studio.org'

type BillingCycle = 'monthly' | 'yearly'

interface Plan {
    id: string
    name: string
    tagline: string
    monthly: number
    yearly: number
    promoMonthly: number   // prix promotionnel — 6 premiers mois
    badge?: string
    popular: boolean
    color: string
    cta: string
    features: { label: string; included: boolean }[]
    limits: string[]
    upsell: string
}

const PLANS: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'Pour démarrer votre studio en ligne',
        monthly: 5000,
        yearly: 50000,
        promoMonthly: 2500,
        popular: false,
        color: 'green',
        cta: 'Commencer gratuitement',
        features: [
            { label: 'Site vitrine (builder pas-à-pas)', included: true },
            { label: 'Sous-domaine Vanda Studio', included: true },
            { label: 'Portfolio (jusqu\'à 20 photos)', included: true },
            { label: 'Galeries clients (4 actives/mois)', included: true },
            { label: 'Livraison de galeries par lien sécurisé', included: true },
            { label: 'Facturation & devis en FCFA', included: true },
            { label: 'Support par e-mail', included: true },
            { label: 'Domaine personnalisé', included: false },
            { label: 'Paiement en ligne (Mobile Money, carte)', included: false },
            { label: 'Sans watermark Vanda Studio', included: false },
        ],
        limits: [
            '20 photos maximum dans le portfolio',
            '4 galeries clients actives par mois',
            'Marque Vanda Studio visible sur votre site',
            'Pas de domaine personnalisé',
            'Paiement en ligne indisponible',
        ],
        upsell: 'Passez au plan Pro pour débloquer votre domaine, le paiement en ligne, 500 photos et 20 galeries par mois.',
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'La formule des photographes qui vivent de leur art',
        monthly: 11000,
        yearly: 100000,
        promoMonthly: 5000,
        badge: 'Le plus populaire',
        popular: true,
        color: 'green',
        cta: 'Choisir le plan Pro',
        features: [
            { label: 'Tout le plan Starter', included: true },
            { label: 'Domaine personnalisé', included: true },
            { label: 'Sans watermark Vanda Studio', included: true },
            { label: 'Portfolio jusqu\'à 500 photos', included: true },
            { label: '20 galeries clients actives par mois', included: true },
            { label: 'Paiement en ligne en FCFA (Mobile Money & carte)', included: true },
            { label: 'Acomptes & soldes sur devis et factures', included: true },
            { label: 'Support e-mail prioritaire', included: true },
            { label: 'API & Webhooks', included: false },
            { label: 'Statistiques avancées', included: false },
        ],
        limits: [
            '500 photos maximum dans le portfolio',
            '20 galeries clients actives par mois',
            'Pas d\'API ni de Webhooks',
            'Statistiques avancées réservées au plan Studio',
        ],
        upsell: 'Le plan Studio débloque le stockage illimité, photos illimitées, galeries illimitées, API et statistiques avancées.',
    },
    {
        id: 'studio',
        name: 'Studio',
        tagline: 'La puissance maximale pour les studios et les agences',
        monthly: 25000,
        yearly: 250000,
        promoMonthly: 15000,
        badge: 'Pour les pros exigeants',
        popular: false,
        color: 'green',
        cta: 'Choisir le plan Studio',
        features: [
            { label: 'Tout le plan Pro', included: true },
            { label: 'Photos portfolio illimitées', included: true },
            { label: 'Galeries clients illimitées', included: true },
            { label: 'API & Webhooks', included: true },
            { label: 'Statistiques avancées', included: true },
            { label: 'Support prioritaire 24/7', included: true },
            { label: 'Accès anticipé aux nouvelles fonctionnalités', included: true },
            { label: 'Badge "Studio vérifié" sur le profil', included: true },
            { label: 'Export des données & sauvegardes', included: true },
            { label: 'Onboarding dédié', included: true },
        ],
        limits: [
            'Aucune limite de photos, galeries ou stockage',
            'Réservé aux photographes et studios à fort volume',
        ],
        upsell: 'Vous êtes au sommet : profitez de toutes les fonctionnalités sans la moindre limite.',
    },
]

const formatPrice = (price: number) => price.toLocaleString('fr-FR')


function PricingHero() {
    return (
        <section className="pt-32 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                >
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">🎉 Prix lancement · -50% les 6 premiers mois · Sans carte bancaire</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl sm:text-6xl font-bold text-white mb-6"
                >
                    Des tarifs <span className="gradient-text">simples, transparents</span>
                    <br className="hidden sm:block" /> et pensés pour évoluer
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-400 max-w-2xl mx-auto"
                >
                    Commencez gratuitement, upgradez quand votre activité grandit. Chaque plan
                    est conçu pour vous faire passer au niveau supérieur, sans effort et sans payer deux fois.
                </motion.p>
            </div>
        </section>
    )
}

function BillingToggle({ cycle, onChange }: { cycle: BillingCycle; onChange: (c: BillingCycle) => void }) {
    const pro = PLANS.find(p => p.id === 'pro')!
    const annualTotal = pro.monthly * 12
    const saved = annualTotal - pro.yearly
    const percent = Math.round((saved / annualTotal) * 100)

    return (
        <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium transition-colors ${cycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Mensuel</span>
            <button
                onClick={() => onChange(cycle === 'monthly' ? 'yearly' : 'monthly')}
                aria-label="Basculer entre facturation mensuelle et annuelle"
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${cycle === 'yearly' ? 'bg-green-500' : 'bg-gray-700'}`}
            >
                <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md ${cycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'}`}
                />
            </button>
            <span className={`text-sm font-medium transition-colors ${cycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                Annuel
                <span className="ml-2 px-2.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    Économisez {saved.toLocaleString('fr-FR')} F ({percent}%)
                </span>
            </span>
        </div>
    )
}

function PricingCards() {
    const [cycle, setCycle] = useState<BillingCycle>('monthly')

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BillingToggle cycle={cycle} onChange={setCycle} />

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((plan, index) => {
                        const period = cycle === 'monthly' ? '/mois' : '/an'
                        const savings = Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100)
                        const colors = {
                            text: 'text-green-400',
                            bg: 'bg-green-500',
                            border: 'border-green-500/30',
                            glow: 'shadow-[0_0_40px_rgba(74,222,128,0.15)]',
                            button: 'bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/25 transition-all',
                            lightBg: 'bg-green-500/10',
                        }

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col rounded-2xl p-8 ${
                                    plan.popular
                                        ? `glass-strong ${colors.border} ${colors.glow} md:scale-[1.03] z-10`
                                        : 'glass border-white/5'
                                }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className={`${colors.bg} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap`}>
                                            <Star className="w-3 h-3 fill-white" />
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-5">
                                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                    <p className="text-sm text-green-400 font-medium">{plan.tagline}</p>
                                </div>

                                

                                <div className="mb-6">
                                    {/* Promo badge */}
                                    {cycle === 'monthly' && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
                                            <Sparkles className="w-3 h-3 text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-400">Prix lancement · 6 premiers mois</span>
                                        </div>
                                    )}
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={cycle + plan.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-5xl font-bold text-white"
                                            >
                                                {cycle === 'monthly'
                                                    ? formatPrice(plan.promoMonthly)
                                                    : formatPrice(plan.yearly)
                                                } F
                                            </motion.span>
                                        </AnimatePresence>
                                        <span className="text-gray-400">{period}</span>
                                    </div>
                                    {cycle === 'monthly' && (
                                        <p className="text-sm text-gray-500">
                                            <span className="line-through">{formatPrice(plan.monthly)} F/mois</span>
                                            <span className="ml-2 text-green-400 font-semibold text-xs">
                                                puis {formatPrice(plan.monthly)} F/mois
                                            </span>
                                        </p>
                                    )}
                                    {cycle === 'yearly' && (
                                        <p className="text-xs text-green-400 font-medium">
                                            Économisez {savings}% vs mensuel
                                        </p>
                                    )}
                                </div>

                                <a
                                    href={`${ADMIN_URL}/auth/register?plan=${plan.id}&billing_cycle=${cycle}${plan.id !== 'starter' ? '&checkout=true' : ''}`}
                                    onClick={() => {
                                        localStorage.setItem('selectedPlan', plan.id)
                                        localStorage.setItem('selectedBillingCycle', cycle)
                                    }}
                                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${colors.button} mb-6`}
                                >
                                    {plan.cta}
                                </a>

                                <div className="mb-5">
                                    <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                                        Ce qui est inclus
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                {feature.included ? (
                                                    <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                                )}
                                                <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {feature.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-5 flex-grow">
                                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                                        Limites du plan
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {plan.limits.map((limit, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600">
                                                    <Lock className="w-3.5 h-3.5" />
                                                </span>
                                                <span className="text-sm text-gray-500">{limit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {index < PLANS.length - 1 && (
                                    <div className={`p-3 rounded-lg ${colors.lightBg} border ${colors.border} mb-2`}>
                                        <p className="text-xs text-green-300 leading-relaxed">
                                            <TrendingUp className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                                            {plan.upsell}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function WhyUpgrade() {
    const benefits = [
        {
            icon: Globe,
            title: 'Domaine personnalisé',
            desc: 'Affichez votre propre nom de domaine (monstudio.com) au lieu d’un sous-domaine générique.',
            plan: 'Pro',
        },
        {
            icon: CreditCard,
            title: 'Paiement en ligne en FCFA',
            desc: 'Encaissez vos acomptes et ventes par Mobile Money et carte bancaire directement sur votre site.',
            plan: 'Pro',
        },
        {
            icon: ShieldCheck,
            title: 'Acomptes & facturation avancée',
            desc: 'Encaissez les acomptes avant le shooting, le solde à la livraison. Tout depuis votre tableau de bord.',
            plan: 'Pro',
        },
        {
            icon: Zap,
            title: 'API & automatisations',
            desc: 'Branchez vos outils métier et automatisez la livraison et la facturation de vos clients.',
            plan: 'Studio',
        },
        {
            icon: Building2,
            title: 'Équipe & multi-comptes',
            desc: 'Ajoutez vos collaborateurs et gérez un studio à plusieurs sans jamais dupliquer votre travail.',
            plan: 'Studio',
        },
        {
            icon: RefreshCcw,
            title: 'Aucun engagement',
            desc: 'Changez de plan ou annulez à tout moment. Vos données restent exportables.',
            plan: 'Tous',
        },
    ]

    return (
        <section className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                    Pourquoi passer au plan supérieur ?
                </h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                    Chaque plan supérieur supprime les limites du précédent. Voici ce qui change
                    concrètement quand vous évoluez.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="glass rounded-2xl p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center">
                                    <benefit.icon className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">
                                    {benefit.plan}
                                </span>
                            </div>
                            <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ComparisonTable() {
    const rows: { name: string; starter: string | boolean; pro: string | boolean; studio: string | boolean }[] = [
        { name: 'Site vitrine (builder pas-à-pas)', starter: true, pro: true, studio: true },
        { name: 'Sous-domaine Vanda Studio', starter: true, pro: true, studio: true },
        { name: 'Photos portfolio', starter: '20 photos', pro: '500 photos', studio: 'Illimité' },
        { name: 'Galeries clients actives/mois', starter: '4', pro: '20', studio: 'Illimité' },
        { name: 'Livraison par lien sécurisé', starter: true, pro: true, studio: true },
        { name: 'Facturation & devis en FCFA', starter: true, pro: true, studio: true },
        { name: 'Paiement en ligne (Mobile Money & carte)', starter: false, pro: true, studio: true },
        { name: 'Acomptes & soldes sur devis', starter: false, pro: true, studio: true },
        { name: 'Sans watermark Vanda Studio', starter: false, pro: true, studio: true },
        { name: 'Domaine personnalisé', starter: false, pro: true, studio: true },
        { name: 'API & Webhooks', starter: false, pro: false, studio: true },
        { name: 'Statistiques avancées', starter: false, pro: false, studio: true },
        { name: 'Export des données & sauvegardes', starter: false, pro: false, studio: true },
        { name: 'Support', starter: 'E-mail', pro: 'E-mail prioritaire', studio: 'Prioritaire 24/7' },
    ]

    const renderCell = (value: string | boolean) => {
        if (typeof value === 'boolean') {
            return value
                ? <Check className="w-5 h-5 text-green-400 mx-auto" />
                : <X className="w-5 h-5 text-gray-600 mx-auto" />
        }
        return <span className="text-sm text-gray-300">{value}</span>
    }

    const headerCell = (plan: Plan) => (
        <th key={plan.id} className={`p-4 text-white font-semibold ${plan.popular ? 'bg-green-500/5 text-green-400' : ''}`}>
            {plan.name}
            {plan.popular && <span className="block text-[10px] font-medium text-green-500 mt-1">Le plus populaire</span>}
        </th>
    )

    return (
        <section className="py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
                    Comparatif complet des plans
                </h2>

                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium">Fonctionnalité</th>
                                    {PLANS.map(headerCell)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-gray-300 text-sm">{row.name}</td>
                                        <td className="p-4 text-center">{renderCell(row.starter)}</td>
                                        <td className="p-4 text-center bg-green-500/5">{renderCell(row.pro)}</td>
                                        <td className="p-4 text-center">{renderCell(row.studio)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FAQSection() {
    const [open, setOpen] = useState<number | null>(0)
    const faqs = [
        {
            q: 'Puis-je passer d’un plan à un autre facilement ?',
            a: 'Oui. Vous pouvez upgrade ou downgrade à tout moment depuis votre tableau de bord. La différence de prix est calculée au prorata, et vous conservez toutes vos données, galeries et votre site.',
        },
        {
            q: 'Que se passe-t-il si je dépasse les limites de mon plan ?',
            a: 'Rien ne bloque votre travail : vous pouvez continuer à utiliser vos galeries existantes. Cependant, les nouvelles créations seront limitées tant que vous n’avez pas évolué vers le plan supérieur. C’est le moment idéal pour passer au niveau supérieur.',
        },
        {
            q: 'Quelle est la différence entre le paiement mensuel et annuel ?',
            a: 'Le paiement annuel vous offre le meilleur tarif : vous économisez jusqu’à 24 % par rapport au mensuel, soit l’équivalent de plusieurs mois offerts. Le reste est strictement identique.',
        },
        {
            q: 'Le domaine personnalisé est-il vraiment inclus dans Pro ?',
            a: 'Oui, la configuration de votre domaine personnalisé (par exemple monstudio.com) est incluse dans le plan Pro. Nous vous guidons pas à pas pour le connecter à votre site.',
        },
        {
            q: 'Puis-je encaisser des acomptes avec la boutique en ligne ?',
            a: 'Absolument. Le plan Pro et supérieur vous permet de créer des offres, de demander un acompte avant le rendez-vous et d’encaisser le solde après livraison, le tout par Mobile Money ou carte bancaire en FCFA.',
        },
        {
            q: 'Et si je veux annuler ?',
            a: 'Aucun engagement. Vous pouvez annuler à tout moment et exporter toutes vos données. Votre site reste visible pendant la durée de votre période payée.',
        },
    ]

    return (
        <section className="py-24 bg-white/[0.02]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                    Questions fréquentes
                </h2>
                <p className="text-gray-400 text-center mb-10 flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4 text-green-400" />
                    Tout ce que vous devez savoir avant de choisir
                </p>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="glass rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpen(open === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <h3 className="text-white font-medium pr-4">{faq.q}</h3>
                                <span className={`text-green-400 transition-transform duration-300 ${open === index ? 'rotate-45' : ''}`}>
                                    +
                                </span>
                            </button>
                            <AnimatePresence>
                                {open === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CTASection() {
    return (
        <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative glass-strong rounded-3xl p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none" />
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative">
                        Prêt à créer votre studio en ligne ?
                    </h2>
                    <p className="text-gray-400 mb-8 relative max-w-xl mx-auto">
                        Essayez gratuitement pendant 30 jours. Sans carte bancaire, sans engagement.
                        Et quand votre activité grandira, la plateforme grandira avec vous.
                    </p>
                    <a
                        href={`${ADMIN_URL}/auth/register`}
                        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-all shadow-lg shadow-green-500/25"
                    >
                        Créer mon studio gratuitement
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

// Main Pricing Page Component
export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground linear-theme font-sans">
            <SeoNavbar />
            <PricingHero />
            <PricingCards />
            <WhyUpgrade />
            <ComparisonTable />
            <FAQSection />
            <CTASection />
            <SeoFooter />
        </div>
    )
}
