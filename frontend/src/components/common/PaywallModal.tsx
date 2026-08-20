import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Globe, Image, FileText, Check, ArrowRight, X } from 'lucide-react'

export type PaywallType = 'gallery_limit' | 'publish_site' | 'invoice_limit' | 'generic'

interface PaywallModalProps {
    isOpen: boolean
    onClose: () => void
    type: PaywallType
}

const PAYWALL_CONFIGS: Record<PaywallType, {
    icon: React.ReactNode
    title: string
    subtitle: string
    description: string
    highlights: string[]
    cta: string
    targetPlan: string
}> = {
    publish_site: {
        icon: <Globe className="w-8 h-8 text-green-400" />,
        title: "Rendez votre site public 🌐",
        subtitle: "Passez au plan Pro pour publier votre site",
        description: "Votre site est prêt ! Pour le rendre accessible au monde entier avec votre propre nom de domaine personnalisé et sans marque Vanda Studio, activez le plan Pro.",
        highlights: [
            "Domaine personnalisé (.com, .fr, .ci...)",
            "Sans watermark Vanda Studio",
            "Indexation automatique sur Google (SEO)",
            "Hébergement ultra-rapide et sécurisé",
        ],
        cta: "Publier mon site avec Pro (5 000 F/mois)",
        targetPlan: "pro",
    },
    gallery_limit: {
        icon: <Image className="w-8 h-8 text-green-400" />,
        title: "Limite de galeries atteinte 📸",
        subtitle: "3 / 3 galeries créées avec le plan Starter",
        description: "Vous avez atteint la limite de 3 galeries d'essai gratuites. Passez à la vitesse supérieure pour partager vos créations sans contrainte.",
        highlights: [
            "Jusqu'à 20 galeries actives par mois",
            "Jusqu'à 500 photos dans le portfolio",
            "Téléchargement rapide et sécurisé pour vos clients",
            "Paiement en ligne Mobile Money & Carte intégrés",
        ],
        cta: "Débloquer 20 galeries avec Pro (5 000 F/mois)",
        targetPlan: "pro",
    },
    invoice_limit: {
        icon: <FileText className="w-8 h-8 text-green-400" />,
        title: "Limite de factures atteinte 💼",
        subtitle: "5 / 5 factures & devis générés avec Starter",
        description: "Félicitations pour vos premières ventes ! Pour continuer à facturer vos clients et recevoir vos acomptes en ligne, upgradez vers le plan Pro.",
        highlights: [
            "Factures et devis illimités",
            "Gestion des acomptes & soldes automatiques",
            "Paiements Mobile Money directs",
            "Export comptable & relances",
        ],
        cta: "Débloquer la facturation illimitée (5 000 F/mois)",
        targetPlan: "pro",
    },
    generic: {
        icon: <Sparkles className="w-8 h-8 text-green-400" />,
        title: "Passez au niveau supérieur 🚀",
        subtitle: "Débloquez toute la puissance de Vanda Studio",
        description: "Cette fonctionnalité nécessite le plan Pro ou Studio. Débloquez-la dès maintenant pour faire grandir votre activité de photographe.",
        highlights: [
            "Domaine personnalisé & zéro watermark",
            "500 photos & 20 galeries par mois",
            "Paiements Mobile Money & Carte bancaire",
            "Facturation complète & support prioritaire",
        ],
        cta: "Passer au plan Pro",
        targetPlan: "pro",
    },
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, type }) => {
    const config = PAYWALL_CONFIGS[type] || PAYWALL_CONFIGS.generic

    if (!isOpen) return null

    const handleUpgrade = () => {
        const adminUrl = import.meta.env.VITE_ADMIN_URL || ''
        window.location.href = `${adminUrl}/auth/register?plan=${config.targetPlan}&checkout=true`
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-strong border border-green-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(74,222,128,0.15)]"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                            {config.icon}
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                                Offre Promo · 5 000 F/mois (6 mois)
                            </span>
                            <h3 className="text-xl font-bold text-white leading-tight">
                                {config.title}
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-amber-400 mb-2">
                        {config.subtitle}
                    </p>

                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                        {config.description}
                    </p>

                    {/* Highlights */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 space-y-2.5">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                            Inclus dans le plan Pro :
                        </span>
                        {config.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-200">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleUpgrade}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/25 transition-all text-base"
                        >
                            <span>{config.cta}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full text-center text-xs text-gray-400 hover:text-gray-200 py-2 transition-colors"
                        >
                            Continuer avec le plan Starter (limité)
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default PaywallModal
