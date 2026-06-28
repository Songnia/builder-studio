// Types pour le builder de site photo

export interface Photo {
  id: string;
  url: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image?: string;
}

export interface SiteConfig {
  // Informations générales
  siteName: string;
  tagline: string;
  description: string;
  logo?: string;
  useStudioNameAsLogo?: boolean;

  // Couleurs
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  subtitleColor: string;

  // Typographie
  primaryFont?: string;
  secondaryFont?: string;

  // Contact
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;

  // À propos du promoteur
  promoterBiography: string;
  promoterPhilosophy: string;
  promoterPhoto?: string;

  // Réseaux sociaux
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };

  // Contenu
  heroImages: string[];
  photos: Photo[];
  services: Service[];
  pricingPlans: PricingPlan[];
  testimonials: Testimonial[];
  portfolioCategories?: string[];

  // Sections activées
  enabledSections: {
    hero: boolean;
    portfolio: boolean;
    services: boolean;
    pricing: boolean;
    testimonials: boolean;
    contact: boolean;
  };

  // Flash Info
  flashInfo: {
    enabled: boolean;
    title: string;
    subtitle: string;
    buttonText: string;
    whatsappMessage: string;
    backgroundImage?: string;
    redirectUrl?: string;
  };
}


export interface BuilderStep {
  id: string;
  title: string;
  description: string;
  component: string;
}

export const defaultSiteConfig: SiteConfig = {
  siteName: "Mon Studio Photo",
  tagline: "Capturer vos moments précieux",
  description: "Photographe professionnel spécialisé dans les portraits, mariages et événements.",
  useStudioNameAsLogo: false,
  primaryColor: "#1a1a1a",
  secondaryColor: "#f5f5f5",
  accentColor: "#f0e100",
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
  subtitleColor: "#79747e",
  primaryFont: "Playfair Display",
  secondaryFont: "Inter",

  email: "contact@monstudio.com",
  phone: "+237 6 00 00 00 00",
  address: "Rue de la Joie",
  city: "Douala",
  country: "Cameroun",

  promoterBiography: "",
  promoterPhilosophy: "",
  promoterPhoto: "",

  socials: {
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
    website: ""
  },

  heroImages: [],
  photos: [],
  portfolioCategories: [
    "Mariages",
    "Portraits",
    "Grossesse",
    "Bébés & Enfants",
    "Corporate",
    "Événements",
    "Mode",
    "Produit",
    "Nature",
    "Architecture"
  ],
  services: [
    {
      id: "1",
      title: "Le Shooting",
      description: "Nous capturons vos moments précieux avec professionnalisme et créativité",
      features: ["Portraits (professionnels, famille)", "Mode & Lookbook", "Produit (packshot)", "Événementiel (mariage, corporate)"]
    },
    {
      id: "2",
      title: "La Post-production",
      description: "Sublimez vos images grâce à notre expertise en retouche",
      features: ["Retouche photo avancée", "Détourage professionnel", "Restauration de vieilles photos", "Correction colorimétrique"]
    },
    {
      id: "3",
      title: "La Formation",
      description: "Apprenez les techniques professionnelles de la photographie",
      features: ["Stages photo intensifs", "Cours de base pour débutants", "Masterclass avancée", "Formation en studio"]
    },
    {
      id: "4",
      title: "La Location",
      description: "Louez notre studio et notre matériel professionnel",
      features: ["Location de plateau photo", "Matériel haut de gamme", "Éclairage professionnel", "Tarifs horaires flexibles"]
    }
  ],
  pricingPlans: [
    {
      id: "1",
      name: "Forfait Découverte",
      price: "50 000 FCFA",
      description: "Idéal pour une première expérience ou des besoins simples.",
      features: ["1 Heure de shooting", "1 Tenue", "5 Photos retouchées HD", "Galerie privée en ligne"]
    },
    {
      id: "2",
      name: "Forfait Premium",
      price: "100 000 FCFA",
      description: "Notre best-seller pour des souvenirs inoubliables.",
      features: ["2 Heures de shooting", "3 Tenues", "15 Photos retouchées HD", "Maquillage inclus", "Galerie privée en ligne"],
      recommended: true
    },
    {
      id: "3",
      name: "Forfait Ultimate",
      price: "250 000 FCFA",
      description: "L'expérience complète pour les professionnels et les grands événements.",
      features: ["Demi-journée de shooting", "Tenues illimitées", "30 Photos retouchées HD", "Tous les fichiers sources", "Maquillage & Coiffure inclus"]
    }
  ],
  testimonials: [
    {
      id: "1",
      name: "Marie & Jean",
      role: "Mariage",
      content: "Un travail exceptionnel ! Les photos de notre mariage sont magnifiques et pleines d'émotion.",
      rating: 5
    },
    {
      id: "2",
      name: "Sophie Dubois",
      role: "Portrait Professionnel",
      content: "Très professionnel et à l'écoute. Je recommande vivement pour les portraits d'entreprise.",
      rating: 5
    },
    {
      id: "3",
      name: "Lucas Martin",
      role: "Shooting Mode",
      content: "Une expérience incroyable ! Le photographe a su me mettre à l'aise et le résultat est top.",
      rating: 5
    }
  ],

  enabledSections: {
    hero: true,
    portfolio: true,
    services: true,
    pricing: true,
    testimonials: true,
    contact: true
  },

  flashInfo: {
    enabled: true,
    title: "Offre Spéciale",
    subtitle: "Profitez de -20% sur votre séance portrait ce mois-ci !",
    buttonText: "En profiter",
    whatsappMessage: "Bonjour ! Je souhaiterais profiter de l'offre spéciale de -20% sur la séance portrait.",
    backgroundImage: "",
    redirectUrl: ""
  }
};


export const builderSteps: BuilderStep[] = [
  {
    id: "welcome",
    title: "Bienvenue",
    description: "Commencez à créer votre site de photographe",
    component: "WelcomeStep"
  },
  {
    id: "info",
    title: "Informations",
    description: "Configurez les informations de votre studio",
    component: "InfoStep"
  },
  {
    id: "branding",
    title: "Identité visuelle",
    description: "Personnalisez les couleurs de votre site",
    component: "BrandingStep"
  },
  {
    id: "hero",
    title: "Bannière",
    description: "Configurez votre bannière principale",
    component: "HeroStep"
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Ajoutez vos photos et créez votre galerie",
    component: "PortfolioStep"
  },
  {
    id: "services",
    title: "Services",
    description: "Définissez vos prestations",
    component: "ServicesStep"
  },
  {
    id: "pricing",
    title: "Tarifs",
    description: "Configurez vos forfaits et prix",
    component: "PricingStep"
  },
  {
    id: "testimonials",
    title: "Témoignages",
    description: "Ajoutez les avis de vos clients",
    component: "TestimonialsStep"
  },
  {
    id: "contact",
    title: "Contact",
    description: "Configurez vos informations de contact",
    component: "ContactStep"
  },
  {
    id: "preview",
    title: "Aperçu",
    description: "Visualisez et exportez votre site",
    component: "PreviewStep"
  }
];
