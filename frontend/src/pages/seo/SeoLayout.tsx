import { useState, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import vandaLogo from '@/template/assets/logo/vanda_logo.png'

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://app.vanda-studio.org'

const NAV_ITEMS = [
    {
        label: 'Fonctionnalités',
        href: '/features/builder-site-vitrine',
        children: [
            { label: 'Builder Site Vitrine', href: '/features/builder-site-vitrine', desc: 'Créez votre site en 10 min' },
            { label: 'Galeries Clients Privées', href: '/features/galeries-clients-privees', desc: 'Livraison sécurisée par PIN' },
            { label: 'Facturation & Devis', href: '/features/facturation-et-devis', desc: 'Factures PDF professionnelles' },
            { label: 'Paiement & Acomptes', href: '/features/paiement-en-ligne-et-acompte', desc: 'Mobile Money & carte' },
        ]
    },
    {
        label: 'Solutions',
        href: '/solutions/studio-mariage-et-evenementiel',
        children: [
            { label: 'Studio Mariage & Événementiel', href: '/solutions/studio-mariage-et-evenementiel', desc: 'Packages & planification' },
            { label: 'Portrait & Studio Photo', href: '/solutions/gestion-seances-portrait-et-studio', desc: 'Séances & livrables' },
            { label: 'Corporate & B2B', href: '/solutions/livraison-et-facturation-corporate', desc: 'Projets pro & facturation' },
        ]
    },
    {
        label: 'Métiers',
        href: '/for',
        children: [
            { label: 'Photographe', href: '/for/photographe', desc: 'Galeries & facturation séance' },
            { label: 'Graphiste & Designer', href: '/for/graphiste', desc: 'Portfolio & devis identité' },
            { label: 'Vidéaste', href: '/for/videaste', desc: 'Showreel & acomptes tournage' },
            { label: 'Illustrateur', href: '/for/illustrateur', desc: 'Art prints & commandes' },
            { label: 'Wedding Planner', href: '/for/wedding-planner', desc: 'Planning & packages mariage' },
            { label: 'Maquilleur (MUA)', href: '/for/maquilleur', desc: 'Avant/après & réservations' },
            { label: "Architecte d'Intérieur", href: '/for/architecte-interieur', desc: 'Rendus & honoraires' },
            { label: 'Voir tous les métiers →', href: '/for', desc: '' },
        ]
    },
    { label: 'Outils Gratuits', href: '/tools/calculateur-facture-photographe' },
    { label: 'Tarifs', href: '/pricing' },
]

function DropdownMenu({ items }: { items: { label: string; href: string; desc: string }[] }) {
    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50">
            <div className="bg-[#0B150D] border border-green-500/20 rounded-2xl shadow-2xl shadow-black/80 p-2 backdrop-blur-xl">
                {items.map((item) => (
                    <a key={item.href} href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-500/10 transition-colors group">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                            <div className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">{item.label}</div>
                            {item.desc && <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export function SeoNavbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', h)
        return () => window.removeEventListener('scroll', h)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050B06]/95 backdrop-blur-xl border-b border-green-500/20 shadow-xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3 flex-shrink-0">
                        <img src={vandaLogo} alt="Vanda Studio" className="h-10 w-auto" />
                        <span className="text-lg font-extrabold"
                            style={{ background: 'linear-gradient(135deg, #4caf50, #81c784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            VANDA STUDIO
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className="relative"
                                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                                onMouseLeave={() => setOpenDropdown(null)}>
                                <a href={item.href}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    {item.label}
                                    {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                                </a>
                                {item.children && openDropdown === item.label && (
                                    <DropdownMenu items={item.children} />
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* CTAs */}
                    <div className="hidden lg:flex items-center gap-3">
                        <a href={`${ADMIN_URL}/auth/login`}
                            className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                            Connexion
                        </a>
                        <a href={`${ADMIN_URL}/auth/register`}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-500/25">
                            Créer mon studio
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="lg:hidden bg-[#050B06]/98 border-b border-green-500/20 px-4 py-6 space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <a key={item.href} href={item.href}
                                className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium text-sm">
                                {item.label}
                            </a>
                        ))}
                        <div className="pt-4 flex flex-col gap-3">
                            <a href={`${ADMIN_URL}/auth/login`}
                                className="text-center py-3 border border-white/10 rounded-xl text-sm text-gray-300">
                                Connexion
                            </a>
                            <a href={`${ADMIN_URL}/auth/register`}
                                className="text-center py-3 bg-green-500 text-black font-bold rounded-xl text-sm">
                                Créer mon studio →
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export function SeoFooter() {
    return (
        <footer className="bg-[#030704] border-t border-green-500/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <a href="/" className="flex items-center gap-3 mb-4">
                            <img src={vandaLogo} alt="Vanda Studio" className="h-9 w-auto" />
                            <span className="text-base font-extrabold"
                                style={{ background: 'linear-gradient(135deg, #4caf50, #81c784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                VANDA STUDIO
                            </span>
                        </a>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
                            La plateforme tout-en-un pour créer votre studio en ligne. Site vitrine, galeries clients, devis & factures, paiements Mobile Money. Conçue pour les créatifs africains.
                        </p>
                        <a href={`${ADMIN_URL}/auth/register`}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-500/20">
                            Essai gratuit 30 jours
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Fonctionnalités</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {[
                                ['Builder No-Code', '/features/builder-site-vitrine'],
                                ['Galeries Privées', '/features/galeries-clients-privees'],
                                ['Facturation & Devis', '/features/facturation-et-devis'],
                                ['Paiement Acomptes', '/features/paiement-en-ligne-et-acompte'],
                            ].map(([l, h]) => <li key={h}><a href={h} className="hover:text-green-400 transition-colors">{l}</a></li>)}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Métiers</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {[
                                ['Photographe', '/for/photographe'],
                                ['Graphiste', '/for/graphiste'],
                                ['Vidéaste', '/for/videaste'],
                                ['Illustrateur', '/for/illustrateur'],
                                ['Wedding Planner', '/for/wedding-planner'],
                                ['Tous les métiers', '/for'],
                            ].map(([l, h]) => <li key={h}><a href={h} className="hover:text-green-400 transition-colors">{l}</a></li>)}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Ressources</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {[
                                ['Tarifs', '/pricing'],
                                ['Calculateur Facture', '/tools/calculateur-facture-photographe'],
                                ['Simulateur TJM', '/tools/simulateur-tarifs-photographe'],
                                ['Alternatives', '/alternatives'],
                                ['Alt. Pixieset', '/alternatives/pixieset-alternative'],
                                ['Alt. Format.com', '/alternatives/format-alternative'],
                            ].map(([l, h]) => <li key={h}><a href={h} className="hover:text-green-400 transition-colors">{l}</a></li>)}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">© 2026 Vanda Studio. Tous droits réservés. Fait avec ❤️ pour les créatifs.</p>
                    <div className="flex gap-6 text-xs text-gray-600">
                        <a href="#" className="hover:text-gray-400">Confidentialité</a>
                        <a href="#" className="hover:text-gray-400">CGU</a>
                        <a href="#" className="hover:text-gray-400">Mentions légales</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default function SeoLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#050B06] text-white font-sans antialiased">
            <SeoNavbar />
            <main className="pt-20">{children}</main>
            <SeoFooter />
        </div>
    )
}
