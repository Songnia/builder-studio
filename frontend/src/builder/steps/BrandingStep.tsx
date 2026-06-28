import { useState, useEffect, useRef } from 'react';
import { Palette, Info, Check, ChevronDown, Search, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig } from '@/types/builder';
import { googleFontsList } from '@/utils/googleFontsList';

interface BrandingStepProps {
  config: SiteConfig;
  onUpdate: (updates: Partial<SiteConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

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

interface SearchableFontPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
}

export function SearchableFontPicker({ label, value, onChange, description }: SearchableFontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le menu lors d'un clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularFonts = [
    'Inter',
    'Playfair Display',
    'Poppins',
    'Montserrat',
    'Roboto',
    'Open Sans',
    'Lato',
    'Plus Jakarta Sans',
    'Cinzel',
    'Prata',
    'Cormorant Garamond',
    'Syne',
    'Oswald',
    'Lora',
    'Merriweather'
  ];

  const filteredFonts = googleFontsList.filter(font =>
    font.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedFonts = searchQuery 
    ? filteredFonts.slice(0, 50) 
    : [
        ...popularFonts.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase())),
        ...googleFontsList.filter(f => !popularFonts.includes(f)).slice(0, 50)
      ];

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-left shadow-xs"
      >
        <span style={{ fontFamily: value }}>{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[320px]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher une police..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-400"
              autoFocus
            />
          </div>
          
          <div className="overflow-y-auto flex-1 max-h-[260px] py-1 divide-y divide-gray-50">
            {!searchQuery && (
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                Polices recommandées
              </div>
            )}
            
            {displayedFonts.map((font, idx) => {
              const isSelected = font === value;
              return (
                <button
                  key={`${font}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(font);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-green-50/40 text-green-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span style={{ fontFamily: font }}>{font}</span>
                  {isSelected && <Check className="w-4 h-4 text-green-600" />}
                </button>
              );
            })}
            
            {displayedFonts.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-gray-400 font-medium">
                Aucune police trouvée pour "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-[11px] text-gray-500 font-medium leading-normal">{description}</p>
    </div>
  );
}

export function BrandingStep({ config, onUpdate, onNext, onPrev, onSave, isSaving }: BrandingStepProps) {
  const [isDirty, setIsDirty] = useState(false);

  // Déterminer si l'adaptation automatique doit être activée au chargement
  const autoText = isColorDark(config.backgroundColor) ? '#ffffff' : '#1a1a1a';
  const autoSub = isColorDark(config.backgroundColor) ? '#a1a1aa' : '#79747e';
  const initialAutoContrast = 
    config.textColor === autoText && 
    (config.subtitleColor === autoSub || !config.subtitleColor);

  const [autoContrast, setAutoContrast] = useState(initialAutoContrast);

  const [branding, setBranding] = useState({
    primaryColor: config.primaryColor || '#1a1a1a',
    secondaryColor: config.secondaryColor || '#f5f5f5',
    accentColor: config.accentColor || '#f0e100',
    backgroundColor: config.backgroundColor || '#ffffff',
    textColor: config.textColor || '#1a1a1a',
    subtitleColor: config.subtitleColor || '#79747e',
    primaryFont: config.primaryFont || 'Playfair Display',
    secondaryFont: config.secondaryFont || 'Inter'
  });

  // Mettre à jour l'état local si config change
  useEffect(() => {
    setBranding({
      primaryColor: config.primaryColor || '#1a1a1a',
      secondaryColor: config.secondaryColor || '#f5f5f5',
      accentColor: config.accentColor || '#f0e100',
      backgroundColor: config.backgroundColor || '#ffffff',
      textColor: config.textColor || '#1a1a1a',
      subtitleColor: config.subtitleColor || '#79747e',
      primaryFont: config.primaryFont || 'Playfair Display',
      secondaryFont: config.secondaryFont || 'Inter'
    });
  }, [config]);

  // Charger les polices de caractères sélectionnées à la volée pour l'aperçu
  useEffect(() => {
    const loadFont = (font: string) => {
      if (!font) return;
      const fontUrlName = font.trim().replace(/"/g, '').replace(/'/g, '').replace(/ /g, '+');
      const linkId = `gfont-preview-${fontUrlName.toLowerCase()}`;
      if (document.getElementById(linkId)) return;
      
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    };

    loadFont(branding.primaryFont);
    loadFont(branding.secondaryFont);
  }, [branding.primaryFont, branding.secondaryFont]);

  // Logique de modification d'une couleur
  const handleColorChange = (field: keyof typeof branding, value: string) => {
    setBranding(prev => {
      const nextBranding = { ...prev, [field]: value };
      
      // Si l'adaptation automatique est activée et qu'on modifie la couleur de fond
      if (autoContrast && field === 'backgroundColor') {
        const dark = isColorDark(value);
        nextBranding.textColor = dark ? '#ffffff' : '#1a1a1a';
        nextBranding.subtitleColor = dark ? '#a1a1aa' : '#79747e';
      }
      
      return nextBranding;
    });
    setIsDirty(true);
  };

  // Logique de modification d'une police
  const handleFontChange = (field: 'primaryFont' | 'secondaryFont', value: string) => {
    setBranding(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  // Toggle adaptation automatique
  const handleAutoContrastToggle = (checked: boolean) => {
    setAutoContrast(checked);
    setIsDirty(true);
    if (checked) {
      const dark = isColorDark(branding.backgroundColor);
      setBranding(prev => ({
        ...prev,
        textColor: dark ? '#ffffff' : '#1a1a1a',
        subtitleColor: dark ? '#a1a1aa' : '#79747e'
      }));
    }
  };

  const handleSubmit = () => {
    onUpdate(branding);
    onNext();
  };

  const handleSave = async () => {
    onUpdate(branding);
    if (typeof onSave === 'function') {
      const ok = await onSave(branding);
      if (ok) setIsDirty(false);
      return ok;
    }
    return false;
  };

  // Helper pour afficher un champ couleur standardisé
  const renderColorField = (
    field: keyof typeof branding, 
    label: string, 
    description: string, 
    disabled = false
  ) => {
    return (
      <div className={`space-y-3 transition-opacity ${disabled ? 'opacity-50' : 'opacity-100'}`}>
        <Label htmlFor={field} className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
            <input
              type="color"
              id={field}
              value={branding[field] as string}
              disabled={disabled}
              onChange={(e) => handleColorChange(field, e.target.value)}
              className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              id={`${field}-text`}
              value={branding[field] as string}
              disabled={disabled}
              onChange={(e) => handleColorChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-normal">{description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Identité visuelle</h2>
        <p className="text-gray-600 font-medium text-sm">Configurez et harmonisez la charte graphique de votre studio</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Palette className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Palette de couleurs du site</h3>
          </div>

          {/* Grid des 4 couleurs de structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderColorField(
              'primaryColor', 
              'Couleur de Marque (Actions)', 
              'Boutons principaux, liens actifs, étoiles de notation et icônes d\'action.'
            )}

            {renderColorField(
              'accentColor', 
              'Couleur d\'Accent (Badges)', 
              'Utilisée pour les éléments de mise en avant tels que le badge "Recommandé" des tarifs.'
            )}

            {renderColorField(
              'backgroundColor', 
              'Couleur de Fond Principale', 
              'Arrière-plan général de votre site (Hero, Services, Galerie, Contact).'
            )}

            {renderColorField(
              'secondaryColor', 
              'Couleur de Fond Alternative (Tarifs)', 
              'Arrière-plan des sections alternatives (ex: section Tarifs) pour rompre la monotonie.'
            )}
          </div>

          {/* Option d'adaptation automatique */}
          <div className="flex items-start justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100 gap-4 mt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-green-500" />
                <Label htmlFor="auto-contrast" className="text-sm font-semibold text-gray-900 cursor-pointer">
                  Ajuster automatiquement les textes
                </Label>
              </div>
              <p className="text-xs text-gray-500 max-w-xl">
                Adapte automatiquement les couleurs des titres et des sous-titres en fonction du fond choisi pour garantir une lisibilité optimale (Normes WCAG).
              </p>
            </div>
            <Switch
              id="auto-contrast"
              checked={autoContrast}
              onCheckedChange={handleAutoContrastToggle}
              className="mt-1"
            />
          </div>

          {/* Section couleurs de texte */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderColorField(
              'textColor', 
              'Couleur des Titres & Textes principaux', 
              'Grands titres (h1, h2, h3) et textes des descriptions principales.',
              autoContrast
            )}

            {renderColorField(
              'subtitleColor', 
              'Couleur des Sous-titres & Détails', 
              'Sous-titres de sections, puces de détails de forfaits et descriptions secondaires.',
              autoContrast
            )}
          </div>

          {/* Section Typographie */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 pb-4">
              <Type className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Typographie du site</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchableFontPicker
                label="Police des Titres (Principale)"
                value={branding.primaryFont}
                onChange={(val) => handleFontChange('primaryFont', val)}
                description="Appliquée sur les grands titres de section et titres de forfaits (ex: Serif élégante)."
              />

              <SearchableFontPicker
                label="Police du Texte (Secondaire)"
                value={branding.secondaryFont}
                onChange={(val) => handleFontChange('secondaryFont', val)}
                description="Appliquée pour le corps de texte, paragraphes et listes de détails (ex: Sans-Serif lisible)."
              />
            </div>
          </div>

          {/* Prévisualisation dynamique avec double section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Label className="mb-3 block font-bold text-gray-800 text-sm">Aperçu en temps réel de votre site</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aperçu Section Principale */}
              <div
                className="p-5 rounded-xl border border-gray-100 shadow-xs transition-colors duration-300 flex flex-col justify-between min-h-[180px]"
                style={{ backgroundColor: branding.backgroundColor }}
              >
                <div>
                  <span 
                    className="text-[10px] uppercase font-bold tracking-wider opacity-60" 
                    style={{ 
                      color: branding.subtitleColor,
                      fontFamily: branding.secondaryFont 
                    }}
                  >
                    Section Principale (ex: Services)
                  </span>
                  <h4
                    className="text-lg font-extrabold mt-1 mb-1 transition-colors duration-300"
                    style={{ 
                      color: branding.textColor,
                      fontFamily: branding.primaryFont 
                    }}
                  >
                    Titre Exemple
                  </h4>
                  <p
                    className="text-xs transition-colors duration-300 leading-relaxed"
                    style={{ 
                      color: branding.subtitleColor,
                      fontFamily: branding.secondaryFont 
                    }}
                  >
                    Ceci est une description secondaire utilisant la couleur des sous-titres et la police secondaire.
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-4">
                  <button
                    className="px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-default"
                    style={{
                      backgroundColor: branding.primaryColor,
                      color: isColorDark(branding.primaryColor) ? '#ffffff' : '#181811',
                      fontFamily: branding.secondaryFont
                    }}
                  >
                    Bouton Marque
                  </button>
                  <div
                    className="px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide cursor-default"
                    style={{
                      backgroundColor: branding.accentColor,
                      color: isColorDark(branding.accentColor) ? '#ffffff' : '#181811',
                      fontFamily: branding.secondaryFont
                    }}
                  >
                    Badge Accent
                  </div>
                </div>
              </div>

              {/* Aperçu Section Alternative */}
              <div
                className="p-5 rounded-xl border border-gray-100 shadow-xs transition-colors duration-300 flex flex-col justify-between min-h-[180px]"
                style={{ backgroundColor: branding.secondaryColor }}
              >
                <div>
                  <span 
                    className="text-[10px] uppercase font-bold tracking-wider opacity-60" 
                    style={{ 
                      color: isColorDark(branding.secondaryColor) ? '#a1a1aa' : '#79747e',
                      fontFamily: branding.secondaryFont
                    }}
                  >
                    Section Alternative (ex: Tarifs)
                  </span>
                  <h4
                    className="text-lg font-extrabold mt-1 mb-1 transition-colors duration-300"
                    style={{ 
                      color: isColorDark(branding.secondaryColor) ? '#ffffff' : '#181811',
                      fontFamily: branding.primaryFont
                    }}
                  >
                    Forfaits & Tarifs
                  </h4>
                  <p
                    className="text-xs transition-colors duration-300 leading-relaxed"
                    style={{ 
                      color: isColorDark(branding.secondaryColor) ? '#a1a1aa' : '#79747e',
                      fontFamily: branding.secondaryFont
                    }}
                  >
                    Cette zone est formatée à l'aide de la couleur de fond alternative pour structurer la page.
                  </p>
                </div>
                <div 
                  className="mt-4 text-xs font-semibold" 
                  style={{ 
                    color: isColorDark(branding.secondaryColor) ? '#ffffff' : '#181811',
                    fontFamily: branding.secondaryFont
                  }}
                >
                  ✓ Détail 1 &bull; ✓ Détail 2
                </div>
              </div>
            </div>
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
