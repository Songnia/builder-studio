import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { SeoPageData } from '../seoData'
import { Badge, ScreenshotFrame, GlobalCTA, fadeUp } from './shared'

const ALTERNATIVES = [
    { name: 'Pixieset', href: '/alternatives/pixieset-alternative', desc: 'Pourquoi les créatifs passent de Pixieset à Vanda Studio pour la facturation et les paiements Mobile Money.' },
    { name: 'Format.com', href: '/alternatives/format-alternative', desc: 'Découvrez pourquoi Vanda Studio remplace avantageusement Format.com avec des galeries privées et la monnaie locale.' },
]

export default function AlternativesHubPage({ page }: { page: SeoPageData }) {
    return (
        <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.07),transparent_60%)]" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div {...fadeUp}>
                        {page.badge && <Badge text={page.badge} />}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">{page.h1}</h1>
                        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">{page.subtitle}</p>
                    </motion.div>
                </div>
            </section>

            {/* Alternatives list */}
            <section className="px-4 pb-16">
                <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
                    {ALTERNATIVES.map((alt, i) => (
                        <motion.a key={alt.href} href={alt.href}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/5 rounded-2xl p-6 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">VS {alt.name}</h2>
                                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-green-400 transition-all group-hover:translate-x-1" />
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">{alt.desc}</p>
                            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                Voir le comparatif détaillé →
                            </span>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Screenshot */}
            {page.screenshotPrimary && (
                <section className="py-12 px-4 bg-white/[0.02]">
                    <motion.div {...fadeUp} className="max-w-4xl mx-auto">
                        <p className="text-center text-xs font-bold uppercase tracking-widest text-green-400/70 mb-5">Interface Vanda Studio</p>
                        <ScreenshotFrame src={page.screenshotPrimary} alt="Vanda Studio Dashboard" label="app.vanda-studio.org/dashboard" />
                    </motion.div>
                </section>
            )}

            <GlobalCTA />
        </>
    )
}
