import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreviewSiteWrapper } from '@/components/PreviewSiteWrapper';
import { Eye, Smartphone, Monitor, Tablet, Save, Loader2, CreditCard, ExternalLink, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { siteConfigService } from '@/services/siteConfigService';
import { useToast } from '@/components/ui/use-toast';
import type { SiteConfig } from '@/types/builder';
import { UpgradeDialog } from '@/components/common/UpgradeDialog';

interface PreviewStepProps {
  config: SiteConfig;
  onReset: () => void;
  onPrev: () => void;
}

export function PreviewStep({ config, onReset, onPrev }: PreviewStepProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Logique de sauvegarde (intégrée depuis SaveConfigDialog)
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<number | null>(null);
  const [siteName, setSiteName] = useState(config.siteName);
  const [slug, setSlug] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    checkExistingConfig();
    checkExistingConfig();
  }, []);

  const checkExistingConfig = async () => {
    try {
      const configs = await siteConfigService.getMyConfigs();
      if (configs && configs.length > 0) {
        const existing = configs[0];
        setExistingId(existing.id);
        setSiteName(existing.site_name);
        setSlug(existing.slug);
        setIsPublished(existing.is_published);
      }
    } catch {
      // pas de config existante
    }
  };

  const handleNext = () => {
    if (!siteName) {
      toast({ title: "Nom du site requis", description: "Veuillez entrer un nom pour votre site.", variant: "destructive" });
      return;
    }
    if (!existingId) {
      handleSave();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (existingId) {
        await siteConfigService.update(existingId, config);
        toast({ title: "Site mis à jour !", description: "Vos modifications ont été enregistrées avec succès." });
        navigate('/admin/dashboard');
      } else {
        const finalSlug = slug || siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        await siteConfigService.create(config, siteName, finalSlug);
        toast({ title: "Site créé !", description: "Votre site a été enregistré avec succès. Vous pouvez maintenant le publier !" });
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.response?.data?.message || "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = () => {
    // Si le site n'est pas encore enregistré, on force l'enregistrement d'abord ?
    // Ou bien on affiche simplement le UpgradeDialog qui redirige vers Subscription
    setShowUpgradeDialog(true);
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const scrollToRecap = () => {
    document.getElementById('recap-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Votre site est prêt !</h2>
        <p className="text-gray-600">Visualisez et sauvegardez votre site</p>
      </div>

      {/* Bouton Sauvegarder raccourci — scroll vers le bas */}
      <div className="flex justify-center">
        <Button onClick={scrollToRecap} className="bg-primary hover:bg-primary/90 gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </Button>
      </div>

      {/* Aperçu */}
      <Card className="p-0 sm:p-4 bg-transparent sm:bg-white border-0 sm:border shadow-none sm:shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6 px-4 sm:px-0">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Aperçu en direct</h3>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1.5 w-full sm:w-auto justify-center">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Ordinateur"
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${previewDevice === 'tablet' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Tablette"
            >
              <Tablet className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* Le mode mobile est désactivé car les media queries Tailwind nécessitent une Iframe pour bien s'isoler.
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            */}
          </div>
        </div>
        <div className="flex justify-center">
          <div
            className="border-y sm:border rounded-none sm:rounded-lg overflow-hidden transition-all duration-300 bg-white"
            style={{ width: getPreviewWidth(), maxWidth: '100%' }}
          >
            <PreviewSiteWrapper config={config} />
          </div>
        </div>
      </Card>

      {/* Récapitulatif + Formulaire de sauvegarde */}
      <Card id="recap-section" className="p-6">
          <>
            <h3 className="font-semibold mb-4">
              {existingId ? "Mettre à jour le site" : "Récapitulatif de votre site"}
            </h3>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{config.photos.length}</p>
                <p className="text-sm text-gray-600">Photos</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{config.services.length}</p>
                <p className="text-sm text-gray-600">Services</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{config.pricingPlans.length}</p>
                <p className="text-sm text-gray-600">Forfaits</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-500">{config.testimonials.length}</p>
                <p className="text-sm text-gray-600">Témoignages</p>
              </div>
            </div>

            {/* Formulaire de config */}
            <div className="border-t pt-5 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Nom du site</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Mon Super Studio"
                  disabled={!!existingId}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">URL personnalisée (optionnel)</Label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500 whitespace-nowrap">/sites/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="mon-studio"
                    disabled={!!existingId}
                  />
                </div>
                <p className="text-xs text-gray-500">Laissez vide pour générer automatiquement.</p>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Label>Statut du site</Label>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium">{isPublished ? 'En ligne' : 'Brouillon (Non publié)'}</span>
                  </div>
                  {!isPublished && existingId && (
                    <Button onClick={handlePublishClick} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Rocket className="w-4 h-4 mr-2" />
                      Publier
                    </Button>
                  )}
                  {!isPublished && !existingId && (
                    <span className="text-xs text-gray-500">Enregistrez le site d'abord pour le publier</span>
                  )}
                </div>
              </div>
            </div>
          </>
      </Card>

      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        feature="publish"
      />

      {/* Barre de navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onPrev}
            className="w-full sm:w-auto h-11 sm:h-10 order-2 sm:order-1"
          >
            Retour
          </Button>
            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 gap-2 h-11 sm:h-10 w-full sm:w-auto font-bold"
                >
                  {loading
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{existingId ? "Mise à jour..." : "Enregistrement..."}</>
                    : <><Save className="w-4 h-4" />{existingId ? "Mettre à jour" : "Enregistrer"}</>
                  }
                </Button>
            </div>
        </div>
    </div>
  );
}



// Génère le code HTML complet du site
function generateSiteCode(config: SiteConfig): string {
  const categories = [...new Set(config.photos.map(p => p.category))];

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.siteName} - ${config.tagline}</title>
    <meta name="description" content="${config.description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${config.primaryColor}',
                        accent: '${config.accentColor}',
                        secondary: '${config.secondaryColor}'
                    }
                }
            }
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-white">
    <!-- Header -->
    <header class="bg-primary text-white px-6 py-4">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
            <div class="font-bold text-xl">${config.siteName}</div>
            <nav class="hidden md:flex gap-6">
                <a href="#accueil" class="hover:opacity-80 transition">Accueil</a>
                <a href="#portfolio" class="hover:opacity-80 transition">Portfolio</a>
                <a href="#services" class="hover:opacity-80 transition">Services</a>
                <a href="#tarifs" class="hover:opacity-80 transition">Tarifs</a>
                <a href="#contact" class="hover:opacity-80 transition">Contact</a>
            </nav>
        </div>
    </header>

    ${config.enabledSections.hero ? `
    <!-- Hero Section -->
    <section id="accueil" class="relative h-[500px] md:h-[600px]">
        ${config.heroImages.length > 0 ? `
        <img src="${config.heroImages[0]}" alt="Hero" class="w-full h-full object-cover">
        ` : ''}
        <div class="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">${config.tagline}</h1>
            <p class="text-white/80 max-w-2xl text-lg mb-8">${config.description}</p>
            <div class="flex gap-4">
                <a href="#portfolio" class="px-8 py-3 rounded-lg font-medium bg-accent text-primary hover:opacity-90 transition">
                    Voir le portfolio
                </a>
                <a href="#contact" class="px-8 py-3 rounded-lg font-medium border-2 border-white text-white hover:bg-white/10 transition">
                    Réserver
                </a>
            </div>
        </div>
    </section>
    ` : ''}

    ${config.enabledSections.portfolio && config.photos.length > 0 ? `
    <!-- Portfolio Section -->
    <section id="portfolio" class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-4">Portfolio</h2>
            <p class="text-gray-600 text-center mb-8">Découvrez mes dernières réalisations</p>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${config.photos.map(photo => `
                <div class="aspect-square group relative overflow-hidden rounded-lg">
                    <img src="${photo.url}" alt="${photo.category}" class="w-full h-full object-cover transition group-hover:scale-105">
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Footer -->
    <footer class="bg-primary text-white py-12 px-6">
        <div class="max-w-6xl mx-auto text-center">
            <p class="font-bold text-2xl mb-2">${config.siteName}</p>
            <p class="text-white/70 mb-6">${config.tagline}</p>
            <p class="text-white/50 text-sm">© 2024 ${config.siteName}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`;
}
