<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Solution Complète
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary">Lancer ma solution studio →</a>
            <a href="/pricing" class="btn btn-secondary">Voir les tarifs</a>
        </div>
    </div>
</section>

<section style="padding: 3rem 0 4.5rem 0;">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">

        {{-- Dashboard Screenshot Hero --}}
        <div class="glass-card" style="margin-bottom: 3.5rem; padding: 1.5rem; border-color: rgba(76, 175, 80, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; gap: 0.4rem;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></div>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">app.vanda-studio.org/dashboard</span>
                <span></span>
            </div>
            <img src="/assets/screenshots/dashboard.png" alt="Tableau de bord Vanda Studio" style="width: 100%; height: auto; border-radius: 0.75rem; display: block; border: 1px solid var(--surface-border);">
        </div>

        {{-- 3-Step Workflow --}}
        <div class="glass-card" style="padding: 2.5rem; margin-bottom: 3rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 2rem;" class="gradient-text">Votre workflow complet en 3 étapes</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
                <div style="border-left: 3px solid var(--accent-green); padding-left: 1.25rem;">
                    <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 0.4rem;">1. Prise de Contact & Devis</strong>
                    <span style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">Formulaire de contact intégré à votre site vitrine et génération de devis automatique.</span>
                </div>
                <div style="border-left: 3px solid var(--accent-green); padding-left: 1.25rem;">
                    <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 0.4rem;">2. Acompte & Réservation</strong>
                    <span style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">Paiement immédiat de l'acompte en ligne par carte ou Mobile Money pour confirmer la prestation.</span>
                </div>
                <div style="border-left: 3px solid var(--accent-green); padding-left: 1.25rem;">
                    <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 0.4rem;">3. Livraison & Solde</strong>
                    <span style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">Espace client privé sécurisé et déblocage des fichiers après règlement du solde.</span>
                </div>
            </div>
        </div>

        {{-- Screenshots grid --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3.5rem;">
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Partage & Livraison de Galeries</div>
                <img src="/assets/screenshots/galerie/partager-galerie.png" alt="Partager galerie client" style="width: 100%; height: 155px; object-fit: cover; border-radius: 0.5rem;">
            </div>
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Facturation & Suivi Acomptes</div>
                <img src="/assets/screenshots/facturation/facturation-list.png" alt="Liste des factures" style="width: 100%; height: 155px; object-fit: cover; border-radius: 0.5rem;">
            </div>
        </div>

        {{-- CTA --}}
        <div class="glass-card" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), transparent); border-color: rgba(76, 175, 80, 0.35);">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">Démarrez dès aujourd'hui</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Essai gratuit 30 jours — Configuration en 10 minutes — Sans carte bancaire</p>
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary" style="display: inline-block; padding: 0.9rem 2.5rem; font-weight: 700;">Créer mon studio maintenant</a>
        </div>

    </div>
</section>
