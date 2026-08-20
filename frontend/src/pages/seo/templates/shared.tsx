// Shared UI primitives reused across all templates
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://app.vanda-studio.org'

export const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
}

export function Badge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-wider mb-5">
            {text}
        </span>
    )
}

export function ScreenshotFrame({ src, alt, label }: { src: string; alt: string; label?: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#111827] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                {label && <span className="ml-2 text-xs text-gray-500 font-mono">{label}</span>}
            </div>
            <img src={src} alt={alt} className="w-full h-auto block" />
        </div>
    )
}

export function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-400" />
                    </span>
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    )
}

export function HeroCTA({ label = 'Commencer maintenant', href, centered = false }: { label?: string; href?: string; centered?: boolean }) {
    return (
        <div className={`flex flex-col sm:flex-row gap-4 ${centered ? 'justify-center items-center' : 'justify-start items-start'}`}>
            <a href={href || `${ADMIN_URL}/auth/register`}
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-7 py-4 rounded-xl text-base transition-all shadow-lg shadow-green-500/25">
                {label}
                <ArrowRight className="w-5 h-5" />
            </a>
        </div>
    )
}

export function GlobalCTA() {
    return (
        <section className="py-24 px-4">
            <motion.div {...fadeUp} className="max-w-4xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-green-500/5" />
                    <div className="absolute inset-0 border border-green-500/20 rounded-3xl" />
                    <div className="relative px-8 py-16 text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                            Prêt à transformer{' '}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                votre activité ?
                            </span>
                        </h2>
                        <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                            Rejoignez des centaines de créatifs qui font confiance à Vanda Studio. Essai gratuit 30 jours, sans engagement.
                        </p>
                        <a href={`${ADMIN_URL}/auth/register`}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-9 py-4 rounded-xl text-base transition-all shadow-xl shadow-green-500/25">
                            Créer mon studio maintenant
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                            {['Essai gratuit 30 jours', 'Sans carte bancaire', 'Annulation en 1 clic'].map(t => (
                                <div key={t} className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-green-500" />{t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export function RelatedLinks({ current }: { current: string }) {
    const all = [
        { label: 'Builder Site Vitrine', href: '/features/builder-site-vitrine' },
        { label: 'Galeries Privées', href: '/features/galeries-clients-privees' },
        { label: 'Facturation & Devis', href: '/features/facturation-et-devis' },
        { label: 'Paiement Acomptes', href: '/features/paiement-en-ligne-et-acompte' },
        { label: 'Studio Mariage', href: '/solutions/studio-mariage-et-evenementiel' },
        { label: 'Photographe', href: '/for/photographe' },
        { label: 'Graphiste', href: '/for/graphiste' },
        { label: 'Calculateur Facture', href: '/tools/calculateur-facture-photographe' },
    ].filter(l => l.href !== current).slice(0, 6)

    return (
        <section className="py-10 border-t border-white/5 px-4">
            <div className="max-w-5xl mx-auto">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-5">Explorer aussi</p>
                <div className="flex flex-wrap gap-3">
                    {all.map(l => (
                        <a key={l.href} href={l.href}
                            className="px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-green-500/40 hover:bg-green-500/5 transition-all">
                            {l.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export { ADMIN_URL }
