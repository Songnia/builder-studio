import { motion } from 'framer-motion'
import type { SeoPageData } from '../seoData'
import { Badge, BulletList, ScreenshotFrame, HeroCTA, GlobalCTA, RelatedLinks, fadeUp } from './shared'

const STEPS = [
    { n: '01', title: 'Prise de contact & Devis', desc: 'Formulaire intégré à votre site vitrine et génération de devis automatique.' },
    { n: '02', title: 'Acompte & Réservation', desc: 'Paiement immédiat de l\'acompte par carte ou Mobile Money pour confirmer.' },
    { n: '03', title: 'Livraison & Solde', desc: 'Galerie client privée, déblocage des fichiers après règlement du solde.' },
]

export default function SolutionPage({ page }: { page: SeoPageData }) {
    return (
        <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.07),transparent_60%)]" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div {...fadeUp}>
                        {page.badge && <Badge text={page.badge} />}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">{page.h1}</h1>
                        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">{page.subtitle}</p>
                        <HeroCTA label="Commencer maintenant" centered />
                    </motion.div>
                </div>
            </section>

            {/* Main screenshot */}
            {page.screenshotPrimary && (
                <section className="px-4 pb-16">
                    <motion.div {...fadeUp} className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute -inset-6 bg-green-500/8 blur-3xl rounded-3xl" />
                            <ScreenshotFrame src={page.screenshotPrimary} alt={page.h1} label="app.vanda-studio.org" />
                        </div>
                    </motion.div>
                </section>
            )}

            {/* 3-step workflow */}
            <section className="py-16 px-4 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto">
                    <motion.h2 {...fadeUp} className="text-2xl font-bold text-white text-center mb-10">
                        Votre workflow complet en 3 étapes
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map((s, i) => (
                            <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all">
                                <div className="w-10 h-10 rounded-full bg-green-500 text-black font-extrabold flex items-center justify-center text-sm mb-4">{s.n}</div>
                                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* bullets + secondary screenshot */}
            {(page.bullets || page.screenshotSecondary) && (
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        {page.bullets && (
                            <motion.div {...fadeUp}>
                                <h2 className="text-2xl font-bold text-white mb-6">Tout ce dont vous avez besoin</h2>
                                <BulletList items={page.bullets} />
                            </motion.div>
                        )}
                        {page.screenshotSecondary && (
                            <motion.div {...fadeUp}>
                                <ScreenshotFrame src={page.screenshotSecondary} alt={page.h1} />
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            <GlobalCTA />
            <RelatedLinks current={page.path} />
        </>
    )
}
