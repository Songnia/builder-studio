<section class="hero">
    <div class="container">
        <div style="display: inline-block; padding: 0.35rem 1rem; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 2rem; color: var(--accent-green); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem;">
            Template & Modèle Prêt à l'emploi
        </div>
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
        
        <div style="margin-top: 2rem;">
            <a href="https://app.vanda-studio.org/auth/register" class="btn btn-primary" style="padding: 0.85rem 2rem; font-size: 1.1rem; font-weight: 700;">
                Utiliser ce Template Gratuitement
            </a>
        </div>
    </div>
</section>

<section style="padding: 4rem 0;">
    <div class="container">
        <!-- Main Screenshot Preview -->
        <div class="glass-card" style="margin-bottom: 4rem; padding: 1.5rem; border-color: rgba(76, 175, 80, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-weight: 700; color: var(--accent-green);">Aperçu Live du Builder Vanda Studio</span>
                <span style="font-size: 0.85rem; color: var(--text-muted);">Responsive Desktop & Mobile</span>
            </div>
            <img src="/assets/screenshots/monsite/step10-preview site.png" alt="Aperçu Template Vanda Studio" style="width: 100%; height: auto; border-radius: 0.75rem; display: block; border: 1px solid var(--surface-border);">
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-green); margin-bottom: 1.25rem;">
                    🎨
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">100% Personnalisable</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Adaptez les couleurs, les polices, les catégories de galeries et la mise en page sans écrire de code.</p>
            </div>

            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-green); margin-bottom: 1.25rem;">
                    ⚡
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Chargement Ultra Rapide</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Optimisé pour le référencement Google et les connexions mobiles rapide. Vos visuels s'affichent instantanément.</p>
            </div>

            <div class="glass-card" style="padding: 2rem;">
                <div style="width: 3rem; height: 3rem; border-radius: 0.75rem; background: rgba(76, 175, 80, 0.2); display: flex; align-items: center; justify-content: center; color: var(--accent-green); margin-bottom: 1.25rem;">
                    🔒
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">Galerie Clients & Factures</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Intègre nativement les boutons de réservation, d'accès aux galeries privées et la facturation directe.</p>
            </div>
        </div>
    </div>
</section>
