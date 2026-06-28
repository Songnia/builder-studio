import { useState, useRef, useEffect } from 'react';
import { Plus, X, Briefcase, Edit2, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig, Service } from '@/types/builder';
import { uploadBuilderMedia } from '@/services/mediaService';

interface ServicesStepProps {
  config: SiteConfig;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onRemoveService: (id: string) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

export function ServicesStep({ 
  config, 
  onAddService, 
  onRemoveService, 
  onUpdateService,
  onNext, 
  onPrev,
  onSave,
  isSaving
}: ServicesStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [services, setServices] = useState(config.services);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [serviceDeleteConfirmOpen, setServiceDeleteConfirmOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    features: [''],
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const newImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setServices(config.services);
  }, [config.services]);

  // --- Handlers ---
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadBuilderMedia(file, 'services');
      setter(url);
      setIsDirty(true);
    } catch (err) {
      console.error('Service image upload failed:', err);
      alert('Erreur lors de l\'upload de l\'image du service.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddService = () => {
    if (newService.title && newService.description) {
      const serviceData: Omit<Service, 'id'> = {
        title: newService.title,
        description: newService.description,
        features: newService.features.filter(f => f.trim() !== ''),
        image: newService.image || undefined
      };
      onAddService(serviceData);
      setServices(prev => [...prev, { id: Date.now().toString(), ...serviceData }]);
      setNewService({ title: '', description: '', features: [''], image: '' });
      setDialogOpen(false);
      setIsDirty(true);
    }
  };

  const handleRemoveService = (id: string) => {
    onRemoveService(id);
    setServices(prev => prev.filter(s => s.id !== id));
    setIsDirty(true);
  };

  const initiateRemoveService = (id: string) => {
    setServiceToDelete(id);
    setServiceDeleteConfirmOpen(true);
  };

  const confirmRemoveService = () => {
    if (serviceToDelete) {
      handleRemoveService(serviceToDelete);
      setServiceToDelete(null);
      setServiceDeleteConfirmOpen(false);
    }
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    onUpdateService(id, updates);
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    setIsDirty(true);
  };

  const addFeature = () => {
    setNewService(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Vos Services</h2>
        <p className="text-gray-600">Décrivez les prestations que vous proposez</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Services ({services.length})</h3>
          </div>

          {/* ── Dialog : Nouveau service ── */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold text-xs h-8 sm:h-10 px-3">
                <Plus className="w-3 h-3 mr-1.5" />
                Ajouter un service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">

                {/* Image du service */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image du service
                  </Label>
                  <input
                    ref={newImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, (url) =>
                        setNewService(prev => ({ ...prev, image: url }))
                      )
                    }
                  />
                  {newService.image ? (
                    <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                      <img
                        src={newService.image}
                        alt="Aperçu service"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-white/20"
                          onClick={() => newImageInputRef.current?.click()}
                        >
                          Changer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white border-white hover:bg-white/20"
                          onClick={() => setNewService(prev => ({ ...prev, image: '' }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => newImageInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors ${
                        isUploading 
                        ? 'border-green-300 bg-green-50/20 cursor-wait' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                      }`}
                    >
                      <Upload className={`w-8 h-8 ${isUploading ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-500">
                        {isUploading ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
                      </span>
                      {!isUploading && <span className="text-xs text-gray-400">PNG, JPG jusqu'à 10 MB</span>}
                    </button>
                  )}
                </div>

                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="serviceTitle">Nom du service *</Label>
                  <Input
                    id="serviceTitle"
                    value={newService.title}
                    onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Shooting Portrait"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">Description *</Label>
                  <Textarea
                    id="serviceDescription"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez ce service..."
                    rows={3}
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Inclus dans ce service</Label>
                  {newService.features?.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Élément ${index + 1}`}
                      />
                      {(newService.features?.length || 0) > 1 && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addFeature} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un élément
                  </Button>
                </div>

                <Button 
                  onClick={handleAddService}
                  disabled={!newService.title || !newService.description}
                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                >
                  Ajouter le service
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ── Liste des services ── */}
        {services.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aucun service défini</p>
            <p className="text-sm text-gray-400">Ajoutez vos prestations pour les afficher sur votre site</p>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={service.id} className="p-4">
                {editingService === service.id ? (
                  <EditServiceForm 
                    service={service}
                    onSave={(updates) => {
                      handleUpdateService(service.id, updates);
                      setEditingService(null);
                    }}
                    onCancel={() => setEditingService(null)}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Thumbnail */}
                    {service.image ? (
                      <div className="w-full sm:w-24 aspect-video sm:aspect-square rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-green-600">{index + 1}</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <h4 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight break-words flex-1 min-w-0">{service.title}</h4>
                        <div className="flex justify-center sm:justify-end gap-2 flex-shrink-0">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-9 w-9 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-600"
                            onClick={() => setEditingService(service.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-9 w-9 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600"
                            onClick={() => initiateRemoveService(service.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                      
                      {(service.features || []).length > 0 && (
                        <ul className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
                          {(service.features || []).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </Card>
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

      {/* Service Delete Confirmation Dialog */}
      <Dialog open={serviceDeleteConfirmOpen} onOpenChange={setServiceDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Supprimer le service ?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setServiceToDelete(null);
                setServiceDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmRemoveService}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Formulaire d'édition ──────────────────────────────────────────────────────
function EditServiceForm({ 
  service, 
  onSave, 
  onCancel 
}: { 
  service: Service;
  onSave: (updates: Partial<Service>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: service.title || '',
    description: service.description || '',
    features: service.features || [],
    image: service.image || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadBuilderMedia(file, 'services');
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Service image upload failed:', err);
      alert('Erreur lors de l\'upload de l\'image.');
    } finally {
      setIsUploading(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">

      {/* Image */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image du service
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {formData.image ? (
          <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
            <img
              src={formData.image}
              alt="Aperçu service"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/20"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/20"
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-2 transition-colors ${
              isUploading 
              ? 'border-green-300 bg-green-50/20 cursor-wait' 
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            <Upload className={`w-6 h-6 ${isUploading ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-500">
              {isUploading ? 'Upload en cours...' : 'Ajouter une image'}
            </span>
          </button>
        )}
      </div>

      {/* Nom */}
      <div className="space-y-2">
        <Label>Nom du service</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Éléments inclus</Label>
        {(formData.features || []).map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => removeFeature(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addFeature} size="sm">
          <Plus className="w-3 h-3 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => onSave({ ...formData, image: formData.image || undefined })}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
