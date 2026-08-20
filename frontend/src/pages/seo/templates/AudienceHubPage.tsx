import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { SeoPageData } from '../seoData'
import { Badge, ScreenshotFrame, GlobalCTA, fadeUp } from './shared'

const AUDIENCES = [
    { icon: '📷', label: 'Photographe', href: '/for/photographe', desc: 'Galeries HD & facturation de séances' },
    { icon: '🎨', label: 'Graphiste & Designer', href: '/for/graphiste', desc: 'Portfolio & devis d\'identité visuelle' },
    { icon: '🎬', label: 'Vidéaste', href: '/for/videaste', desc: 'Showreel & acomptes de tournage' },
    { icon: '✏️', label: 'Illustrateur', href: '/for/illustrateur', desc: 'Art prints & commandes personnalisées' },
    { icon: '💄', label: 'Maquilleur (MUA)', href: '/for/maquilleur', desc: 'Portfolio beauté & réservations' },
    { icon: '💍', label: 'Wedding Planner', href: '/for/wedding-planner', desc: 'Packages mariage & échéanciers' },
    { icon: '🏛️', label: "Architecte d'Intérieur", href: '/for/architecte-interieur', desc: 'Rendus 3D & honoraires' },
]

export default function AudienceHubPage({ page }: { page: SeoPageData }) {
    return (
        <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.07),transparent_60%)]" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div {...fadeUp}>
                        {page.badge && <Badge text={page.badge} />}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">{page.h1}</h1>
                        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">{page.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            {/* Audience Cards Grid */}
            <section className="px-4 pb-16">
                <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {AUDIENCES.map((a, i) => (
                        <motion.a key={a.href} href={a.href}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            className="bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/5 rounded-2xl p-6 transition-all group">
                            <div className="text-3xl mb-3">{a.icon}</div>
                            <div className="flex items-center justify-between mb-1">
                                <h2 className="font-bold text-white group-hover:text-green-400 transition-colors text-base">{a.label}</h2>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-all group-hover:translate-x-1" />
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Screenshot */}
            {page.screenshotPrimary && (
                <section className="py-10 px-4 bg-white/[0.02]">
                    <motion.div {...fadeUp} className="max-w-3xl mx-auto">
                        <p className="text-center text-xs font-bold uppercase tracking-widest text-green-400/70 mb-5">Aperçu de l'application</p>
                        <ScreenshotFrame src={page.screenshotPrimary} alt="Vanda Studio Dashboard" label="app.vanda-studio.org/dashboard" />
                    </motion.div>
                </section>
            )}

            <GlobalCTA />
        </>
    )
}
