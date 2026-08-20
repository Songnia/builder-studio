import { motion } from 'framer-motion'
import type { SeoPageData } from '../seoData'
import { Badge, ScreenshotFrame, HeroCTA, GlobalCTA, RelatedLinks, fadeUp } from './shared'

const ROWS = [
    ['Builder Site Vitrine No-Code', '✓ Inclus (10 min)', '✓ Partiel'],
    ['Galeries Clients & Code PIN', '✓ Inclus', '✓ Inclus'],
    ['Générateur Devis & Factures PDF', '✓ Natif & Intégré', '✗ Outil externe'],
    ['Paiement Mobile Money (FCFA)', '✓ Nativement (Maketou)', '✗ Non disponible'],
    ['Tarification en FCFA', '✓ Natif', '✗ USD/EUR uniquement'],
    ['Essai Gratuit sans Carte', '✓ 30 jours', '14 jours'],
]

export default function AlternativePage({ page }: { page: SeoPageData }) {
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
                        <HeroCTA label="Commencer maintenant" centered />
                    </motion.div>
                </div>
            </section>

            {/* Visual Comparison */}
            <section className="px-4 pb-14">
                <motion.div {...fadeUp} className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-green-500/30 bg-[#111827] overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 bg-green-500/10 border-b border-green-500/20">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm font-bold text-green-400">Vanda Studio</span>
                        </div>
                        {page.screenshotPrimary && (
                            <img src={page.screenshotPrimary} alt="Vanda Studio" className="w-full h-52 object-cover" />
                        )}
                        <div className="p-4 text-center text-xs text-green-400 font-bold">
                            ✓ Galeries + Facturation + Mobile Money — tout intégré
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#111827] overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/5">
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                            <span className="text-sm font-bold text-gray-400">{page.competitorName}</span>
                        </div>
                        <div className="w-full h-52 bg-white/3 flex items-center justify-center flex-col gap-3">
                            <div className="text-4xl opacity-20">📷</div>
                            <div className="text-sm text-gray-600">Fonctionnalités limitées</div>
                        </div>
                        <div className="p-4 text-center text-xs text-red-400 font-bold">
                            ✗ Sans facturation · Sans Mobile Money · Sans FCFA
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Comparison Table */}
            <section className="py-10 px-4 bg-white/[0.02]">
                <motion.div {...fadeUp} className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Tableau Comparatif</h2>
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-5 py-4 text-sm text-gray-400">Fonctionnalité</th>
                                    <th className="px-5 py-4 text-sm text-green-400">Vanda Studio</th>
                                    <th className="px-5 py-4 text-sm text-gray-500">{page.competitorName}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map(([feat, vs, alt]) => (
                                    <tr key={feat} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-white">{feat}</td>
                                        <td className="px-5 py-3.5 text-sm text-green-400 font-semibold">{vs}</td>
                                        <td className="px-5 py-3.5 text-sm text-red-400">{alt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </section>

            {/* Screenshots row */}
            {page.screenshotSecondary && (
                <section className="py-12 px-4">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                        <motion.div {...fadeUp}>
                            <p className="text-xs text-green-400 font-bold mb-3">Galerie Client Vanda</p>
                            {page.screenshotPrimary && <ScreenshotFrame src={page.screenshotPrimary} alt="Galerie Vanda Studio" />}
                        </motion.div>
                        <motion.div {...fadeUp}>
                            <p className="text-xs text-green-400 font-bold mb-3">Facturation Intégrée</p>
                            <ScreenshotFrame src={page.screenshotSecondary} alt="Facturation Vanda Studio" />
                        </motion.div>
                    </div>
                </section>
            )}

            <GlobalCTA />
            <RelatedLinks current={page.path} />
        </>
    )
}
