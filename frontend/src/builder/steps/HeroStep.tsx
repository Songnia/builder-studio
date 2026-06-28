import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Type, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig } from '@/types/builder';
import { uploadBuilderMedia, uploadBuilderMediaBatch } from '@/services/mediaService';

// Formule YIQ pour déterminer si une couleur est sombre ou claire
function isColorDark(hex: string): boolean {
  if (!hex) return false;
  const color = hex.replace('#', '');
  if (color.length !== 6 && color.length !== 3) return false;
  const r = parseInt(color.length === 3 ? color[0] + color[0] : color.substring(0, 2), 16);
  const g = parseInt(color.length === 3 ? color[1] + color[1] : color.substring(2, 4), 16);
  const b = parseInt(color.length === 3 ? color[2] + color[2] : color.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128;
}

interface HeroStepProps {
  config: SiteConfig;
  onUpdate: (updates: Partial<SiteConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

export function HeroStep({ config, onUpdate, onNext, onPrev, onSave, isSaving }: HeroStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [heroImages, setHeroImages] = useState<string[]>(config.heroImages);
  const [tagline, setTagline] = useState(config.tagline);
  const [description, setDescription] = useState(config.description);
  const [showCTA, setShowCTA] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const flashInfoFileInputRef = useRef<HTMLInputElement>(null);

  // Charger les polices sélectionnées pour l'aperçu
  useEffect(() => {
    const loadFont = (font: string) => {
      if (!font) return;
      const fontUrlName = font.trim().replace(/"/g, '').replace(/'/g, '').replace(/ /g, '+');
      const linkId = `gfont-hero-preview-${fontUrlName.toLowerCase()}`;
      if (document.getElementById(linkId)) return;
      
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    };

    loadFont(config.primaryFont || 'Playfair Display');
    loadFont(config.secondaryFont || 'Inter');
  }, [config.primaryFont, config.secondaryFont]);

  useEffect(() => {
    setHeroImages(config.heroImages);
    setTagline(config.tagline);
    setDescription(config.description);
  }, [config.heroImages, config.tagline, config.description]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const urls = await uploadBuilderMediaBatch(Array.from(files), 'hero');
      setHeroImages(prev => [...prev, ...urls]);
      setIsDirty(true);
    } catch (err) {
      console.error('Hero upload failed:', err);
      alert('Erreur lors de l\'upload des images de bannière.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFlashInfoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadBuilderMedia(file, 'banner');
      onUpdate({
        flashInfo: { ...config.flashInfo, backgroundImage: url }
      });
      setIsDirty(true);
    } catch (err) {
      console.error('Flash info upload failed:', err);
      alert('Erreur lors de l\'upload de l\'image de fond.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setHeroImages(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleSubmit = () => {
    onUpdate({
      heroImages,
      tagline,
      description,
      flashInfo: config.flashInfo
    });
    onNext();
  };

  const handleSave = async () => {
    const updates = { heroImages, tagline, description, flashInfo: config.flashInfo };
    onUpdate(updates);
    if (typeof onSave === 'function') {
      const ok = await onSave(updates);
      if (ok) setIsDirty(false);
      return ok;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bannière principale</h2>
        <p className="text-gray-600">Configurez l'accueil de votre site</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Titre principal
            </Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => { setTagline(e.target.value); setIsDirty(true); }}
              placeholder="Ex: Capturer vos moments précieux"
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Sous-titre / Description</Label>
            <Textarea
              id="heroDescription"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
              placeholder="Décrivez votre activité..."
              rows={2}
            />
          </div>

          {/* Images du hero */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Images de la bannière
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {heroImages.length === 0 ? (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isUploading 
                    ? 'border-green-300 bg-green-50/20 cursor-wait' 
                    : 'border-gray-300 hover:border-green-500 cursor-pointer'
                  }`}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-3 ${isUploading ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
                  <p className="text-gray-600 font-medium">
                    {isUploading ? 'Chargement en cours...' : 'Cliquez pour ajouter des images'}
                  </p>
                  {!isUploading && (
                    <>
                      <p className="text-sm text-gray-500 mt-1">ou glissez-déposez vos photos ici</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG jusqu'à 10MB</p>
                    </>
                  )}
                </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {heroImages.map((image, index) => (
                    <div key={index} className="relative group aspect-video">
                      <img
                        src={image}
                        alt={`Hero ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-1">Ajouter</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {heroImages.length} image{heroImages.length > 1 ? 's' : ''} • Les images défilent automatiquement
                </p>
              </div>
            )}
          </div>

          {/* Options CTA */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Boutons d'action</p>
                <p className="text-sm text-gray-500">Afficher "Voir le portfolio" et "Réserver"</p>
              </div>
            </div>
            <Switch checked={showCTA} onCheckedChange={setShowCTA} />
          </div>

          {/* Flash Info Configuration */}
          <Card className="p-4 border-green-200 bg-green-50/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">Bandeau "Flash Info"</h3>
                </div>
                <Switch
                  checked={config.flashInfo.enabled}
                  onCheckedChange={(checked) => onUpdate({
                    flashInfo: { ...config.flashInfo, enabled: checked }
                  })}
                />
              </div>

              {config.flashInfo.enabled && (
                <div className="space-y-4 pt-2 border-t border-green-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Titre de l'offre</Label>
                      <Input
                        value={config.flashInfo.title}
                        onChange={(e) => {
                          onUpdate({
                            flashInfo: { ...config.flashInfo, title: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                        placeholder="Ex: Offre Spéciale"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Texte du bouton</Label>
                      <Input
                        value={config.flashInfo.buttonText}
                        onChange={(e) => {
                          onUpdate({
                            flashInfo: { ...config.flashInfo, buttonText: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                        placeholder="Ex: En profiter"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Lien de redirection du bouton (Optionnel)</Label>
                    <Input
                      value={config.flashInfo.redirectUrl || ''}
                      onChange={(e) => {
                        onUpdate({
                          flashInfo: { ...config.flashInfo, redirectUrl: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      placeholder="Ex: https://wa.me/237698399985 ou autre lien de contact"
                    />
                    <p className="text-xs text-gray-500">
                      Si renseigné, le clic sur le bouton redirigera directement vers ce lien (ex: un lien WhatsApp personnalisé, un site externe, etc.) au lieu d'utiliser le message WhatsApp par défaut.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Sous-titre / Description de l'offre</Label>
                    <Input
                      value={config.flashInfo.subtitle}
                      onChange={(e) => {
                        onUpdate({
                          flashInfo: { ...config.flashInfo, subtitle: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      placeholder="Ex: -20% sur votre séance ce mois-ci !"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Image de fond du bandeau
                    </Label>
                    <input
                      ref={flashInfoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFlashInfoImageUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-full flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => flashInfoFileInputRef.current?.click()}
                          className="w-full border-dashed border-green-300 hover:border-green-400 bg-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {config.flashInfo.backgroundImage ? 'Changer l\'image' : 'Sélectionner une image'}
                        </Button>
                      </div>

                      {config.flashInfo.backgroundImage && (
                        <div className="relative group w-24 h-12 border border-green-200 rounded overflow-hidden shadow-sm flex-shrink-0">
                          <img
                            src={config.flashInfo.backgroundImage}
                            alt="Aperçu Bandeau"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => onUpdate({ flashInfo: { ...config.flashInfo, backgroundImage: '' } })}
                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Message WhatsApp pré-rempli</Label>
                    <Textarea
                      value={config.flashInfo.whatsappMessage}
                      onChange={(e) => {
                        onUpdate({
                          flashInfo: { ...config.flashInfo, whatsappMessage: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      placeholder="Le message qui sera envoyé quand le client clique sur le bouton..."
                      rows={2}
                    />
                  </div>

                  
                </div>
              )}
            </div>
          </Card>
        </div>
      </Card>


      {/* Aperçu */}
      {heroImages.length > 0 && (
        <Card className="p-4">
          <Label className="mb-3 block">Aperçu de la bannière</Label>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={heroImages[0]}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: config.primaryFont ? `"${config.primaryFont}", serif` : '"Playfair Display", serif' }}
              >
                {tagline || 'Votre titre'}
              </h3>
              <p 
                className="text-white/80 mb-4 max-w-lg text-sm"
                style={{ fontFamily: config.secondaryFont ? `"${config.secondaryFont}", sans-serif` : '"Inter", sans-serif' }}
              >
                {description || 'Votre description'}
              </p>
              {showCTA && (
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: config.primaryColor, 
                      color: isColorDark(config.primaryColor) ? '#ffffff' : '#181811',
                      fontFamily: config.secondaryFont ? `"${config.secondaryFont}", sans-serif` : '"Inter", sans-serif'
                    }}
                  >
                    Voir le portfolio
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg font-medium text-sm border-2 border-white text-white transition-all hover:bg-white/10"
                    style={{ 
                      fontFamily: config.secondaryFont ? `"${config.secondaryFont}", sans-serif` : '"Inter", sans-serif'
                    }}
                  >
                    Réserver
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="w-full sm:w-auto h-11 sm:h-10 order-2 sm:order-1"
        >
          Retour
        </Button>
        <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
          <SaveButton onSave={handleSave} isSaving={isSaving} isDirty={isDirty} className="w-full sm:w-auto h-11 sm:h-10" />
          <Button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-black h-11 sm:h-10 w-full sm:w-auto font-bold"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
