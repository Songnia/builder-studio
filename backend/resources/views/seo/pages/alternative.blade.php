<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Comparatif & Alternative
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary">Essayer Vanda Studio Gratuitement →</a>
            <a href="/alternatives" class="btn btn-secondary">Voir tous les comparatifs</a>
        </div>
    </div>
</section>

<section style="padding: 3.5rem 0 4.5rem 0;">
    <div class="container" style="max-width: 950px; margin: 0 auto;">

        {{-- Screenshots Side by Side Concept --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; align-items: center;">
            <div class="glass-card" style="padding: 1.25rem; border-color: rgba(76, 175, 80, 0.35);">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem; text-align: center;">Vanda Studio</div>
                <img src="/assets/screenshots/dashboard.png" alt="Vanda Studio Dashboard" style="width: 100%; height: 160px; object-fit: cover; border-radius: 0.5rem;">
                <div style="text-align: center; margin-top: 0.75rem; font-size: 0.85rem; color: var(--accent-green); font-weight: 600;">✓ Tout-en-un · Factures · Paiements · Galeries</div>
            </div>
            <div class="glass-card" style="padding: 1.25rem; border-color: rgba(255,255,255,0.05);">
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.75rem; text-align: center;">Solution Classique</div>
                <div style="width: 100%; height: 160px; border-radius: 0.5rem; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;">
                    <div style="font-size: 2.5rem; opacity: 0.3;">📷</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Fonctionnalités limitées</div>
                </div>
                <div style="text-align: center; margin-top: 0.75rem; font-size: 0.85rem; color: #ef4444; font-weight: 600;">✗ Sans facturation · Sans Mobile Money</div>
            </div>
        </div>

        {{-- Comparison Table --}}
        <div class="glass-card" style="padding: 2.5rem; margin-bottom: 3rem; overflow: hidden;">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 2rem;" class="gradient-text">Tableau Comparatif des Fonctionnalités</h2>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; color: #fff;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--surface-border);">
                            <th style="padding: 1rem 0.75rem; font-size: 0.95rem;">Fonctionnalité</th>
                            <th style="padding: 1rem 0.75rem; color: var(--accent-green); font-size: 0.95rem;">Vanda Studio</th>
                            <th style="padding: 1rem 0.75rem; color: var(--text-muted); font-size: 0.95rem;">Alternative</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--surface-border);">
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Builder Site Vitrine No-Code</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Inclus (10 min)</td>
                            <td style="padding: 1rem 0.75rem; color: var(--text-muted);">✓ Partiel</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--surface-border);">
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Galeries Clients Privées & Code PIN</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Inclus</td>
                            <td style="padding: 1rem 0.75rem; color: var(--text-muted);">✓ Inclus</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--surface-border);">
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Générateur Devis & Factures PDF</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Inclus & Intégré</td>
                            <td style="padding: 1rem 0.75rem; color: #ef4444; font-weight: 600;">✗ Outil externe requis</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--surface-border);">
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Paiement Mobile Money & Acomptes</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Nativement (Maketou)</td>
                            <td style="padding: 1rem 0.75rem; color: #ef4444; font-weight: 600;">✗ Stripe/PayPal uniquement</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--surface-border);">
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Tarification en FCFA</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Nativement</td>
                            <td style="padding: 1rem 0.75rem; color: #ef4444; font-weight: 600;">✗ USD/EUR seulement</td>
                        </tr>
                        <tr>
                            <td style="padding: 1rem 0.75rem; font-size: 0.95rem;">Essai Gratuit sans Carte</td>
                            <td style="padding: 1rem 0.75rem; color: var(--accent-green); font-weight: 700;">✓ 30 jours</td>
                            <td style="padding: 1rem 0.75rem; color: var(--text-muted);">14 jours</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Screenshots --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Galeries Livrables</div>
                <img src="/assets/screenshots/galerie/Partager la galerie.png" alt="Galeries Vanda Studio" style="width: 100%; height: 145px; object-fit: cover; border-radius: 0.5rem;">
            </div>
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Créer une Facture</div>
                <img src="/assets/screenshots/facturation/create facture.png" alt="Facturation Vanda Studio" style="width: 100%; height: 145px; object-fit: cover; border-radius: 0.5rem;">
            </div>
        </div>

        {{-- CTA --}}
        <div class="glass-card" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), transparent); border-color: rgba(76, 175, 80, 0.35);">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">Faites le bon choix dès aujourd'hui</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Essai gratuit 30 jours · Sans carte bancaire · Configuré en 10 minutes</p>
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary" style="display: inline-block; padding: 0.9rem 2.5rem; font-weight: 700;">Essayer Vanda Studio</a>
        </div>

    </div>
</section>
