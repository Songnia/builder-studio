export interface SeoPageData {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  template: 'tool' | 'feature' | 'solution_hub' | 'audience' | 'audience_hub' | 'alternative' | 'alternatives_index' | 'guide' | 'template';
  ctaText?: string;
  ctaLink?: string;
  toolType?: string;
  screenshotUrl?: string;
}

export const SEO_PAGES_REGISTRY: Record<string, SeoPageData> = {
  // Tools
  '/tools/calculateur-facture-photographe': {
    title: 'Générateur & Calculateur de Devis / Facture Gratuit pour Créatifs | Vanda Studio',
    description: 'Calculez et générez des devis et factures conformes pour vos prestations créatives (photographie, graphisme, vidéo).',
    h1: 'Calculateur & Générateur de Devis-Facture pour Créatifs',
    subtitle: 'Estimez vos coûts, appliquez vos acomptes et générez une facture nette en quelques clics.',
    template: 'tool',
    toolType: 'invoice_calculator',
    ctaText: 'Générer ma facture professionnelle',
    ctaLink: 'https://app.vanda-studio.org/auth/register',
    screenshotUrl: '/assets/screenshots/facturation/create-facture.png'
  },
  '/tools/simulateur-tarifs-photographe': {
    title: 'Simulateur de Tarifs Freelance & Créatif | Vanda Studio',
    description: 'Calculez facilement vos tarifs jour homme (TJM) et prix de prestations en fonction de vos charges.',
    h1: 'Simulateur de Tarifs Jour & Prestations Créatives',
    subtitle: 'Trouvez le juste prix pour vivre sereinement de votre activité indépendante.',
    template: 'tool',
    toolType: 'rate_simulator',
    ctaText: 'Intégrer mes tarifs dans mon studio',
    ctaLink: 'https://app.vanda-studio.org/auth/register',
    screenshotUrl: '/assets/screenshots/facturation/facturation-list.png'
  },

  // Features
  '/features/facturation-et-devis': {
    title: 'Module de Facturation et Devis pour Créatifs | Vanda Studio',
    description: 'Émettez des factures professionnelles, suivez vos règlements et intégrez vos acomptes.',
    h1: 'Facturation & Devis Simplifiés pour Créatifs',
    subtitle: 'Créez, envoyez et suivez des devis et factures élégants sans sortir de votre plateforme.',
    template: 'feature',
    screenshotUrl: '/assets/screenshots/facturation/create-facture.png'
  },
  '/features/galeries-clients-privees': {
    title: 'Galeries Clients Privées & Protégées par Code PIN | Vanda Studio',
    description: 'Livrez vos photos et créations visuelles dans des galeries en ligne sécurisées et protégées.',
    h1: 'Galeries Clients Privées et Sécurisées',
    subtitle: 'Offrez à vos clients une expérience de livraison haut de gamme et sécurisée.',
    template: 'feature',
    screenshotUrl: '/assets/screenshots/galerie/partager-galerie.png'
  },
  '/features/builder-site-vitrine': {
    title: 'Builder de Site Vitrine sans Code pour Créatifs | Vanda Studio',
    description: 'Créez votre site web professionnel en 10 minutes avec notre assistant guidé sans code.',
    h1: 'Le Builder de Site Vitrine Conçu pour les Créatifs',
    subtitle: 'Créez votre site vitrine sur mesure sans taper la moindre ligne de code.',
    template: 'feature',
    screenshotUrl: '/assets/screenshots/monsite/start-creation-site.png'
  },
  '/features/paiement-en-ligne-et-acompte': {
    title: 'Paiement en Ligne et Gestion des Acomptes | Vanda Studio',
    description: 'Encaissez vos acomptes et règlements par carte bancaire et Mobile Money rapidement.',
    h1: 'Encaissez vos Acomptes et Règlements en Ligne',
    subtitle: 'Proposez des moyens de paiement fluides et sécurisés à vos clients.',
    template: 'feature',
    screenshotUrl: '/assets/screenshots/facturation/facturation-list.png'
  },

  // Solutions
  '/solutions/studio-mariage-et-evenementiel': {
    title: 'Solution Web pour Prestataires de Mariage & Événementiel | Vanda Studio',
    description: 'Gérez vos contrats de mariage, devis, acomptes et galeries privées pour les mariés.',
    h1: 'Plateforme Complète pour les Professionnels du Mariage',
    subtitle: 'Simplifiez votre gestion avant, pendant et après chaque événement.',
    template: 'solution_hub',
    screenshotUrl: '/assets/screenshots/galerie/cree-galerie.png'
  },
  '/solutions/gestion-seances-portrait-et-studio': {
    title: 'Solution Web pour Photographes de Portrait & Studio | Vanda Studio',
    description: 'Organisez vos séances portrait, présentez vos formules et livrez vos fichiers.',
    h1: 'Gérez vos Séances Portrait & Studio avec Élégance',
    subtitle: 'Offrez à vos clients un parcours fluide de la réservation à la sélection finale.',
    template: 'solution_hub',
    screenshotUrl: '/assets/screenshots/dashboard.png'
  },
  '/solutions/livraison-et-facturation-corporate': {
    title: 'Solution pour Créatifs B2B et Projets Corporate | Vanda Studio',
    description: 'Facturez les entreprises en toute conformité et livrez vos assets visuels haute définition.',
    h1: 'La Solution Web pour vos Clients Entreprises & B2B',
    subtitle: 'Structurez votre relation client professionnelle avec des devis et espaces dédiés.',
    template: 'solution_hub',
    screenshotUrl: '/assets/screenshots/facturation/facturation-list.png'
  },

  // Audiences
  '/for': {
    title: 'Vanda Studio pour tous les Métiers Créatifs | Solutions Sur Mesure',
    description: 'Découvrez comment Vanda Studio s\'adapte aux besoins des photographes, graphistes, illustratrateurs, vidéastes.',
    h1: 'Vanda Studio pour tous les Métiers Créatifs',
    subtitle: 'Découvrez comment notre plateforme s\'adapte précisément aux spécificités de votre profession.',
    template: 'audience_hub'
  },
  '/for/photographe': {
    title: 'Vanda Studio pour Photographes Professionnels | Site & Galeries',
    description: 'La solution web dédiée aux photographes : galeries privées, factures avec acompte et site vitrine.',
    h1: 'La Plateforme N°1 pour Photographes Professionnels',
    subtitle: 'Créez votre vitrine, protégez vos galeries et facturez vos prestations sans effort.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/galerie/partager-galerie.png'
  },
  '/for/graphiste': {
    title: 'Vanda Studio pour Graphistes & Designers Visuels',
    description: 'Présentez vos chartes graphiques, livrez vos livrables visuels et gérez vos devis.',
    h1: 'Sublimez vos Projets de Design Graphique',
    subtitle: 'Valorisez votre travail visuel et automatisez votre gestion de devis et factures.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/monsite/step10-preview-site.png'
  },
  '/for/illustrateur': {
    title: 'Vanda Studio pour Illustrateurs & Artistes Numériques',
    description: 'Créez votre portfolio d\'illustration, vendez vos œuvres et simplifiez vos devis.',
    h1: 'Mettez en Valeur votre Univers d\'Illustration',
    subtitle: 'Un espace élégant et personnalisé pour présenter vos créations.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/dashboard.png'
  },
  '/for/videaste': {
    title: 'Vanda Studio pour Vidéastes & Réalisateurs',
    description: 'Présentez votre showreel, facturez vos prestations de tournage et montage.',
    h1: 'Présentez vos Showreels & Prestations Vidéo',
    subtitle: 'Créez votre vitrine vidéo, gérez vos acomptes et rassurez vos commanditaires.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/facturation/create-facture.png'
  },
  '/for/maquilleur': {
    title: 'Vanda Studio pour Maquilleurs & Makeup Artists (MUA)',
    description: 'Affichez vos essais maquillage, gérez vos contrats beauté & mariage.',
    h1: 'Votre Studio Web pour Makeup Artists & Beauty Pros',
    subtitle: 'Valorisez vos avant/après et sécurisez vos réservations avec acompte.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/galerie/cree-galerie.png'
  },
  '/for/wedding-planner': {
    title: 'Vanda Studio pour Wedding Planners & Organisateurs',
    description: 'Présentez vos scénographies, vos packages et gérez les échéanciers mariés.',
    h1: 'La Vitrine Web Parfaite pour Organisteurs de Mariage',
    subtitle: 'Inspirez la confiance à vos mariés avec une présentation raffinée.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/monsite/start-creation-site.png'
  },
  '/for/architecte-interieur': {
    title: 'Vanda Studio pour Architectes d\'Intérieur',
    description: 'Exposez vos réalisations 3D, plans et photos de chantiers.',
    h1: 'Sublimez vos Projets d\'Architecture & Designer d\'Espace',
    subtitle: 'Mettez en scène vos réalisations et gérez vos phases d\'honoraires.',
    template: 'audience',
    screenshotUrl: '/assets/screenshots/monsite/step10-preview-site.png'
  },

  // Guides & Tutoriels
  '/guides/creer-site-vitrine-photographe': {
    title: 'Comment Créer un Site Vitrine pour Photographe en 10 min | Tutoriel Vanda',
    description: 'Guide pratique étape par étape pour configurer votre site vitrine, galeries privées et système de facturation d\'acompte.',
    h1: 'Guide Pratique : Créer son Site Vitrine de Photographe en 10 min',
    subtitle: 'Suivez le tutoriel pas à pas pour lancer votre studio professionnel sans code.',
    template: 'guide',
    screenshotUrl: '/assets/screenshots/monsite/start-creation-site.png'
  },
  '/guides/comment-facturer-acompte-freelance': {
    title: 'Comment Facturer des Acomptes en Freelance | Tutoriel & Bonnes Pratiques',
    description: 'Apprenez à structurer vos devis avec acomptes de 30% ou 50% pour sécuriser vos trésoreries créatives.',
    h1: 'Tutoriel : Structurer et Encaiiser ses Acomptes en Freelance',
    subtitle: 'Sécurisez votre activité créative avec la gestion automatisée des factures d\'acompte.',
    template: 'guide',
    screenshotUrl: '/assets/screenshots/facturation/create-facture.png'
  },

  // Templates
  '/templates/portfolio-photographe-mariage': {
    title: 'Template Portfolio Photographe de Mariage | Modèle Prêt à l\'Emploi',
    description: 'Modèle de site vitrine et galeries privées spécialement conçu pour les photographes de mariage.',
    h1: 'Template Vanda : Studio & Portfolio Photographe de Mariage',
    subtitle: 'Un design raffiné pour séduire vos futurs mariés et livrer vos galeries sous code PIN.',
    template: 'template',
    screenshotUrl: '/assets/screenshots/monsite/step10-preview-site.png'
  },

  // Alternatives
  '/alternatives': {
    title: 'Comparatif & Alternatives Vanda Studio | Pourquoi Nous Choisir ?',
    description: 'Comparez Vanda Studio aux solutions existantes (Pixieset, Format).',
    h1: 'Comparatif & Alternatives à Vanda Studio',
    subtitle: 'Découvrez pourquoi les créatifs choisissent Vanda Studio pour rassembler site, galeries et factures.',
    template: 'alternatives_index'
  },
  '/alternatives/pixieset-alternative': {
    title: 'Alternative à Pixieset | Vanda Studio',
    description: 'Pourquoi choisir Vanda Studio comme alternative tout-en-un à Pixieset avec devis et factures.',
    h1: 'Vanda Studio vs Pixieset : Le Comparatif Complet',
    subtitle: 'Découvrez la solution qui rassemble galeries clients ET facturation sur-mesure.',
    template: 'alternative',
    screenshotUrl: '/assets/screenshots/galerie/partager-galerie.png'
  },
  '/alternatives/format-alternative': {
    title: 'Alternative à Format.com | Vanda Studio',
    description: 'Découvrez une alternative moderne à Format pour créer votre site et gérer votre studio.',
    h1: 'Vanda Studio vs Format.com',
    subtitle: 'Dépasser le simple portfolio avec un véritable outil de gestion commerciale.',
    template: 'alternative',
    screenshotUrl: '/assets/screenshots/dashboard.png'
  }
};
