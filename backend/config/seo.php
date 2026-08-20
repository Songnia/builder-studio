<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Global SEO System Configuration - Vanda Studio
    |--------------------------------------------------------------------------
    |
    | Centralized registry for all programmatic SEO pages, taxonomy, metadata,
    | JSON-LD schemas, breadcrumb structures, and sitemap indexing rules.
    |
    */

    'site_name' => 'Vanda Studio',
    'domain' => env('APP_URL', 'https://vanda-studio.org'),
    'default_og_image' => '/assets/seo-og-default.jpg',
    'app_url' => env('VITE_APP_URL', 'https://app.vanda-studio.org'),

    /*
    |--------------------------------------------------------------------------
    | Sitemaps Configuration
    |--------------------------------------------------------------------------
    */
    'sitemaps' => [
        'core' => [
            'changefreq' => 'daily',
            'priority' => '1.0',
        ],
        'tools' => [
            'changefreq' => 'weekly',
            'priority' => '0.9',
        ],
        'features' => [
            'changefreq' => 'weekly',
            'priority' => '0.9',
        ],
        'solutions' => [
            'changefreq' => 'weekly',
            'priority' => '0.85',
        ],
        'audiences' => [
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ],
        'templates' => [
            'changefreq' => 'monthly',
            'priority' => '0.75',
        ],
        'guides' => [
            'changefreq' => 'monthly',
            'priority' => '0.7',
        ],
        'alternatives' => [
            'changefreq' => 'monthly',
            'priority' => '0.7',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Programmatic SEO Matrix & Page Definitions
    |--------------------------------------------------------------------------
    */
    'pages' => [
        // ==========================================
        // TIER 0 / CORE PAGES
        // ==========================================
        'home' => [
            'url' => '/',
            'sitemap_group' => 'core',
            'template' => 'home',
            'priority' => '1.0',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio | Créez votre studio créatif en ligne (Site, Galeries, Facturation)',
                'description' => 'La plateforme tout-en-un pour photographes, graphistes et créatifs. Créez votre site vitrine, organisez vos galeries et générez vos factures en 10 minutes.',
                'keywords' => 'studio en ligne, site créatif, site photographe, galeries clients, devis factures créatifs',
            ],
            'schema' => 'Organization',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/']
            ],
        ],

        'pricing' => [
            'url' => '/pricing',
            'sitemap_group' => 'core',
            'template' => 'pricing',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Tarifs Vanda Studio | Des offres transparentes pour tous les créatifs',
                'description' => 'Découvrez les tarifs Vanda Studio. Essai gratuit de 30 jours sans carte bancaire. Des formules simples et évolutives pour boostez votre studio.',
                'keywords' => 'tarifs vanda studio, prix site photographe, abonnement studio créatif',
            ],
            'schema' => 'Product',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Tarifs', 'url' => '/pricing']
            ],
        ],

        'audience_hub' => [
            'url' => '/for',
            'sitemap_group' => 'audiences',
            'template' => 'audience_hub',
            'priority' => '0.85',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour tous les Métiers Créatifs | Solutions Sur Mesure',
                'description' => 'Découvrez comment Vanda Studio s\'adapte aux besoins spécifiques des photographes, graphistes, illustratrateurs, vidéastes, motion designers et créatifs.',
                'keywords' => 'portfolio créatif, site pour freelance créatif, studio web métiers créatifs',
            ],
            'schema' => 'WebPage',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for']
            ],
        ],

        'alternatives_index' => [
            'url' => '/alternatives',
            'sitemap_group' => 'alternatives',
            'template' => 'alternatives_index',
            'priority' => '0.8',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Comparatif & Alternatives Vanda Studio | Pourquoi Nous Choisir ?',
                'description' => 'Comparez Vanda Studio aux solutions existantes (Pixieset, Format, Wix, Squarespace) et découvrez pourquoi les créatifs nous font confiance.',
                'keywords' => 'alternative pixieset, alternatif format photo, meilleur builder studio créatif',
            ],
            'schema' => 'WebPage',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Alternatives', 'url' => '/alternatives']
            ],
        ],

        // ==========================================
        // TIER 1 : TOOLS (Interactifs)
        // ==========================================
        'tool_facturation' => [
            'url' => '/tools/calculateur-facture-photographe',
            'sitemap_group' => 'tools',
            'template' => 'tool',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Générateur & Calculateur de Devis / Facture Gratuit pour Créatifs',
                'description' => 'Calculez et générez des devis et factures conformes pour vos prestations créatives (photographie, graphisme, vidéo). Gratuit, rapide et exportable.',
                'keywords' => 'facture photographe gratuit, calculateur devis graphiste, modèle facture créatif',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Outils', 'url' => '/tools'],
                ['name' => 'Calculateur de Facture', 'url' => '/tools/calculateur-facture-photographe']
            ],
            'tool_type' => 'invoice_calculator',
            'h1' => 'Calculateur & Générateur de Devis-Facture pour Créatifs',
            'subtitle' => 'Estimez vos coûts, appliquez vos acomptes et générez une facture nette en quelques clics.',
            'cta_text' => 'Générer une vraie facture dans Vanda Studio',
            'cta_link' => 'https://app.vanda-studio.org/auth/register',
        ],

        'tool_tarifs' => [
            'url' => '/tools/simulateur-tarifs-photographe',
            'sitemap_group' => 'tools',
            'template' => 'tool',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Simulateur de Tarifs Freelance & Créatif | Fixer son TJM et ses Prix',
                'description' => 'Calculez facilement vos tarifs jour homme (TJM) et prix de prestations en fonction de vos charges et revenus cibles.',
                'keywords' => 'calcul TJM freelance, fixer tarif photographe, prix prestation graphiste',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Outils', 'url' => '/tools'],
                ['name' => 'Simulateur de Tarifs', 'url' => '/tools/simulateur-tarifs-photographe']
            ],
            'tool_type' => 'rate_simulator',
            'h1' => 'Simulateur de Tarifs Jour & Prestations Créatives',
            'subtitle' => 'Trouvez le juste prix pour vivre sereinement de votre activité indépendante.',
            'cta_text' => 'Intégrer mes tarifs dans mon studio en ligne',
            'cta_link' => 'https://app.vanda-studio.org/auth/register',
        ],

        // ==========================================
        // TIER 1 : FEATURES
        // ==========================================
        'feature_facturation' => [
            'url' => '/features/facturation-et-devis',
            'sitemap_group' => 'features',
            'template' => 'feature',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Module de Facturation et Devis pour Créatifs | Vanda Studio',
                'description' => 'Émettez des factures professionnelles, suivez vos règlements et intégrez vos acomptes directement dans vos espaces clients.',
                'keywords' => 'devis factures créatifs, facturation photographe, gestion financière freelance',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Fonctionnalités', 'url' => '/features'],
                ['name' => 'Facturation et Devis', 'url' => '/features/facturation-et-devis']
            ],
            'h1' => 'Facturation & Devis Simplifiés pour Créatifs',
            'subtitle' => 'Créez, envoyez et suivez des devis et factures élégants sans sortir de votre plateforme.',
        ],

        'feature_galeries' => [
            'url' => '/features/galeries-clients-privees',
            'sitemap_group' => 'features',
            'template' => 'feature',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Galeries Clients Privées & Protégées par Code PIN | Vanda Studio',
                'description' => 'Livrez vos photos et créations visuelles dans des galeries en ligne sécurisées, élégantes et protégées par mot de passe ou code PIN.',
                'keywords' => 'galerie photo privée, livraison photos client, espace client protégé',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Fonctionnalités', 'url' => '/features'],
                ['name' => 'Galeries Privées', 'url' => '/features/galeries-clients-privees']
            ],
            'h1' => 'Galeries Clients Privées et Sécurisées',
            'subtitle' => 'Offrez à vos clients une expérience de livraison haut de gamme et sécurisée.',
        ],

        'feature_builder' => [
            'url' => '/features/builder-site-vitrine',
            'sitemap_group' => 'features',
            'template' => 'feature',
            'priority' => '0.9',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Builder de Site Vitrine sans Code pour Créatifs | Vanda Studio',
                'description' => 'Créez votre site web professionnel en 10 minutes avec notre assistant guidé sans code. Portfolio, avis, contact et tarifs clés en main.',
                'keywords' => 'builder site créatif, no-code site portfolio, créer site photographe sans code',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Fonctionnalités', 'url' => '/features'],
                ['name' => 'Builder de Site Vitrine', 'url' => '/features/builder-site-vitrine']
            ],
            'h1' => 'Le Builder de Site Vitrine Conçu pour les Créatifs',
            'subtitle' => 'Créez votre site vitrine sur mesure sans taper la moindre ligne de code.',
        ],

        'feature_paiement' => [
            'url' => '/features/paiement-en-ligne-et-acompte',
            'sitemap_group' => 'features',
            'template' => 'feature',
            'priority' => '0.85',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Paiement en Ligne et Gestion des Acomptes | Vanda Studio',
                'description' => 'Encassez vos acomptes et règlements par carte bancaire et Mobile Money rapidement et en toute sécurité via Maketou.',
                'keywords' => 'paiement en ligne créatif, acompte réservation photo, paiement maketou vanda',
            ],
            'schema' => 'SoftwareApplication',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Fonctionnalités', 'url' => '/features'],
                ['name' => 'Paiement en Ligne', 'url' => '/features/paiement-en-ligne-et-acompte']
            ],
            'h1' => 'Encaissez vos Acomptes et Règlements en Ligne',
            'subtitle' => 'Proposez des moyens de paiement fluides et sécurisés à vos clients.',
        ],

        // ==========================================
        // TIER 1 : SOLUTIONS (Hubs Métiers & Use Cases)
        // ==========================================
        'solution_mariage' => [
            'url' => '/solutions/studio-mariage-et-evenementiel',
            'sitemap_group' => 'solutions',
            'template' => 'solution_hub',
            'priority' => '0.85',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Solution Web pour Prestataires de Mariage & Événementiel | Vanda Studio',
                'description' => 'Gérez vos contrats de mariage, devis, acomptes et galeries privées pour les mariés dans un espace fluide et élégant.',
                'keywords' => 'site photographe mariage, solution wedding planner, galeries mariage privées',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Solutions', 'url' => '/solutions'],
                ['name' => 'Mariage & Événementiel', 'url' => '/solutions/studio-mariage-et-evenementiel']
            ],
            'h1' => 'Plateforme Complète pour les Professionnels du Mariage',
            'subtitle' => 'Simplifiez votre gestion avant, pendant et après chaque événement.',
        ],

        'solution_portrait' => [
            'url' => '/solutions/gestion-seances-portrait-et-studio',
            'sitemap_group' => 'solutions',
            'template' => 'solution_hub',
            'priority' => '0.85',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Solution Web pour Photographes de Portrait & Studio | Vanda Studio',
                'description' => 'Organisez vos séances portrait, présentez vos formules et livrez vos fichiers avec sélection de favoris par vos clients.',
                'keywords' => 'site photographe portrait, livraison seance photo, réservation seance portrait',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Solutions', 'url' => '/solutions'],
                ['name' => 'Portrait & Studio', 'url' => '/solutions/gestion-seances-portrait-et-studio']
            ],
            'h1' => 'Gérez vos Séances Portrait & Studio avec Élégance',
            'subtitle' => 'Offrez à vos clients un parcours fluide de la réservation à la sélection finale.',
        ],

        'solution_corporate' => [
            'url' => '/solutions/livraison-et-facturation-corporate',
            'sitemap_group' => 'solutions',
            'template' => 'solution_hub',
            'priority' => '0.85',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Solution pour Créatifs B2B et Projets Corporate | Vanda Studio',
                'description' => 'Facturez les entreprises en toute conformité, gérez les bons de commande et livrez vos assets visuels haute définition.',
                'keywords' => 'facturation corporate freelance, livraison projet b2b, devis entreprise créatif',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Solutions', 'url' => '/solutions'],
                ['name' => 'Corporate & B2B', 'url' => '/solutions/livraison-et-facturation-corporate']
            ],
            'h1' => 'La Solution Web pour vos Clients Entreprises & B2B',
            'subtitle' => 'Structurez votre relation client professionnelle avec des devis et espaces dédiés.',
        ],

        // ==========================================
        // AUDIENCES MÉTIEURS (/for/{slug})
        // ==========================================
        'audience_photographe' => [
            'url' => '/for/photographe',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.8',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Photographes Professionnels | Site & Galeries',
                'description' => 'La solution web dédiée aux photographes : galeries privées, factures avec acompte et site vitrine personnalisable.',
                'keywords' => 'site photographe pro, galeries photo clients, facturation photographe',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Photographe', 'url' => '/for/photographe']
            ],
            'h1' => 'La Plateforme N°1 pour Photographes Professionnels',
            'subtitle' => 'Créez votre vitrine, protégez vos galeries et facturez vos prestations sans effort.',
        ],

        'audience_graphiste' => [
            'url' => '/for/graphiste',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.8',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Graphistes & Designers Visuels',
                'description' => 'Présentez vos chartes graphiques, livrez vos livrables visuels et gérez vos devis d\'identité visuelle.',
                'keywords' => 'site graphiste freelance, portfolio design graphique, devis graphisme',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Graphiste', 'url' => '/for/graphiste']
            ],
            'h1' => 'Sublimez vos Projets de Design Graphique',
            'subtitle' => 'Valorisez votre travail visuel et automatisez votre gestion de devis et factures.',
        ],

        'audience_illustrateur' => [
            'url' => '/for/illustrateur',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.8',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Illustrateurs & Artistes Numériques',
                'description' => 'Créez votre portfolio d\'illustration, vendez vos œuvres et simplifiez vos devis de commande d\'art.',
                'keywords' => 'site illustrateur pro, portfolio illustration, devis illustration',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Illustrateur', 'url' => '/for/illustrateur']
            ],
            'h1' => 'Mettez en Valeur votre Univers d\'Illustration',
            'subtitle' => 'Un espace élégant et personnalisé pour présenter vos créations et séduire vos futurs clients.',
        ],

        'audience_videaste' => [
            'url' => '/for/videaste',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.8',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Vidéastes & Réalisateurs',
                'description' => 'Présentez votre showreel, facturez vos prestations de tournage et montage, et livrez vos projets vidéo.',
                'keywords' => 'site videaste pro, portfolio réalisateur, devis vidéo freelance',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Vidéaste', 'url' => '/for/videaste']
            ],
            'h1' => 'Présentez vos Showreels & Prestations Vidéo',
            'subtitle' => 'Créez votre vitrine vidéo, gérez vos acomptes et rassurez vos commanditaires.',
        ],

        'audience_maquilleur' => [
            'url' => '/for/maquilleur',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.75',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Maquilleurs & Makeup Artists (MUA)',
                'description' => 'Affichez vos essais maquillage, gérez vos contrats beauté & mariage et recevez vos acomptes facilement.',
                'keywords' => 'site maquilleuse pro, portfolio makeup artist, réservation maquillage mariage',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Maquilleur', 'url' => '/for/maquilleur']
            ],
            'h1' => 'Votre Studio Web pour Makeup Artists & Beauty Pros',
            'subtitle' => 'Valorisez vos avant/après et sécurisez vos réservations avec acompte.',
        ],

        'audience_wedding_planner' => [
            'url' => '/for/wedding-planner',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.75',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Wedding Planners & Organisateurs d\'Événements',
                'description' => 'Présentez vos scénographies, vos packages d\'organisation et gérez les échéanciers de paiement des mariés.',
                'keywords' => 'site wedding planner, facturation mariage, portfolio organisation mariage',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Wedding Planner', 'url' => '/for/wedding-planner']
            ],
            'h1' => 'La Vitrine Web Parfaite pour Organisteurs de Mariage',
            'subtitle' => 'Inspirez la confiance à vos mariés avec une présentation raffinée et un suivi rigoureux.',
        ],

        'audience_architecte_interieur' => [
            'url' => '/for/architecte-interieur',
            'sitemap_group' => 'audiences',
            'template' => 'audience',
            'priority' => '0.75',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Vanda Studio pour Architectes d\'Intérieur & Designers d\'Espace',
                'description' => 'Exposez vos réalisations 3D, plans et photos de chantiers, et transmettez des devis détaillés.',
                'keywords' => 'site architecte interieur, portfolio aménagement espace, devis architecture interieure',
            ],
            'schema' => 'Service',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Pour qui ?', 'url' => '/for'],
                ['name' => 'Architecte d\'Intérieur', 'url' => '/for/architecte-interieur']
            ],
            'h1' => 'Sublimez vos Projets d\'Architecture & Designer d\'Espace',
            'subtitle' => 'Mettez en scène vos réalisations et gérez vos phases d\'honoraires en toute sérénité.',
        ],

        // ==========================================
        // ALTERNATIVES (/alternatives/{slug})
        // ==========================================
        'alternative_pixieset' => [
            'url' => '/alternatives/pixieset-alternative',
            'sitemap_group' => 'alternatives',
            'template' => 'alternative',
            'priority' => '0.75',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Alternative à Pixieset | Vanda Studio : Plus qu\'une Galerie Photo',
                'description' => 'Pourquoi choisir Vanda Studio comme alternative française et tout-en-un à Pixieset. Intègre devis, factures et paiements locaux.',
                'keywords' => 'alternative pixieset, pixieset vs vanda studio, galerie photo facturation',
            ],
            'schema' => 'Article',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Alternatives', 'url' => '/alternatives'],
                ['name' => 'Alternative Pixieset', 'url' => '/alternatives/pixieset-alternative']
            ],
            'h1' => 'Vanda Studio vs Pixieset : Le Comparatif Complet',
            'subtitle' => 'Découvrez la solution qui rassemble galeries clients ET facturation sur-mesure.',
        ],

        'alternative_format' => [
            'url' => '/alternatives/format-alternative',
            'sitemap_group' => 'alternatives',
            'template' => 'alternative',
            'priority' => '0.75',
            'index_policy' => 'INDEXABLE',
            'meta' => [
                'title' => 'Alternative à Format.com | Vanda Studio pour Créatifs',
                'description' => 'Découvrez une alternative moderne à Format pour créer votre site et gérer toute l\'activité de votre studio créatif.',
                'keywords' => 'alternative format com, format vs vanda studio, site portfolio créatif',
            ],
            'schema' => 'Article',
            'breadcrumbs' => [
                ['name' => 'Accueil', 'url' => '/'],
                ['name' => 'Alternatives', 'url' => '/alternatives'],
                ['name' => 'Alternative Format', 'url' => '/alternatives/format-alternative']
            ],
            'h1' => 'Vanda Studio vs Format.com',
            'subtitle' => 'Dépasser le simple portfolio avec un véritable outil de gestion commerciale.',
        ],
    ],
];
