<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Fonctionnalité Vanda Studio
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
        <div style="margin-top: 2rem;">
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary">Tester gratuitement 30 jours →</a>
        </div>
    </div>
</section>

<section style="padding: 4rem 0;">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">

        {{-- App Screenshot --}}
        @if(isset($data['screenshot_url']))
        <div class="glass-card" style="margin-bottom: 3.5rem; padding: 1.5rem; border-color: rgba(76, 175, 80, 0.3); overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-weight: 700; color: var(--accent-green); font-size: 0.875rem;">Aperçu dans l'application</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">app.vanda-studio.org</span>
            </div>
            <img src="{{ $data['screenshot_url'] }}" alt="{{ $data['h1'] ?? '' }}" style="width: 100%; height: auto; border-radius: 0.75rem; display: block; border: 1px solid var(--surface-border);">
        </div>
        @endif

        {{-- Feature Details Grid --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 3rem;" class="glass-card">
            <div>
                <h2 style="font-size: 1.875rem; font-weight: 800; margin-bottom: 1.5rem;" class="gradient-text">Conçu spécifiquement pour les créatifs</h2>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1.05rem; line-height: 1.7;">
                    Simplifiez chaque étape de votre relation client avec des outils visuels fluides et professionnels. Que vous soyez photographe, graphiste, vidéaste ou illustrateur, Vanda Studio centralise vos besoins sans complexité inutile.
                </p>
                <ul style="list-style: none; display: grid; gap: 0.85rem; color: var(--text-main);">
                    <li style="display: flex; gap: 0.75rem; align-items: flex-start;"><span style="color: var(--accent-green); font-weight: 700;">✓</span> Interface intuitive sans compétences techniques requises</li>
                    <li style="display: flex; gap: 0.75rem; align-items: flex-start;"><span style="color: var(--accent-green); font-weight: 700;">✓</span> Personnalisation totale à votre identité visuelle</li>
                    <li style="display: flex; gap: 0.75rem; align-items: flex-start;"><span style="color: var(--accent-green); font-weight: 700;">✓</span> Paiements par carte et Mobile Money intégrés</li>
                    <li style="display: flex; gap: 0.75rem; align-items: flex-start;"><span style="color: var(--accent-green); font-weight: 700;">✓</span> Accès immédiat — essai gratuit 30 jours</li>
                </ul>
            </div>
            <div style="display: grid; gap: 1.25rem;">
                <div style="background: rgba(76, 175, 80, 0.05); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(76, 175, 80, 0.2);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">Photographes & Vidéastes</div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">Galeries livrables & facturation de séance</div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.05); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(76, 175, 80, 0.2);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎨</div>
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">Graphistes & Illustrateurs</div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">Portfolio et devis d'identité visuelle</div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.05); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(76, 175, 80, 0.2);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💼</div>
                    <div style="font-weight: 700; margin-bottom: 0.25rem;">Créatifs B2B & Freelances</div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">Devis conformes et suivi des règlements</div>
                </div>
            </div>
        </div>

        {{-- Secondary Screenshots: Galerie & Facturation --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
            <div class="glass-card" style="padding: 1.25rem; border-color: rgba(76, 175, 80, 0.2);">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Livraison de Galeries</div>
                <img src="/assets/screenshots/galerie/Partager la galerie.png" alt="Partager galerie client" style="width: 100%; height: 160px; object-fit: cover; border-radius: 0.5rem;">
            </div>
            <div class="glass-card" style="padding: 1.25rem; border-color: rgba(76, 175, 80, 0.2);">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Facturation & Devis</div>
                <img src="/assets/screenshots/facturation/create facture.png" alt="Créer une facture" style="width: 100%; height: 160px; object-fit: cover; border-radius: 0.5rem;">
            </div>
        </div>

        {{-- CTA Banner --}}
        <div class="glass-card" style="text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.03)); border-color: rgba(76, 175, 80, 0.4);">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">Prêt à simplifier votre activité ?</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">Rejoignez des centaines de créatifs qui font confiance à Vanda Studio pour gérer leur studio professionnel.</p>
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary" style="display: inline-block; padding: 0.9rem 2.25rem; font-size: 1rem; font-weight: 700;">Créer mon studio maintenant</a>
            <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">Essai gratuit 30 jours · Sans carte bancaire</div>
        </div>

    </div>
</section>
