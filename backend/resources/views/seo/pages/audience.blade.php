<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Pour votre Métier Créatif
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary">Créer mon espace créatif →</a>
            <a href="/pricing" class="btn btn-secondary">Voir les tarifs</a>
        </div>
    </div>
</section>

<section style="padding: 3rem 0 4rem 0;">
    <div class="container" style="max-width: 1100px; margin: 0 auto;">

        {{-- Main App Screenshot --}}
        @if(isset($data['screenshot_url']))
        <div class="glass-card" style="margin-bottom: 3.5rem; padding: 1.25rem; border-color: rgba(76, 175, 80, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <div style="display: flex; gap: 0.4rem;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></div>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">Votre espace Vanda Studio</span>
                <span></span>
            </div>
            <img src="{{ $data['screenshot_url'] }}" alt="{{ $data['h1'] ?? '' }}" style="width: 100%; height: auto; border-radius: 0.75rem; display: block; border: 1px solid var(--surface-border);">
        </div>
        @endif

        {{-- 3 Features --}}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">🌐</div>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Site Vitrine & Portfolio</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">Mettez en scène vos réalisations dans une vitrine moderne, optimisée pour Google et tous les écrans.</p>
            </div>
            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">🔒</div>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Espaces Clients Sécurisés</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">Partagez vos livrables de manière confidentielle avec protection par mot de passe ou code PIN.</p>
            </div>
            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">🧾</div>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Devis & Acomptes</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">Générez des factures professionnelles et encaissez des acomptes avant chaque prestation.</p>
            </div>
        </div>

        {{-- Social Proof Screenshot Row --}}
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3.5rem;">
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Création de Galerie Client</div>
                <img src="/assets/screenshots/galerie/cree galerie.png" alt="Créer une galerie client" style="width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem;">
            </div>
            <div class="glass-card" style="padding: 1.25rem;">
                <div style="font-size: 0.8rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Builder Site Vitrine</div>
                <img src="/assets/screenshots/monsite/star creation site.png" alt="Builder site vitrine" style="width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem;">
            </div>
        </div>

        {{-- CTA --}}
        <div class="glass-card" style="text-align: center; padding: 3rem; background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), transparent); border-color: rgba(76, 175, 80, 0.35);">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">Commencez votre essai gratuit</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">30 jours offerts · Sans carte bancaire · Configuration en 10 minutes</p>
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary" style="display: inline-block; padding: 0.9rem 2.5rem; font-weight: 700;">Créer mon studio maintenant</a>
        </div>

    </div>
</section>
