<?php
$plans = [
    [
        'id' => 'starter',
        'name' => 'Starter',
        'tagline' => 'Pour démarrer votre studio en ligne',
        'monthly' => 5000,
        'yearly' => 50000,
        'popular' => false,
        'cta' => 'Commencer gratuitement',
        'description' => "Le plan Starter vous donne les fondations solides pour créer votre présence en ligne : un site vitrine professionnel construit en 10 étapes guidées, un sous-domaine Vanda Studio pour être visible immédiatement, et vos premières galeries clients à livrer par simple lien. Idéal si vous débutez, que vous êtes photographe indépendant ou que vous souhaitez simplement tester la plateforme avant d'investir dans une formule complète.",
        'included' => [
            'Site vitrine complet (builder 10 étapes)',
            'Sous-domaine Vanda Studio',
            'Portfolio avec vos plus belles photos',
            'Livraison de galeries par lien',
            'Facturation simple et devis',
            'Support par e-mail',
        ],
        'not_included' => [
            'Domaine personnalisé',
            'Paiement en ligne (Mobile Money, carte)',
            'Export ZIP des galeries',
            'Sans watermark Vanda Studio',
        ],
        'limits' => [
            "Jusqu'à 50 photos dans le portfolio",
            '3 galeries clients actives en même temps',
            "Marque d'eau Vanda Studio sur les pages publiques",
            'Stockage limité à 5 Go',
            'Paiement en ligne indisponible',
            'Pas de domaine personnalisé',
        ],
        'upsell' => "Passez au plan Pro pour débloquer le domaine personnalisé, la boutique en ligne et la livraison ZIP.",
    ],
    [
        'id' => 'pro',
        'name' => 'Pro',
        'tagline' => 'La formule des photographes qui vivent de leur art',
        'monthly' => 11000,
        'yearly' => 100000,
        'popular' => true,
        'cta' => 'Choisir le plan Pro',
        'description' => "Le plan Pro est conçu pour les créatifs dont la passion est déjà une activité à part entière. Vous obtenez un domaine personnalisé pour afficher votre nom aux yeux du monde, une boutique en ligne avec encaissement Mobile Money et carte en FCFA pour vendre vos prestations et vos photos, et des galeries professionnelles avec export ZIP pour livrer vos séances sans aucune limite de volume. C'est le plan le plus choisi : il transforme votre site vitrine en véritable outil commercial qui travaille pour vous, même la nuit.",
        'included' => [
            'Tout le plan Starter',
            'Domaine personnalisé',
            'Boutique en ligne + paiement Mobile Money & carte (FCFA)',
            'Export ZIP des galeries',
            'Sans watermark Vanda Studio',
            'Photos portfolio illimitées',
            'Galeries clients illimitées',
            'Stockage 100 Go',
        ],
        'not_included' => [
            'API & Webhooks',
            'Support prioritaire',
            'Statistiques avancées',
        ],
        'limits' => [
            'Stockage limité à 100 Go',
            "Pas d'API ni de webhooks pour automatiser",
            "Pas de statistiques avancées",
            'Un seul compte utilisateur',
            'Support prioritaire réservé au plan Studio',
        ],
        'upsell' => "Le plan Studio débloque le stockage illimité, l'API, les statistiques avancées et le support prioritaire 24/7.",
    ],
    [
        'id' => 'studio',
        'name' => 'Studio',
        'tagline' => 'La puissance maximale pour les studios et les agences',
        'monthly' => 25000,
        'yearly' => 250000,
        'popular' => false,
        'cta' => 'Choisir le plan Studio',
        'description' => "Le plan Studio est l'arme absolue pour les studios photo, les agences créatives et les équipes qui produisent à haut volume. Stockage illimité, galeries illimitées, API et webhooks pour brancher vos outils métier, statistiques avancées pour comprendre l'engagement de vos clients et un support prioritaire 24/7 qui répond en quelques minutes. C'est la formule de ceux qui ne veulent plus jamais penser à leurs limites techniques — seulement à créer.",
        'included' => [
            'Tout le plan Pro',
            'Stockage illimité',
            'Galeries clients illimitées',
            'API & Webhooks',
            'Statistiques avancées',
            'Support prioritaire 24/7',
            'Accès anticipé aux nouveautés',
            "Plusieurs comptes d'équipe",
            'Export PDF en masse',
            'White label complet',
        ],
        'not_included' => [],
        'limits' => [
            'Aucune limite de stockage ou de galeries',
            'Réservé aux professionnels à volume élevé',
            'Budget mensuel plus élevé',
        ],
        'upsell' => "Vous êtes au sommet : profitez de toutes les fonctionnalités sans la moindre limite.",
    ],
];

function vanda_format_price($price)
{
    return number_format((float) $price, 0, ',', ' ');
}
?>
<style>
    .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        align-items: stretch;
        max-width: 1200px;
        margin: 0 auto;
    }

    .price-card {
        display: flex;
        flex-direction: column;
        border-radius: 1.25rem;
        padding: 2rem;
        position: relative;
    }

    .price-card.popular {
        border: 1px solid rgba(76, 175, 80, 0.4);
        background: linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(76, 175, 80, 0.12) 100%);
        box-shadow: 0 0 40px rgba(76, 175, 80, 0.15);
        transform: scale(1.03);
    }

    .price-card.regular {
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.03);
    }

    .price-badge {
        position: absolute;
        top: -0.75rem;
        left: 50%;
        transform: translateX(-50%);
        background: #4caf50;
        color: #000;
        font-size: 0.7rem;
        font-weight: 800;
        padding: 0.3rem 0.9rem;
        border-radius: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        white-space: nowrap;
    }

    .price-tagline {
        color: #4caf50;
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .price-description {
        color: var(--text-muted);
        font-size: 0.92rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        min-height: 8rem;
    }

    .price-value {
        font-size: 2.8rem;
        font-weight: 800;
        margin: 1rem 0 0.25rem;
    }

    .price-period {
        font-size: 1rem;
        color: var(--text-muted);
        font-weight: 400;
    }

    .price-save {
        color: #4caf50;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        min-height: 1.2rem;
    }

    .price-cta {
        display: block;
        width: 100%;
        text-align: center;
        font-weight: 700;
        padding: 0.9rem;
        border-radius: 0.75rem;
        text-decoration: none;
        margin: 1rem 0 1.5rem;
        transition: all 0.2s ease;
    }

    .price-cta.primary {
        background: #4caf50;
        color: #000;
    }

    .price-cta.primary:hover {
        background: #66bb6a;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(76, 175, 80, 0.4);
    }

    .price-cta.secondary {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        border: 1px solid var(--surface-border);
    }

    .price-cta.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .price-section-title {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        font-weight: 700;
        margin-bottom: 0.75rem;
    }

    .price-feature {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        font-size: 0.88rem;
        color: #d1d5db;
        margin-bottom: 0.6rem;
        line-height: 1.4;
    }

    .price-feature .icon {
        flex-shrink: 0;
        margin-top: 0.1rem;
    }

    .price-feature.included .icon {
        color: #4caf50;
    }

    .price-feature.excluded {
        color: #6b7280;
    }

    .price-feature.excluded .icon {
        color: #4b5563;
    }

    .price-limits {
        color: #6b7280;
        font-size: 0.85rem;
        line-height: 1.5;
        margin-top: 1rem;
        flex-grow: 1;
    }

    .price-limits li {
        margin-bottom: 0.5rem;
        list-style: none;
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .price-upsell {
        margin-top: 1rem;
        padding: 0.8rem 1rem;
        border-radius: 0.75rem;
        background: rgba(76, 175, 80, 0.08);
        border: 1px solid rgba(76, 175, 80, 0.2);
        font-size: 0.82rem;
        color: #86efac;
        line-height: 1.5;
    }

    .pricing-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2.5rem;
        font-size: 0.95rem;
    }

    .pricing-toggle .pill {
        padding: 0.25rem 0.6rem;
        border-radius: 1rem;
        background: rgba(76, 175, 80, 0.15);
        color: #4caf50;
        font-size: 0.75rem;
        font-weight: 700;
        margin-left: 0.4rem;
    }

    .pricing-toggle button {
        position: relative;
        width: 4rem;
        height: 2rem;
        border-radius: 1rem;
        border: none;
        background: #374151;
        cursor: pointer;
        transition: background 0.3s;
    }

    .pricing-toggle button.yearly {
        background: #4caf50;
    }

    .pricing-toggle button span {
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.3s;
    }

    .pricing-toggle button.yearly span {
        transform: translateX(2rem);
    }
</style>

<section class="hero">
    <div class="container">
        <h1>Des tarifs <span class="gradient-text">simples, transparents</span> et pensés pour évoluer</h1>
        <p>Commencez par un essai gratuit de 30 jours, sans carte bancaire et sans aucun engagement. Quand votre activité grandit, la plateforme grandit avec vous.</p>

        <div class="pricing-toggle">
            <span class="toggle-label" id="toggle-monthly">Mensuel</span>
            <button id="billing-toggle" aria-label="Basculer entre facturation mensuelle et annuelle" class="">
                <span></span>
            </button>
            <span class="toggle-label" id="toggle-yearly">Annuel <span class="pill">Économisez 24%</span></span>
        </div>
    </div>
</section>

<section style="padding: 2rem 0 4rem;">
    <div class="container">
        <div class="pricing-grid">
            @foreach ($plans as $plan)
                <div class="price-card {{ $plan['popular'] ? 'popular' : 'regular' }}">
                    @if ($plan['popular'])
                        <span class="price-badge">★ Le plus populaire</span>
                    @endif

                    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem;">{{ $plan['name'] }}</h3>
                    <div class="price-tagline">{{ $plan['tagline'] }}</div>
                    <p class="price-description">{{ $plan['description'] }}</p>

                    <div class="price-value">
                        <span class="price-amount" data-monthly="{{ $plan['monthly'] }}" data-yearly="{{ $plan['yearly'] }}">
                            {{ vanda_format_price($plan['monthly']) }}
                        </span>
                        FCFA <span class="price-period period-label">/ mois</span>
                    </div>
                    <div class="price-save save-label">
                        {{ $plan['id'] === 'pro' ? "Économisez 32 000 F sur l'année (24%)" : 'Paiement annuel = jusqu\'à 24% d\'économie' }}
                    </div>

                    <a href="https://app.vanda-studio.org/auth/register?plan={{ $plan['id'] }}" class="price-cta {{ $plan['popular'] ? 'primary' : 'secondary' }}">
                        {{ $plan['cta'] }}
                    </a>

                    <div class="price-section-title">Ce qui est inclus</div>
                    <ul style="list-style: none; padding: 0;">
                        @foreach ($plan['included'] as $feature)
                            <li class="price-feature included">
                                <span class="icon">✓</span>
                                <span>{{ $feature }}</span>
                            </li>
                        @endforeach
                        @foreach ($plan['not_included'] as $feature)
                            <li class="price-feature excluded">
                                <span class="icon">✕</span>
                                <span>{{ $feature }}</span>
                            </li>
                        @endforeach
                    </ul>

                    <div class="price-section-title" style="margin-top: 1.5rem;">Limites du plan</div>
                    <ul class="price-limits">
                        @foreach ($plan['limits'] as $limit)
                            <li><span style="color: #4b5563;">🔒</span> {{ $limit }}</li>
                        @endforeach
                    </ul>

                    @if (!empty($plan['upsell']))
                        <div class="price-upsell">
                            {{ $plan['upsell'] }}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
</section>

<section style="padding: 2rem 0;">
    <div class="container">
        <h2 style="text-align: center; font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem;">Pourquoi passer au plan supérieur ?</h2>
        <p style="text-align: center; color: var(--text-muted); max-width: 600px; margin: 0 auto 3rem;">Chaque plan supérieur supprime les limites du précédent. Voici ce qui change concrètement quand vous évoluez.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">🌍 Domaine personnalisé <span style="color: #4caf50; font-size: 0.75rem;">Pro</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Affichez votre propre nom de domaine (monstudio.com) au lieu d'un sous-domaine générique.</p>
            </div>
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">💳 Paiement en ligne en FCFA <span style="color: #4caf50; font-size: 0.75rem;">Pro</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Encaissez vos acomptes et ventes par Mobile Money et carte bancaire directement sur votre site.</p>
            </div>
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">📦 Livraison ZIP professionnelle <span style="color: #4caf50; font-size: 0.75rem;">Pro</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Envoyez des galeries complètes en un clic, sans watermark et avec vos propres marques.</p>
            </div>
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">⚡ API & automatisations <span style="color: #4caf50; font-size: 0.75rem;">Studio</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Branchez vos outils métier et automatisez la livraison et la facturation de vos clients.</p>
            </div>
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">🏢 Équipe & multi-comptes <span style="color: #4caf50; font-size: 0.75rem;">Studio</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Ajoutez vos collaborateurs et gérez un studio à plusieurs sans jamais dupliquer votre travail.</p>
            </div>
            <div class="glass-card">
                <h3 style="font-weight: 700; margin-bottom: 0.5rem;">🔄 Aucun engagement <span style="color: #4caf50; font-size: 0.75rem;">Tous</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Changez de plan ou annulez à tout moment. Vos données restent exportables.</p>
            </div>
        </div>
    </div>
</section>

<section style="padding: 2rem 0 4rem;">
    <div class="container">
        <div style="text-align: center; background: linear-gradient(180deg, rgba(17,24,39,0.95) 0%, rgba(76,175,80,0.12) 100%); border: 1px solid var(--surface-border); border-radius: 1.5rem; padding: 3rem 2rem;">
            <h2 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem;">Prêt à créer votre studio en ligne ?</h2>
            <p style="color: var(--text-muted); max-width: 550px; margin: 0 auto 2rem;">Essayez gratuitement pendant 30 jours. Sans carte bancaire, sans engagement. Et quand votre activité grandira, la plateforme grandira avec vous.</p>
            <a href="https://app.vanda-studio.org/auth/register" class="btn-primary" style="font-size: 1rem;">Créer mon studio gratuitement →</a>
        </div>
    </div>
</section>

<script>
(function () {
    var toggleBtn = document.getElementById('billing-toggle');
    var monthlyLabel = document.getElementById('toggle-monthly');
    var yearlyLabel = document.getElementById('toggle-yearly');
    var yearly = false;

    function update() {
        document.querySelectorAll('.price-amount').forEach(function (el) {
            var value = yearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
            el.textContent = Number(value).toLocaleString('fr-FR');
        });
        document.querySelectorAll('.period-label').forEach(function (el) {
            el.textContent = yearly ? '/ an' : '/ mois';
        });
        document.querySelectorAll('.save-label').forEach(function (el) {
            el.style.display = yearly ? 'block' : 'none';
        });
        if (yearly) {
            toggleBtn.classList.add('yearly');
            monthlyLabel.style.color = '#9ca3af';
            yearlyLabel.style.color = '#ffffff';
        } else {
            toggleBtn.classList.remove('yearly');
            monthlyLabel.style.color = '#ffffff';
            yearlyLabel.style.color = '#9ca3af';
        }
    }

    toggleBtn.addEventListener('click', function () {
        yearly = !yearly;
        update();
    });
    update();
})();
</script>