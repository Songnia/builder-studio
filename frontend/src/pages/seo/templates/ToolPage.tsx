import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, Check } from 'lucide-react'
import type { SeoPageData } from '../seoData'
import { Badge, ScreenshotFrame, GlobalCTA, RelatedLinks, ADMIN_URL, fadeUp } from './shared'

function InvoiceCalculator({ page }: { page: SeoPageData }) {
    const [amount, setAmount] = useState(150000)
    const [depositPct, setDepositPct] = useState(30)
    const deposit = Math.round(amount * depositPct / 100)
    const balance = amount - deposit

    return (
        <section className="py-10 px-4">
            <motion.div {...fadeUp} className="max-w-2xl mx-auto">
                <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Calculateur de Devis & Acompte</h2>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Montant total de la prestation (FCFA)
                            </label>
                            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold text-lg focus:outline-none focus:border-green-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                Acompte à la commande : <span className="text-green-400">{depositPct}%</span>
                            </label>
                            <input type="range" min={0} max={100} step={5} value={depositPct}
                                onChange={e => setDepositPct(Number(e.target.value))}
                                className="w-full accent-green-500 cursor-pointer" />
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>0%</span><span>50%</span><span>100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-6 bg-green-500/8 border border-green-500/20 rounded-2xl mb-8">
                        <div>
                            <div className="text-xs text-gray-400 font-semibold mb-1">Acompte à percevoir</div>
                            <div className="text-3xl font-extrabold text-green-400">{deposit.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 mt-0.5">FCFA</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 font-semibold mb-1">Solde à la livraison</div>
                            <div className="text-3xl font-extrabold text-white">{balance.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 mt-0.5">FCFA</div>
                        </div>
                    </div>

                    <a href={`${ADMIN_URL}/auth/register`}
                        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                        {page.ctaText || 'Générer une vraie facture dans Vanda Studio'}
                        <ArrowRight className="w-5 h-5" />
                    </a>

                    <div className="mt-4 flex justify-center gap-5 text-xs text-gray-500">
                        {['Gratuit', 'Sans inscription', 'PDF instantané'].map(t => (
                            <span key={t} className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" />{t}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

function RateSimulator({ page }: { page: SeoPageData }) {
    const [seances, setSeances] = useState(8)
    const [prixSeance, setPrixSeance] = useState(80000)
    const ca = seances * prixSeance
    const tjm = Math.round(prixSeance / 2)

    return (
        <section className="py-10 px-4">
            <motion.div {...fadeUp} className="max-w-2xl mx-auto">
                <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Simulateur de Tarifs & TJM</h2>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Séances par mois : <span className="text-green-400">{seances}</span>
                            </label>
                            <input type="range" min={1} max={30} value={seances} onChange={e => setSeances(Number(e.target.value))}
                                className="w-full accent-green-500 cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Prix moyen par séance (FCFA)
                            </label>
                            <input type="number" value={prixSeance} onChange={e => setPrixSeance(Number(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold text-lg focus:outline-none focus:border-green-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-6 bg-green-500/8 border border-green-500/20 rounded-2xl mb-8">
                        <div>
                            <div className="text-xs text-gray-400 font-semibold mb-1">CA mensuel estimé</div>
                            <div className="text-3xl font-extrabold text-green-400">{ca.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 mt-0.5">FCFA / mois</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 font-semibold mb-1">TJM estimé</div>
                            <div className="text-3xl font-extrabold text-white">{tjm.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 mt-0.5">FCFA / jour</div>
                        </div>
                    </div>

                    <a href={`${ADMIN_URL}/auth/register`}
                        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                        {page.ctaText || 'Créer mes factures avec Vanda Studio'}
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </motion.div>
        </section>
    )
}

export default function ToolPage({ page }: { page: SeoPageData }) {
    return (
        <>
            {/* Hero */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.07),transparent_60%)]" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div {...fadeUp}>
                        {page.badge && <Badge text={page.badge} />}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">{page.h1}</h1>
                        <p className="text-lg text-gray-400 mb-4 leading-relaxed">{page.subtitle}</p>
                        <p className="text-sm text-green-400 font-semibold">↓ Utilisez l'outil ci-dessous — 100% gratuit</p>
                    </motion.div>
                </div>
            </section>

            {/* Tool */}
            {page.toolType === 'invoice_calculator' ? <InvoiceCalculator page={page} /> : <RateSimulator page={page} />}

            {/* App Screenshots */}
            {page.screenshotPrimary && (
                <section className="py-12 px-4 bg-white/[0.02]">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                        <motion.div {...fadeUp}>
                            <p className="text-xs text-green-400 font-bold mb-3">Créer une Facture</p>
                            <ScreenshotFrame src={page.screenshotPrimary} alt="Créer une facture Vanda Studio" />
                        </motion.div>
                        {page.screenshotSecondary && (
                            <motion.div {...fadeUp}>
                                <p className="text-xs text-green-400 font-bold mb-3">Tableau des Factures</p>
                                <ScreenshotFrame src={page.screenshotSecondary} alt="Liste des factures" />
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
