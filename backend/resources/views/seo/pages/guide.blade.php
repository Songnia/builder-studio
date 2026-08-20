<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Tutoriel & Guide Pratique
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
    </div>
</section>

<section style="padding: 3rem 0;">
    <div class="container" style="max-width: 900px; margin: 0 auto;">
        
        <!-- App Screenshot Highlight -->
        <div class="glass-card" style="margin-bottom: 3rem; overflow: hidden; padding: 1.5rem; border-color: rgba(76, 175, 80, 0.3);">
            <div style="font-size: 0.875rem; color: var(--accent-green); font-weight: 700; margin-bottom: 0.75rem;">Aperçu Interface Vanda Studio</div>
            <img src="/assets/screenshots/dashboard.png" alt="Tutoriel Vanda Studio" style="width: 100%; height: auto; border-radius: 0.75rem; display: block; border: 1px solid var(--surface-border);">
        </div>

        <!-- Step by Step Content -->
        <div class="glass-card" style="padding: 2.5rem; margin-bottom: 3rem;">
            <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 1.5rem;" class="gradient-text">Étapes à suivre pas à pas</h2>
            
            <div style="display: grid; gap: 2rem;">
                <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #4caf50; color: #000; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</div>
                    <div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Configuration initiale de votre espace</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">Créez votre compte créatif sur Vanda Studio. Personnalisez votre profil avec votre logo, vos coordonnées et votre devise locale (FCFA/EUR).</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #4caf50; color: #000; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</div>
                    <div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Création & Personnalisation</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">Suivez le guide interactif pour paramétrer votre premier livrable (site, galerie client ou devis-facture).</p>
                    </div>
                </div>

                <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                    <div style="width: 2.5rem; height: 2.5rem; border-radius: 50%; background: #4caf50; color: #000; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</div>
                    <div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">Partage & Encaissement</h3>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">Partagez le lien sécurisé avec vos clients et recevez vos acomptes directement par carte bancaire ou Mobile Money.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Section -->
        <div class="glass-card" style="padding: 2.5rem;">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Questions Fréquentes</h2>
            <div style="display: grid; gap: 1.25rem;">
                <div>
                    <h4 style="font-size: 1rem; font-weight: 700; color: var(--accent-green); margin-bottom: 0.25rem;">Est-ce que je peux essayer gratuitement ?</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Oui, vous bénéficiez de 30 jours d'essai gratuit sans carte bancaire requis.</p>
                </div>
                <div>
                    <h4 style="font-size: 1rem; font-weight: 700; color: var(--accent-green); margin-bottom: 0.25rem;">Quels sont les modes de paiement supportés ?</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Nous supportons les cartes de crédit internationales et les paiements locaux Mobile Money via notre gateway Maketou.</p>
                </div>
            </div>
        </div>

    </div>
</section>
