import { motion } from 'framer-motion'
import type { SeoPageData } from '../seoData'
import { Badge, BulletList, ScreenshotFrame, HeroCTA, GlobalCTA, RelatedLinks, fadeUp } from './shared'
import { Layers, Shield, Zap } from 'lucide-react'

const FEATURES = [
    {
        icon: Layers,
        title: 'Site Vitrine No-Code',
        desc: 'Créez un site vitrine professionnel avec vos galeries, tarifs et témoignages en 10 minutes.',
        image: '/assets/screenshots/site-internet-danou-studio.png',
        alt: 'Site Vitrine No-Code Danou Studio'
    },
    {
        icon: Shield,
        title: 'Galeries Clients Sécurisées',
        desc: 'Protégez vos fichiers par code PIN, permettez la sélection des favoris et le téléchargement HD.',
        image: '/assets/screenshots/gallerie-image-soutenance.png',
        alt: 'Galeries Image Soutenance'
    },
    {
        icon: Zap,
        title: 'Facturation & Acomptes',
        desc: 'Émettez des devis et factures, encaissez par carte ou Mobile Money instantanément.',
        image: '/assets/screenshots/facture-danou-studio.png',
        alt: 'Facture Danou Studio'
    },
]

export default function AudiencePage({ page }: { page: SeoPageData }) {
    return (
        <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.07),transparent_60%)]" />
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div {...fadeUp}>
                        {page.badge && <Badge text={page.badge} />}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">{page.h1}</h1>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">{page.subtitle}</p>
                        {page.bullets && (
                            <div className="mb-10">
                                <BulletList items={page.bullets} />
                            </div>
                        )}
                        <HeroCTA label="Commencer maintenant" />
                    </motion.div>

                    {page.screenshotPrimary && (
                        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-green-500/10 rounded-3xl blur-3xl" />
                                <div className="relative">
                                    <ScreenshotFrame src={page.screenshotPrimary} alt={page.h1} label="app.vanda-studio.org" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 3 core features */}
            <section className="py-14 px-4 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto">
                    <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
                        Tout ce qu'il vous faut, en un seul endroit
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all flex flex-col justify-between group">
                                <div className="mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <f.icon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                                </div>
                                <div className="mt-auto overflow-hidden rounded-xl">
                                    <ScreenshotFrame src={f.image} alt={f.alt} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Secondary screenshot */}
            {page.screenshotSecondary && (
                <section className="py-14 px-4">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                        <motion.div {...fadeUp}>
                            <ScreenshotFrame src={page.screenshotSecondary} alt={page.h1} />
                        </motion.div>
                        <motion.div {...fadeUp} className="space-y-5">
                            <h2 className="text-2xl font-bold text-white">Démarrez en 10 minutes</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Inscription gratuite, configuration guidée étape par étape, et votre studio professionnel est en ligne. Aucune compétence technique requise.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {[['30j', 'Essai gratuit'], ['10min', 'Configuration'], ['0', 'Carte requise'], ['FCFA', 'Monnaie locale']].map(([n, l]) => (
                                    <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                        <div className="text-xl font-extrabold text-green-400">{n}</div>
                                        <div className="text-xs text-gray-500 mt-1">{l}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            <GlobalCTA />
            <RelatedLinks current={page.path} />
        </>
    )
}
