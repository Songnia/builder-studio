import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Image as ImageIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig } from '@/types/builder';
import { uploadBuilderMedia } from '@/services/mediaService';

interface InfoStepProps {
  config: SiteConfig;
  onUpdate: (updates: Partial<SiteConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

export function InfoStep({ config, onUpdate, onNext, onPrev, onSave, isSaving }: InfoStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    siteName: config.siteName,
    tagline: config.tagline,
    description: config.description,
    logo: config.logo || '',
    useStudioNameAsLogo: config.useStudioNameAsLogo || false,
    email: config.email,
    phone: config.phone,
    address: config.address,
    city: config.city,
    country: config.country,
    promoterPhilosophy: config.promoterPhilosophy || '',
    promoterPhoto: config.promoterPhoto || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  useEffect(() => {
    setFormData({
      siteName: config.siteName,
      tagline: config.tagline,
      description: config.description,
      logo: config.logo || '',
      useStudioNameAsLogo: config.useStudioNameAsLogo || false,
      email: config.email,
      phone: config.phone,
      address: config.address,
      city: config.city,
      country: config.country,
      promoterBiography: config.promoterBiography || '',
      promoterPhilosophy: config.promoterPhilosophy || '',
      promoterPhoto: config.promoterPhoto || ''
    });
  }, [config]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadBuilderMedia(file, 'logo');
      setFormData(prev => ({ ...prev, logo: url }));
      setIsDirty(true);
    } catch (err) {
      console.error('Logo upload failed:', err);
      alert('Erreur lors de l\'upload du logo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onNext();
  };

  const handleSave = async () => {
    onUpdate(formData);
    if (typeof onSave === 'function') {
      const ok = await onSave(formData);
      if (ok) setIsDirty(false);
      return ok;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Informations de votre studio</h2>
        <p className="text-gray-600">Ces informations apparaîtront sur votre site</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Nom du studio */}
          <div className="space-y-2">
            <Label htmlFor="siteName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Nom du studio *
            </Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="Ex: Studio Lumière"
            />
          </div>

          {/* Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useStudioName"
                checked={formData.useStudioNameAsLogo}
                onCheckedChange={(checked) => handleChange('useStudioNameAsLogo', checked === true)}
              />
              <label
                htmlFor="useStudioName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Utiliser le nom de votre studio comme logo
              </label>
            </div>

            {!formData.useStudioNameAsLogo && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-100">
                <Label htmlFor="logo" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Logo du studio
                </Label>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-full flex-1 text-center sm:text-left">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Formats acceptés : JPG, PNG, WEBP. Max 2Mo conseillé.
                    </p>
                  </div>

                  {formData.logo && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group flex-shrink-0">
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        onClick={() => handleChange('logo', '')}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Slogan / Phrase d'accroche</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Ex: Capturer vos moments précieux"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez votre activité en quelques phrases..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@monstudio.com"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+237 6 00 00 00 00"
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adresse
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ex: Rue de la Joie"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ville */}
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Douala"
              />
            </div>

            {/* Pays */}
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Cameroun"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Section À propos du promoteur */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">À propos du promoteur</h3>
          </div>

          {/* Photo du promoteur */}
          <div className="space-y-4">
            <Label htmlFor="promoterPhoto" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photo du promoteur
            </Label>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-full flex-1 text-center sm:text-left">
                <Input
                  id="promoterPhoto"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setIsUploading(true);
                    try {
                      const url = await uploadBuilderMedia(file, 'promoter');
                      handleChange('promoterPhoto', url);
                    } catch (err) {
                      console.error('Promoter photo upload failed:', err);
                      alert('Erreur lors de l\'upload de la photo.');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommandé: Image carrée, minimum 400x400px
                </p>
              </div>
              {formData.promoterPhoto && (
                <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={formData.promoterPhoto}
                    alt="Aperçu promoteur"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Biographie */}
          <div className="space-y-2">
            <Label htmlFor="biography">Biographie</Label>
            <Textarea
              id="biography"
              value={formData.promoterBiography}
              onChange={(e) => handleChange('promoterBiography', e.target.value)}
              placeholder="Parlez de votre parcours, votre expérience, votre passion pour la photographie..."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Décrivez votre parcours professionnel et ce qui vous anime
            </p>
          </div>

          {/* Philosophie */}
          <div className="space-y-2">
            <Label htmlFor="philosophy">Ma Philosophie</Label>
            <Textarea
              id="philosophy"
              value={formData.promoterPhilosophy}
              onChange={(e) => handleChange('promoterPhilosophy', e.target.value)}
              placeholder="Quelle est votre vision de la photographie ? Votre approche unique ?"
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Partagez votre vision artistique et votre approche de la photographie
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="w-full sm:w-auto h-11 sm:h-10 order-2 sm:order-1"
        >
          Retour
        </Button>
        <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
          <SaveButton onSave={handleSave} isSaving={isSaving} isDirty={isDirty} />
          <Button
            onClick={handleSubmit}
            disabled={!formData.siteName || !formData.email}
            className="bg-green-500 hover:bg-green-600 text-black h-11 sm:h-10 w-full sm:w-auto font-bold"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
