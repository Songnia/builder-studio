import { useState, useRef, useEffect } from 'react';
import { Upload, Image, X, Plus, Folder, Grid3X3, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import type { SiteConfig, Photo } from '@/types/builder';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { UpgradeDialog } from '@/components/common/UpgradeDialog';
import { SaveButton } from '@/builder/components/SaveButton';
import { uploadBuilderMedia, uploadBuilderMediaBatch } from '@/services/mediaService';

interface PortfolioStepProps {
  config: SiteConfig;
  onUpdate: (updates: Partial<SiteConfig>) => void;
  onAddPhoto: (photo: { url: string; category: string }) => void;
  onAddPhotos: (photos: { url: string; category: string }[]) => void;
  onRemovePhoto: (id: string) => void;
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

const defaultCategories = [
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
];

function buildCategoryList(photos: Photo[], existingCategories: string[] = []) {
  return Array.from(new Set([
    ...defaultCategories,
    ...existingCategories,
    ...photos.map((photo) => photo.category.trim()).filter(Boolean),
  ]));
}

export function PortfolioStep({ config, onUpdate, onAddPhoto, onAddPhotos, onRemovePhoto, onUpdatePhoto, onNext, onPrev, onSave, isSaving }: PortfolioStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>(config.photos);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(() => 
    config.portfolioCategories || buildCategoryList(config.photos)
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ url: '', category: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Plan limits
  const { checkLimit, currentPlan } = usePlanLimits();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  // Deletion confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [photoDeleteConfirmOpen, setPhotoDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setPhotos(config.photos);
    if (config.portfolioCategories) {
      setCategories(config.portfolioCategories);
    } else {
      setCategories((prev) => buildCategoryList(config.photos, prev));
    }
  }, [config.photos, config.portfolioCategories]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!newPhoto.category) {
      alert("Veuillez d'abord sélectionner une catégorie.");
      return;
    }

    setIsUploading(true);
    try {
      if (files.length === 1) {
        // Upload unique → pré-remplissage du formulaire pour confirmation
        const url = await uploadBuilderMedia(files[0], 'portfolio');
        setNewPhoto(prev => ({ ...prev, url }));
      } else {
        // Upload en lot → ajout direct
        const batchCategory = newPhoto.category;
        const urls = await uploadBuilderMediaBatch(Array.from(files), 'portfolio');

        const results = urls.map((url) => ({ url, category: batchCategory }));
        onAddPhotos(results);
        setPhotos(prev => [
          ...prev,
          ...results.map(r => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...r
          }))
        ]);

        setNewPhoto({ url: '', category: '' });
        setUploadDialogOpen(false);
        setIsDirty(true);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Erreur lors de l\'upload. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhoto = () => {
    const category = newPhoto.category;

    if (newPhoto.url && category) {
      onAddPhoto({
        url: newPhoto.url,
        category: category
      });
      setPhotos(prev => [...prev, {
        id: Date.now().toString(),
        url: newPhoto.url,
        category: category
      }]);
      setNewPhoto({ url: '', category: '' });
      setUploadDialogOpen(false);
      setIsDirty(true);
    }
  };

  const handleRemovePhoto = (id: string) => {
    onRemovePhoto(id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    setIsDirty(true);
  };

  const handleUpdatePhotoCategory = (id: string, category: string) => {
    if (!category) return;

    onUpdatePhoto(id, { category });
    const updatedPhotos = photos.map((photo) => (
      photo.id === id ? { ...photo, category } : photo
    ));
    setPhotos(updatedPhotos);
    onUpdate({ photos: updatedPhotos });
    setIsDirty(true);
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      const updatedCategories = [...categories, trimmedCategory];
      setCategories(updatedCategories);
      setNewCategory('');
      onUpdate({ portfolioCategories: updatedCategories });
      setIsDirty(true);
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    // Si la catégorie supprimée est sélectionnée, revenir à "Toutes"
    if (selectedCategory === catToRemove) {
      setSelectedCategory('');
    }

    const updatedCategories = categories.filter(c => c !== catToRemove);
    setCategories(updatedCategories);

    // Mettre à jour les photos pour retirer la catégorie supprimée
    const updatedPhotos = photos.map(p => 
      p.category === catToRemove ? { ...p, category: '' } : p
    );
    setPhotos(updatedPhotos);

    onUpdate({
      portfolioCategories: updatedCategories,
      photos: updatedPhotos
    });
    setIsDirty(true);
  };

  const initiateRemoveCategory = (catToRemove: string) => {
    setCategoryToDelete(catToRemove);
    setDeleteConfirmOpen(true);
  };

  const confirmRemoveCategory = () => {
    if (categoryToDelete) {
      handleRemoveCategory(categoryToDelete);
      setCategoryToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const initiateRemovePhoto = (id: string) => {
    setPhotoToDelete(id);
    setPhotoDeleteConfirmOpen(true);
  };

  const confirmRemovePhoto = () => {
    if (photoToDelete) {
      handleRemovePhoto(photoToDelete);
      setPhotoToDelete(null);
      setPhotoDeleteConfirmOpen(false);
    }
  };

  const filteredPhotos = selectedCategory
    ? photos.filter(p => p.category === selectedCategory)
    : photos;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Votre Portfolio</h2>
        <p className="text-gray-600">Ajoutez vos photos et organisez-les par catégories</p>
      </div>

      {/* Catégories */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-4 h-4 text-green-500" />
          <Label>Catégories</Label>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === ''
              ? 'bg-green-500 text-black'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Toutes ({photos.length})
          </button>
          {categories.map(cat => {
            const count = photos.filter(p => p.category === cat).length;
            return (
              <div key={cat} className="relative inline-flex items-center group">
                <button
                  onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                  className={`pl-3 pr-6 py-1 rounded-full text-sm transition-colors ${selectedCategory === cat
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); initiateRemoveCategory(cat); }}
                  title="Supprimer la catégorie"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nouvelle catégorie..."
            className="flex-1"
          />
          <Button variant="outline" onClick={handleAddCategory} disabled={!newCategory} className="w-full sm:w-auto text-xs h-8 sm:h-10 font-semibold">
            <Plus className="w-3 h-3 mr-1.5 sm:mr-0" />
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </Card>

      {/* Photos */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Photos ({filteredPhotos.length})</h3>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold text-xs h-8 sm:h-10 px-3"
                onClick={(e) => {
                  // Check photo limit before opening dialog
                  if (checkLimit('photos', photos.length)) {
                    e.preventDefault();
                    setUpgradeDialogOpen(true);
                  }
                }}
              >
                <Upload className="w-3 h-3 mr-1.5" />
                Ajouter une photo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter une photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {!newPhoto.url ? (
                  <div
                    onClick={() => {
                      if (!newPhoto.category) {
                        alert("Veuillez d'abord sélectionner une catégorie.");
                      } else if (!isUploading) {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isUploading
                      ? 'border-green-300 bg-green-50/20 cursor-wait'
                      : newPhoto.category
                        ? 'border-gray-300 hover:border-green-500 cursor-pointer'
                        : 'border-red-200 bg-red-50/10 grayscale cursor-not-allowed'
                      }`}
                  >
                    <Image className={`w-12 h-12 mx-auto mb-3 ${isUploading ? 'text-green-400 animate-pulse' : newPhoto.category ? 'text-gray-400' : 'text-red-300'}`} />
                    <p className={`${isUploading ? 'text-green-600' : newPhoto.category ? 'text-gray-600' : 'text-red-400'} font-medium`}>
                      {isUploading ? 'Upload en cours...' : newPhoto.category ? 'Cliquez pour sélectionner des images' : 'Sélectionnez une catégorie d\'abord'}
                    </p>
                    {newPhoto.category && !isUploading && <p className="text-xs text-gray-400 mt-2">Vous pouvez en sélectionner plusieurs</p>}
                  </div>
                ) : (
                  <div className="relative aspect-video">
                    <img
                      src={newPhoto.url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setNewPhoto(prev => ({ ...prev, url: '' }))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label htmlFor="photoCategory">Catégorie *</Label>
                  <select
                    id="photoCategory"
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleAddPhoto}
                  disabled={!newPhoto.url || !newPhoto.category}
                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                >
                  Ajouter au portfolio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Grid3X3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aucune photo dans cette catégorie</p>
            <p className="text-sm text-gray-400">Ajoutez vos premières photos pour les voir ici</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                <div className="group relative aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.category}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-medium text-sm truncate">{photo.category}</p>
                    </div>
                    <button
                      onClick={() => initiateRemovePhoto(photo.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`photo-category-${photo.id}`} className="text-xs text-gray-500">
                    Catégorie
                  </Label>
                  <select
                    id={`photo-category-${photo.id}`}
                    value={photo.category}
                    onChange={(e) => handleUpdatePhotoCategory(photo.id, e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <SaveButton 
            onSave={async () => { 
                if (typeof onSave === 'function') {
                    const ok = await onSave(); 
                    if (ok) setIsDirty(false); 
                    return ok;
                }
                return false;
            }} 
            isSaving={isSaving} 
            isDirty={isDirty}
            className="w-full sm:w-auto h-11 sm:h-10"
          />
          <Button
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-black h-11 sm:h-10 w-full sm:w-auto font-bold"
          >
            Continuer
          </Button>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        feature="photos"
        currentPlan={currentPlan}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Supprimer la catégorie ?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-gray-950">"{categoryToDelete}"</strong> ? 
              Les photos associées à cette catégorie ne seront pas supprimées, mais elles n'auront plus de catégorie assignée (onglet "Toutes").
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setCategoryToDelete(null);
                setDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmRemoveCategory}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Delete Confirmation Dialog */}
      <Dialog open={photoDeleteConfirmOpen} onOpenChange={setPhotoDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Supprimer la photo ?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Êtes-vous sûr de vouloir supprimer cette photo de votre portfolio ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setPhotoToDelete(null);
                setPhotoDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmRemovePhoto}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
