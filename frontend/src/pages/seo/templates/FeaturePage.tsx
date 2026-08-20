import { motion } from 'framer-motion'
import type { SeoPageData } from '../seoData'
import { Badge, BulletList, ScreenshotFrame, HeroCTA, GlobalCTA, RelatedLinks, fadeUp } from './shared'

export default function FeaturePage({ page }: { page: SeoPageData }) {
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
                        <HeroCTA />
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

            {/* Secondary screenshot + stats */}
            {page.screenshotSecondary && (
                <section className="py-12 px-4 bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                        <motion.div {...fadeUp}>
                            <ScreenshotFrame src={page.screenshotSecondary} alt={`${page.h1} — aperçu`} />
                        </motion.div>
                        <motion.div {...fadeUp} className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Intégré à votre workflow créatif</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Vanda Studio s'adapte à votre flux de travail existant. Aucune migration complexe, aucune formation nécessaire. Opérationnel en moins de 10 minutes.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { n: '10 min', l: 'Configuration' },
                                    { n: '30j', l: 'Essai gratuit' },
                                    { n: '100%', l: 'No-code' },
                                    { n: 'FCFA', l: 'Tarification native' },
                                ].map(s => (
                                    <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-extrabold text-green-400">{s.n}</div>
                                        <div className="text-xs text-gray-500 mt-1">{s.l}</div>
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
