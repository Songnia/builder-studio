import { useState } from 'react'
import { SeoNavbar, SeoFooter } from '@/pages/seo/SeoLayout'
import { motion } from 'framer-motion'
import {
    Camera,
    Layout,
    Image,
    Share2,
    Check,
    ArrowRight,
    Star,
    Globe,
    Sparkles
} from 'lucide-react'

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://app.vanda-studio.org';

// Navigation Component

// Hero Section
function HeroSection() {
    return (
        <section className="relative pt-6 sm:pt-10 pb-16 lg:pb-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.08),transparent_50%)]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">Essai gratuit 30 jours • Sans carte bancaire</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Créez votre site professionnel de{' '}
                            <span className="gradient-text">créatif</span>{' '}
                            en 10 minutes
                        </h1>

                        <p className="text-lg text-gray-400 mb-8 max-w-xl">
                            Sans code, sans stress. De la création à la livraison de galeries,
                            VANDA STUDIO gère tout pour vous.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`${ADMIN_URL}/auth/register`}
                                className="bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/25"
                            >
                                <Camera className="w-5 h-5" />
                                Commencer maintenant
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            {/* <button className="border border-white/20 text-white hover:bg-white/5 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Layout className="w-5 h-5" />
                                Voir une démo
                            </button>*/}
                        </div>

                        {/* Social Proof Mini */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-10 flex items-center gap-4"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-black"
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-gray-400">
                                <span className="text-white font-semibold">500+</span> photographes nous font confiance
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Real App Screenshot */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-3xl" />

                            {/* Browser frame */}
                            <div className="relative glass-strong rounded-2xl p-4 glow-green">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <div className="flex-1 mx-3">
                                        <div className="bg-black/40 rounded-md px-3 py-1 text-xs text-gray-500 text-center font-mono">
                                            app.vanda-studio.org/dashboard
                                        </div>
                                    </div>
                                </div>
                                <img
                                    src="/assets/screenshots/dashboard.png"
                                    alt="Dashboard Vanda Studio"
                                    className="w-full rounded-xl"
                                    style={{ display: 'block' }}
                                />
                            </div>

                            {/* Floating badge: galerie partagée */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 border border-green-500/30"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-xs text-white font-semibold">Galerie partagée ✓</span>
                                </div>
                            </motion.div>

                            {/* Floating badge: acompte reçu */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-green-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Acompte reçu</div>
                                        <div className="text-sm text-white font-bold">75 000 FCFA</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// Social Proof Section
function SocialProofSection() {
    const stats = [
        { value: '500+', label: 'Sites créés' },
        { value: '50K+', label: 'Photos livrées' },
        { value: '98%', label: 'Clients satisfaits' },
        { value: '4.9', label: 'Note moyenne' },
    ]

    return (
        <section className="py-20 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Rejoignez <span className="gradient-text">500+ creatif</span> qui ont transformé leur activité
                    </h2>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="glass rounded-2xl p-8 text-center">
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <blockquote className="text-lg sm:text-xl text-gray-300 mb-6 italic">
                            "J'ai créé mon site en 8 minutes chrono. Incroyable ! Mes clients adorent les galeries privées.
                            Ça a complètement changé ma façon de livrer mes photos."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                            <div className="text-left">
                                <div className="text-white font-medium">Sophie Martin</div>
                                <div className="text-sm text-gray-400">Photographe Mariage, Paris</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// Scrolling Target Professions Section (Métiers Cibles)
function TargetProfessionsStrip() {
    const professionsRow1 = [
        { title: 'Photographe', desc: 'Galeries HD, devis & solde', href: '/for/photographe' },
        { title: 'Graphiste & Designer', desc: 'Portfolio & acomptes Mobile Money', href: '/for/graphiste' },
        { title: 'Vidéaste & Réalisateur', desc: 'Showreel & contrats de tournage', href: '/for/videaste' },
        { title: 'Illustrateur', desc: 'Art prints & commandes custom', href: '/for/illustrateur' },
        { title: 'Maquilleur (MUA)', desc: 'Portfolio beauté & acomptes', href: '/for/maquilleur' },
    ]

    const professionsRow2 = [
        { title: 'Wedding Planner', desc: 'Packages mariage & échéanciers', href: '/for/wedding-planner' },
        { title: "Architecte d'Intérieur", desc: 'Rendus 3D & honoraires', href: '/for/architecte-interieur' },
        { title: 'Créateur de Contenu', desc: 'Media kit & partenariats', href: '/for' },
        { title: 'Styliste & Designer Mode', desc: 'Lookbook & commandes sur mesure', href: '/for' },
        { title: 'Sound Designer & DJ', desc: 'Bookings & devis prestation', href: '/for' },
    ]

    const row1 = [...professionsRow1, ...professionsRow1]
    const row2 = [...professionsRow2, ...professionsRow2]

    return (
        <section className="py-14 overflow-hidden bg-white/[0.015] border-y border-white/5 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">Conçu pour vos exigences</p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                    Taillé sur mesure pour <span className="gradient-text">chaque métier créatif</span>
                </h2>
            </div>

            {/* Gradient edge masks */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050B06] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050B06] to-transparent z-10 pointer-events-none" />

                {/* Marquee Row 1 */}
                <div className="mb-4 overflow-hidden flex">
                    <div className="animate-marquee gap-4 pr-4">
                        {row1.map((p, i) => (
                            <a
                                key={`${p.title}-${i}`}
                                href={p.href}
                                className="inline-flex items-center px-6 py-4 rounded-2xl bg-white/5 hover:bg-green-500/10 transition-all shrink-0 group border-0"
                            >
                                <div>
                                    <span className="block text-white font-extrabold text-base group-hover:text-green-400 transition-colors">
                                        {p.title}
                                    </span>
                                    <span className="block text-xs text-gray-400 font-medium">{p.desc}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Marquee Row 2 (Reverse) */}
                <div className="overflow-hidden flex">
                    <div className="animate-marquee-reverse gap-4 pr-4">
                        {row2.map((p, i) => (
                            <a
                                key={`${p.title}-${i}`}
                                href={p.href}
                                className="inline-flex items-center px-6 py-4 rounded-2xl bg-white/5 hover:bg-green-500/10 transition-all shrink-0 group border-0"
                            >
                                <div>
                                    <span className="block text-white font-extrabold text-base group-hover:text-green-400 transition-colors">
                                        {p.title}
                                    </span>
                                    <span className="block text-xs text-gray-400 font-medium">{p.desc}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// Features Section
function FeaturesSection() {
    const features = [
        {
            number: '01',
            title: 'Site Vitrine No-Code en 10 Minutes',
            description: 'Un builder visuel guidé étape par étape. Choisissez votre template, ajoutez vos photos, vos tarifs, publiez. Aucune compétence technique requise.',
            icon: Layout,
            items: [
                'Templates professionnels prêts à l\'emploi',
                'Domaine personnalisé inclus',
                'SEO intégré — trouvez-vous sur Google',
                'Responsive mobile & tablette'
            ],
        },
        {
            number: '02',
            title: 'Galeries Privées & Livraison Sécurisée',
            description: 'Livrez vos photos et vidéos en haute définition dans un espace privé sécurisé par code PIN. Vos clients sélectionnent leurs favoris et téléchargent directement.',
            icon: Image,
            items: [
                'Protection par mot de passe ou code PIN',
                'Téléchargement HD groupé en ZIP',
                'Sélection de favoris par le client',
                'Déblocage conditionnel après paiement'
            ],
        },
        {
            number: '03',
            title: 'Facturation & Paiement d\'Acomptes',
            description: 'Générez des devis et factures PDF professionnels. Encaissez vos acomptes en ligne via carte bancaire ou Mobile Money (Maketou) dès la signature.',
            icon: Globe,
            items: [
                'Devis & factures PDF en 2 clics',
                'Paiement Mobile Money (FCFA)',
                'Suivi des acomptes et soldes',
                'Historique complet des transactions'
            ],
        },
    ]

    return (
        <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Tout ce qu'il faut pour <span className="gradient-text">réussir en ligne</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Une suite complète d'outils conçue pour les créatifs professionnels : photographes, graphistes, illustrateurs, vidéastes...
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.number}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="text-green-400 font-mono text-sm">{feature.number}</span>
                                    <div className="w-8 h-px bg-green-400/30" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-400 mb-6">{feature.description}</p>
                                <ul className="space-y-3">
                                    {feature.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-green-400" />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/15 rounded-2xl blur-2xl" />
                                    <div className="relative glass-strong rounded-2xl overflow-hidden p-3">
                                        <div className="flex items-center gap-1.5 mb-2 px-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                        </div>
                                        <img
                                            src={[
                                                '/assets/screenshots/monsite/star creation site.png',
                                                '/assets/screenshots/galerie/Partager la galerie.png',
                                                '/assets/screenshots/facturation/create facture.png'
                                            ][index]}
                                            alt={feature.title}
                                            className="w-full rounded-lg"
                                            style={{ display: 'block' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// How It Works Section
function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Créez votre site',
            description: 'Inscrivez-vous et obtenez un site professionnel instantanément. Personnalisez votre design sans aucune compétence technique.',
            icon: Layout,
        },
        {
            number: '02',
            title: 'Créez vos galeries',
            description: 'Importez vos photos en haute définition. Nous les optimisons automatiquement pour le web tout en gardant la qualité.',
            icon: Image,
        },
        {
            number: '03',
            title: 'Livrez vos clients',
            description: 'Partagez des galeries privées sécurisées. Vos clients sélectionnent leurs favoris et téléchargent leurs photos simplement.',
            icon: Share2,
        },
    ]

    return (
        <section id="how-it-works" className="py-24 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Comment ça <span className="gradient-text">marche ?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Lancez votre activité en 3 étapes simples. Pas de compétences techniques requises.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative"
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-green-500/30 to-transparent" />
                            )}

                            <div className="glass rounded-2xl overflow-hidden h-full hover:border-green-500/30 transition-colors">
                                {/* Real screenshot thumbnail */}
                                <div className="relative">
                                    <img
                                        src={[
                                            '/assets/screenshots/site-internet-danou-studio.png',
                                            '/assets/screenshots/gallerie-image-soutenance.png',
                                            '/assets/screenshots/facture-danou-studio.png'
                                        ][index]}
                                        alt={step.title}
                                        className="w-full h-64 sm:h-72 lg:h-64 object-cover object-top"
                                    />
                                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-black font-extrabold text-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="/pricing"
                        className="bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-lg shadow-green-500/25"
                    >
                        Voir les tarifs
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

// Pricing Section
function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            tagline: 'Pour démarrer votre studio en ligne',
            monthly: 5000,
            yearly: 50000,
            promoMonthly: 2500,
            features: [
                'Site vitrine (builder pas-à-pas)',
                'Portfolio jusqu\'à 20 photos',
                '4 galeries clients / mois',
                'Livraison par lien sécurisé',
                'Facturation & devis en FCFA',
                'Sous-domaine Vanda Studio',
            ],
            cta: 'Commencer maintenant',
            popular: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            tagline: 'La formule des photographes actifs',
            monthly: 11000,
            yearly: 100000,
            promoMonthly: 5000,
            badge: 'Le plus populaire',
            features: [
                'Tout le plan Starter',
                'Domaine personnalisé',
                'Sans watermark Vanda Studio',
                '500 photos · 20 galeries/mois',
                'Paiement en ligne (Mobile Money & carte)',
                'Acomptes & soldes sur devis',
            ],
            cta: 'Choisir le plan Pro',
            popular: true,
        },
        {
            id: 'studio',
            name: 'Studio',
            tagline: 'Pour les studios & agences',
            monthly: 25000,
            yearly: 250000,
            promoMonthly: 15000,
            features: [
                'Tout le plan Pro',
                'Photos & galeries illimitées',
                'API & Webhooks',
                'Statistiques avancées',
                'Support prioritaire 24/7',
                'Onboarding dédié',
            ],
            cta: 'Choisir le plan Studio',
            popular: false,
        },
    ]

    const colors = {
        text: 'text-green-400',
        bg: 'bg-green-500',
        border: 'border-green-500/30',
        glow: 'shadow-[0_0_40px_rgba(74,222,128,0.15)]',
        button: 'bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/25 transition-all',
        lightBg: 'bg-green-500/10',
    }

    return (
        <section id="pricing" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    {/* Promo badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-semibold text-amber-400">🎉 Prix lancement · -50% les 6 premiers mois</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Des tarifs <span className="gradient-text">simples et transparents</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Commencez dès maintenant. Upgradez quand votre activité grandit. Sans engagement.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Mensuel</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            aria-label="Basculer facturation mensuelle/annuelle"
                            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isYearly ? 'bg-green-500' : 'bg-gray-700'}`}
                        >
                            <span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md ${isYearly ? 'translate-x-9' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                            Annuel
                            <span className="ml-2 px-2.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">-17%</span>
                        </span>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan, index) => (
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
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className={`${colors.bg} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap`}>
                                        <Star className="w-3 h-3 fill-white" />
                                        Le plus populaire
                                    </span>
                                </div>
                            )}

                            {/* Plan name */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                <p className="text-sm text-green-400 font-medium">{plan.tagline}</p>
                            </div>

                            {/* Price block */}
                            <div className="mb-6">
                                {!isYearly && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 mb-3">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        <span className="text-xs font-semibold text-amber-400">Prix lancement · 6 premiers mois</span>
                                    </div>
                                )}
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-5xl font-bold text-white">
                                        {isYearly
                                            ? plan.yearly.toLocaleString('fr-FR')
                                            : plan.promoMonthly.toLocaleString('fr-FR')
                                        } F
                                    </span>
                                    <span className="text-gray-400">{isYearly ? '/an' : '/mois'}</span>
                                </div>
                                {!isYearly && (
                                    <p className="text-sm text-gray-500">
                                        <span className="line-through">{plan.monthly.toLocaleString('fr-FR')} F/mois</span>
                                        <span className="ml-2 text-green-400 font-semibold text-xs">
                                            puis {plan.monthly.toLocaleString('fr-FR')} F/mois
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* CTA */}
                            <a
                                href={`${ADMIN_URL}/auth/register?plan=${plan.id}${plan.id !== 'starter' ? '&checkout=true' : ''}`}
                                onClick={() => localStorage.setItem('selectedPlan', plan.id)}
                                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${colors.button} mb-6`}
                            >
                                {plan.cta}
                            </a>

                            {/* Features */}
                            <ul className="space-y-2.5 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Link to full pricing */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-gray-500 mt-8 text-sm"
                >
                    Comparer tous les détails →{' '}
                    <a href="/pricing" className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors">
                        Voir le comparatif complet
                    </a>
                </motion.p>
            </div>
        </section>
    )
}


// Testimonials Section
function TestimonialsSection() {
    const testimonials = [
        {
            quote: "VANDA STUDIO a transformé ma façon de travailler. Mes clients adorent les galeries privées.",
            author: "Marie L.",
            role: "Photographe Portrait",
            rating: 5,
        },
        {
            quote: "Enfin un outil simple et professionnel. J'ai gagné des heures de travail chaque semaine.",
            author: "Thomas B.",
            role: "Studio Photo",
            rating: 5,
        },
        {
            quote: "Le support est incroyable et les mises à jour régulières. Je recommande à 100% !",
            author: "Julie D.",
            role: "Photographe Mariage",
            rating: 5,
        },
    ]

    return (
        <section id="testimonials" className="py-24 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ce que disent <span className="gradient-text">nos clients</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-2xl p-6"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                                <div>
                                    <div className="text-white font-medium">{testimonial.author}</div>
                                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// CTA Section
function CTASection() {
    return (
        <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-green-500/10 rounded-3xl blur-3xl" />

                    <div className="relative glass-strong rounded-3xl p-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Prêt à transformer <span className="gradient-text">votre activité ?</span>
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Rejoignez les créatifs qui ont déjà fait le pas. Essai gratuit de 30 jours,
                            sans engagement.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`${ADMIN_URL}/auth/register`}
                                className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-500/25"
                            >
                                <Camera className="w-5 h-5" />
                                Commencer maintenant
                            </a>
                            {/*<a
                                href="/contact"
                                className="border border-white/20 text-white hover:bg-white/5 px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Nous contacter
                            </a> */}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Essai gratuit 30 jours
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Sans carte bancaire
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-400" />
                                Annulation facile
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// Footer

// Main Landing Page Component
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground linear-theme font-sans">
            <SeoNavbar />

            <main className="pt-20">
                <HeroSection />
                <SocialProofSection />
                <TargetProfessionsStrip />
                <FeaturesSection />
                <HowItWorksSection />
                <PricingSection />
                <TestimonialsSection />
                <CTASection />
            </main>

            <SeoFooter />
        </div>
    )
}
