// Central data registry for all 22 public SEO pages
// Screenshots served from /assets/screenshots/ (copied from screenshortApplicationvanda/)

export type PageTemplate = 'feature' | 'audience' | 'audience_hub' | 'solution' | 'tool' | 'alternative' | 'alternatives_hub'

export interface SeoPageData {
    path: string
    template: PageTemplate
    title: string
    h1: string
    subtitle: string
    badge?: string
    screenshotPrimary?: string
    screenshotSecondary?: string
    ctaText?: string
    // Tool-specific
    toolType?: 'invoice_calculator' | 'rate_simulator'
    // Feature bullets
    bullets?: string[]
    // Comparison target
    competitorName?: string
}

const S = {
    dashboard: '/assets/screenshots/dashboard.png',
    createSite: '/assets/screenshots/monsite/start-creation-site.png',
    previewSite: '/assets/screenshots/monsite/step10-preview-site.png',
    createGallery: '/assets/screenshots/galerie/cree-galerie.png',
    shareGallery: '/assets/screenshots/galerie/partager-galerie.png',
    createInvoice: '/assets/screenshots/facturation/create-facture.png',
    invoiceList: '/assets/screenshots/facturation/facturation-list.png',
}

export const SEO_PAGES: SeoPageData[] = [
    // ──────────────────────────────────────────────────────────────
    // TOOLS
    // ──────────────────────────────────────────────────────────────
    {
        path: '/tools/calculateur-facture-photographe',
        template: 'tool',
        toolType: 'invoice_calculator',
        badge: 'Outil Gratuit',
        title: 'Calculateur Facture Photographe — Devis & Acomptes',
        h1: 'Calculateur de Facture & Acompte Photographe',
        subtitle: 'Simulez vos devis, calculez vos acomptes et générez vos factures pro en quelques secondes. 100% gratuit.',
        screenshotPrimary: S.createInvoice,
        screenshotSecondary: S.invoiceList,
        ctaText: 'Générer une vraie facture dans Vanda Studio',
    },
    {
        path: '/tools/simulateur-tarifs-photographe',
        template: 'tool',
        toolType: 'rate_simulator',
        badge: 'Outil Gratuit',
        title: 'Simulateur Tarifs Photographe — TJM & Tarification',
        h1: 'Simulateur de Tarifs & TJM pour Photographes',
        subtitle: 'Calculez votre taux journalier moyen, vos tarifs de séance et votre chiffre d\'affaires cible. Gratuit et instantané.',
        screenshotPrimary: S.invoiceList,
        screenshotSecondary: S.createInvoice,
        ctaText: 'Créer mes factures avec Vanda Studio',
    },

    // ──────────────────────────────────────────────────────────────
    // FEATURES
    // ──────────────────────────────────────────────────────────────
    {
        path: '/features/builder-site-vitrine',
        template: 'feature',
        badge: 'Fonctionnalité',
        title: 'Builder Site Vitrine No-Code pour Photographes — Vanda Studio',
        h1: 'Créez votre Site Vitrine en 10 Minutes',
        subtitle: 'Un builder visuel guidé étape par étape. Aucune compétence technique requise. Template professionnel, domaine personnalisé, SEO intégré.',
        screenshotPrimary: S.createSite,
        screenshotSecondary: S.previewSite,
        bullets: [
            'Templates professionnels prêts à l\'emploi',
            'Domaine personnalisé inclus',
            'SEO intégré — visible sur Google',
            'Responsive mobile & tablette',
            'Portfolio, tarifs, contact en un seul site',
            'Mise en ligne en 10 minutes',
        ],
    },
    {
        path: '/features/galeries-clients-privees',
        template: 'feature',
        badge: 'Fonctionnalité',
        title: 'Galeries Photos Privées & Code PIN — Vanda Studio',
        h1: 'Galeries Clients Privées & Livraison Sécurisée',
        subtitle: 'Livrez vos photos HD dans un espace privé protégé par code PIN. Vos clients sélectionnent leurs favoris et téléchargent directement.',
        screenshotPrimary: S.shareGallery,
        screenshotSecondary: S.createGallery,
        bullets: [
            'Protection par mot de passe ou code PIN',
            'Téléchargement HD groupé en ZIP',
            'Sélection de favoris par le client',
            'Déblocage conditionnel après paiement',
            'Partage par lien unique',
            'Stockage illimité',
        ],
    },
    {
        path: '/features/facturation-et-devis',
        template: 'feature',
        badge: 'Fonctionnalité',
        title: 'Facturation & Devis PDF Professionnels — Vanda Studio',
        h1: 'Facturation & Devis PDF en 2 Clics',
        subtitle: 'Créez des devis et factures PDF professionnels personnalisés à votre identité visuelle. Envoyez, suivez, encaissez.',
        screenshotPrimary: S.createInvoice,
        screenshotSecondary: S.invoiceList,
        bullets: [
            'Devis & factures PDF personnalisés',
            'Suivi des paiements et acomptes',
            'Historique complet des transactions',
            'Envoi par lien ou email',
            'Numérotation automatique',
            'Mention légales incluses',
        ],
    },
    {
        path: '/features/paiement-en-ligne-et-acompte',
        template: 'feature',
        badge: 'Fonctionnalité',
        title: 'Paiement en Ligne & Acomptes Mobile Money — Vanda Studio',
        h1: 'Encaissez vos Acomptes en Ligne',
        subtitle: 'Recevez vos acomptes de réservation par carte bancaire ou Mobile Money (FCFA). Paiement sécurisé, confirmation instantanée.',
        screenshotPrimary: S.invoiceList,
        screenshotSecondary: S.createInvoice,
        bullets: [
            'Paiement Mobile Money natif (Maketou)',
            'Carte bancaire (Visa, Mastercard)',
            'Tarification en FCFA',
            'Confirmation automatique par email',
            'Déblocage de galerie après paiement',
            'Tableau de bord des encaissements',
        ],
    },

    // ──────────────────────────────────────────────────────────────
    // SOLUTIONS
    // ──────────────────────────────────────────────────────────────
    {
        path: '/solutions/studio-mariage-et-evenementiel',
        template: 'solution',
        badge: 'Solution',
        title: 'Solution Studio Photo Mariage & Événementiel — Vanda Studio',
        h1: 'La Solution Complète pour les Studios Mariage',
        subtitle: 'De la prise de contact à la livraison des albums, gérez l\'intégralité de vos prestations mariage et événementielles en un seul outil.',
        screenshotPrimary: S.shareGallery,
        screenshotSecondary: S.invoiceList,
        bullets: [
            'Packages mariage personnalisables',
            'Galeries de mariage protégées par PIN',
            'Acomptes de réservation en ligne',
            'Contrats et devis mariage',
            'Planning de séances intégré',
            'Livraison d\'albums numériques',
        ],
    },
    {
        path: '/solutions/gestion-seances-portrait-et-studio',
        template: 'solution',
        badge: 'Solution',
        title: 'Gestion Séances Portrait & Studio Photo — Vanda Studio',
        h1: 'Gérez vos Séances Portrait & Studio',
        subtitle: 'Optimisez chaque séance portrait, nouveau-né ou studio. Réservations, acomptes, galeries de sélection et facturation en un seul flux.',
        screenshotPrimary: S.createGallery,
        screenshotSecondary: S.createInvoice,
        bullets: [
            'Réservation de créneaux de séances',
            'Galeries de sélection client',
            'Acomptes à la réservation',
            'Facturation post-séance automatisée',
            'Suivi des commandes tirages',
            'Relances de paiement automatiques',
        ],
    },
    {
        path: '/solutions/livraison-et-facturation-corporate',
        template: 'solution',
        badge: 'Solution',
        title: 'Livraison & Facturation Corporate & B2B — Vanda Studio',
        h1: 'Solution Corporate & Clients Professionnels',
        subtitle: 'Gérez vos projets corporate avec des espaces clients dédiés, une facturation conforme et une livraison de fichiers sécurisée.',
        screenshotPrimary: S.dashboard,
        screenshotSecondary: S.invoiceList,
        bullets: [
            'Espaces clients dédiés par projet',
            'Facturation avec TVA et mentions légales',
            'Livraison de fichiers en haute résolution',
            'Bons de commande et devis corporate',
            'Suivi des échéances de paiement',
            'Accès multi-utilisateurs',
        ],
    },

    // ──────────────────────────────────────────────────────────────
    // AUDIENCE HUB
    // ──────────────────────────────────────────────────────────────
    {
        path: '/for',
        template: 'audience_hub',
        title: 'Vanda Studio pour Tous les Créatifs — Par Métier',
        h1: 'Vanda Studio, conçu pour votre Métier',
        subtitle: 'Photographes, graphistes, vidéastes, illustrateurs... Découvrez comment Vanda Studio s\'adapte à votre activité créative.',
        screenshotPrimary: S.dashboard,
    },

    // ──────────────────────────────────────────────────────────────
    // AUDIENCES
    // ──────────────────────────────────────────────────────────────
    {
        path: '/for/photographe',
        template: 'audience',
        badge: 'Pour Photographes',
        title: 'Vanda Studio pour Photographes Professionnels',
        h1: 'La Plateforme N°1 pour Photographes',
        subtitle: 'Site vitrine, galeries livrables HD, facturation d\'acompte et paiement Mobile Money. Tout ce qu\'il faut pour gérer votre activité photo.',
        screenshotPrimary: S.shareGallery,
        screenshotSecondary: S.createInvoice,
        bullets: ['Galeries de livraison HD privées', 'Acomptes par Mobile Money', 'Site vitrine portfolio', 'Facturation séances & packages'],
    },
    {
        path: '/for/graphiste',
        template: 'audience',
        badge: 'Pour Graphistes',
        title: 'Vanda Studio pour Graphistes & Designers',
        h1: 'La Plateforme pour Graphistes & Designers',
        subtitle: 'Portfolio d\'identités visuelles, livraison de fichiers sources sécurisés et facturation de projets de design.',
        screenshotPrimary: S.previewSite,
        screenshotSecondary: S.createInvoice,
        bullets: ['Portfolio de projets design', 'Livraison fichiers sources ZIP', 'Devis identité visuelle', 'Facturation en FCFA ou devise'],
    },
    {
        path: '/for/illustrateur',
        template: 'audience',
        badge: 'Pour Illustrateurs',
        title: 'Vanda Studio pour Illustrateurs & Artistes',
        h1: 'Votre Studio en Ligne d\'Illustrateur',
        subtitle: 'Présentez votre univers artistique, acceptez les commandes personnalisées et livrez vos créations numériques en toute sécurité.',
        screenshotPrimary: S.previewSite,
        screenshotSecondary: S.shareGallery,
        bullets: ['Portfolio artistique visuel', 'Commandes sur mesure', 'Livraison fichiers HD sécurisée', 'Paiement avant livraison'],
    },
    {
        path: '/for/videaste',
        template: 'audience',
        badge: 'Pour Vidéastes',
        title: 'Vanda Studio pour Vidéastes & Réalisateurs',
        h1: 'La Plateforme pour Vidéastes Professionnels',
        subtitle: 'Showreel en ligne, livraison de rushs et fichiers de montage, facturation de tournages et acomptes de réservation.',
        screenshotPrimary: S.shareGallery,
        screenshotSecondary: S.invoiceList,
        bullets: ['Showreel & portfolio vidéo', 'Livraison de rushes sécurisée', 'Devis tournage & post-prod', 'Acomptes de réservation'],
    },
    {
        path: '/for/maquilleur',
        template: 'audience',
        badge: 'Pour Makeup Artists',
        title: 'Vanda Studio pour Maquilleurs & MUA Professionnels',
        h1: 'La Plateforme pour Makeup Artists (MUA)',
        subtitle: 'Portfolio avant/après, réservation en ligne et facturation d\'événements beauté et mariages.',
        screenshotPrimary: S.createSite,
        screenshotSecondary: S.createInvoice,
        bullets: ['Portfolio avant/après beauté', 'Réservation événements', 'Packages mariage & soirée', 'Facturation & acomptes'],
    },
    {
        path: '/for/wedding-planner',
        template: 'audience',
        badge: 'Pour Wedding Planners',
        title: 'Vanda Studio pour Wedding Planners',
        h1: 'La Plateforme pour Wedding Planners',
        subtitle: 'Gérez vos packages mariage, vos contrats, vos acomptes et la livraison de vos supports événementiels.',
        screenshotPrimary: S.invoiceList,
        screenshotSecondary: S.shareGallery,
        bullets: ['Packages mariage configurables', 'Devis & contrats événementiels', 'Planning et suivi de projet', 'Acomptes de réservation en ligne'],
    },
    {
        path: '/for/architecte-interieur',
        template: 'audience',
        badge: "Pour Architectes d'Intérieur",
        title: "Vanda Studio pour Architectes d'Intérieur",
        h1: "La Plateforme pour Architectes d'Intérieur",
        subtitle: 'Présentez vos réalisations, livrez vos plans et rendus 3D et facturez vos honoraires de conception.',
        screenshotPrimary: S.previewSite,
        screenshotSecondary: S.invoiceList,
        bullets: ["Portfolio de réalisations", "Livraison plans & rendus 3D", "Devis et honoraires d'architecte", "Suivi de chantier & paiements"],
    },

    // ──────────────────────────────────────────────────────────────
    // ALTERNATIVES HUB
    // ──────────────────────────────────────────────────────────────
    {
        path: '/alternatives',
        template: 'alternatives_hub',
        title: 'Alternatives aux Logiciels Photo — Vanda Studio',
        h1: 'Vanda Studio vs les autres plateformes',
        subtitle: 'Comparez Vanda Studio aux solutions du marché : Pixieset, Format, SmugMug... et découvrez pourquoi les créatifs africains choisissent Vanda.',
        screenshotPrimary: S.dashboard,
    },

    // ──────────────────────────────────────────────────────────────
    // ALTERNATIVES
    // ──────────────────────────────────────────────────────────────
    {
        path: '/alternatives/pixieset-alternative',
        template: 'alternative',
        badge: 'Comparatif',
        competitorName: 'Pixieset',
        title: 'Alternative à Pixieset — Vanda Studio',
        h1: 'La Meilleure Alternative à Pixieset',
        subtitle: 'Pixieset est une excellente plateforme. Mais si vous avez besoin de facturation intégrée, de paiements Mobile Money en FCFA et d\'un site vitrine complet, Vanda Studio va plus loin.',
        screenshotPrimary: S.shareGallery,
        screenshotSecondary: S.invoiceList,
    },
    {
        path: '/alternatives/format-alternative',
        template: 'alternative',
        badge: 'Comparatif',
        competitorName: 'Format.com',
        title: 'Alternative à Format.com — Vanda Studio',
        h1: 'La Meilleure Alternative à Format.com',
        subtitle: 'Format.com est parfait pour les portfolios. Vanda Studio y ajoute la gestion des galeries clients, la facturation et les paiements Mobile Money — tout-en-un.',
        screenshotPrimary: S.previewSite,
        screenshotSecondary: S.invoiceList,
    },
]

// Build a fast lookup map
export const SEO_PAGES_MAP: Record<string, SeoPageData> = {}
SEO_PAGES.forEach(p => { SEO_PAGES_MAP[p.path] = p })
