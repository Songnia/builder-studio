import { useState } from 'react';
import { Plus, X, MessageSquare, Star, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig, Testimonial } from '@/types/builder';

interface TestimonialsStepProps {
  config: SiteConfig;
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  onRemoveTestimonial: (id: string) => void;
  onUpdateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

export function TestimonialsStep({ 
  config, 
  onAddTestimonial, 
  onRemoveTestimonial, 
  onUpdateTestimonial,
  onNext, 
  onPrev,
  onSave,
  isSaving
}: TestimonialsStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [testimonials, setTestimonials] = useState(config.testimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [testimonialDeleteConfirmOpen, setTestimonialDeleteConfirmOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });

  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.content) {
      onAddTestimonial(newTestimonial);
      setTestimonials(prev => [...prev, { id: Date.now().toString(), ...newTestimonial }]);
      setNewTestimonial({ name: '', role: '', content: '', rating: 5 });
      setDialogOpen(false);
      setIsDirty(true);
    }
  };

  const handleRemoveTestimonial = (id: string) => {
    onRemoveTestimonial(id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
    setIsDirty(true);
  };

  const initiateRemoveTestimonial = (id: string) => {
    setTestimonialToDelete(id);
    setTestimonialDeleteConfirmOpen(true);
  };

  const confirmRemoveTestimonial = () => {
    if (testimonialToDelete) {
      handleRemoveTestimonial(testimonialToDelete);
      setTestimonialToDelete(null);
      setTestimonialDeleteConfirmOpen(false);
    }
  };

  const handleUpdateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    onUpdateTestimonial(id, updates);
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setIsDirty(true);
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star 
              className={`w-5 h-5 ${star <= rating ? 'fill-green-400 text-green-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Témoignages Clients</h2>
        <p className="text-gray-600">Ajoutez les avis de vos clients satisfaits</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Avis ({testimonials.length})</h3>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold text-xs h-8 sm:h-10 px-3">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Ajouter un témoignage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouveau témoignage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom du client *</Label>
                  <Input
                    id="clientName"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Marie Dupont"
                  />
                </div>

                {/* Rôle */}
                <div className="space-y-2">
                  <Label htmlFor="clientRole">Type de prestation / Rôle</Label>
                  <Input
                    id="clientRole"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Ex: Shooting Mariage"
                  />
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label>Note</Label>
                  {renderStars(newTestimonial.rating, true, (rating) => 
                    setNewTestimonial(prev => ({ ...prev, rating }))
                  )}
                </div>

                {/* Contenu */}
                <div className="space-y-2">
                  <Label htmlFor="testimonialContent">Témoignage *</Label>
                  <Textarea
                    id="testimonialContent"
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Le témoignage du client..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleAddTestimonial}
                  disabled={!newTestimonial.name || !newTestimonial.content}
                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                >
                  Ajouter le témoignage
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aucun témoignage</p>
            <p className="text-sm text-gray-400">Ajoutez les avis de vos clients pour renforcer votre crédibilité</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-5">
                {editingTestimonial === testimonial.id ? (
                  <EditTestimonialForm 
                    testimonial={testimonial}
                    onSave={(updates) => {
                      handleUpdateTestimonial(testimonial.id, updates);
                      setEditingTestimonial(null);
                    }}
                    onCancel={() => setEditingTestimonial(null)}
                  />
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div className="flex justify-end order-1 sm:order-2 gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-600 transition-colors"
                          onClick={() => setEditingTestimonial(testimonial.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => initiateRemoveTestimonial(testimonial.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="order-2 sm:order-1 flex justify-center sm:justify-start">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-4xl text-green-200 font-serif">"</span>
                      <p className="text-gray-700 text-sm italic -mt-4">{testimonial.content}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        {testimonial.role && (
                          <p className="text-xs text-gray-500">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </>
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

      {/* Testimonial Delete Confirmation Dialog */}
      <Dialog open={testimonialDeleteConfirmOpen} onOpenChange={setTestimonialDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Supprimer le témoignage ?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setTestimonialToDelete(null);
                setTestimonialDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmRemoveTestimonial}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour éditer un témoignage
function EditTestimonialForm({ 
  testimonial, 
  onSave, 
  onCancel 
}: { 
  testimonial: { name: string; role: string; content: string; rating: number };
  onSave: (updates: typeof testimonial) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(testimonial);

  const renderStars = (rating: number, onChange: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <Star 
              className={`w-5 h-5 ${star <= rating ? 'fill-green-400 text-green-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Rôle / Prestation</Label>
        <Input
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Note</Label>
        {renderStars(formData.rating, (rating) => 
          setFormData(prev => ({ ...prev, rating }))
        )}
      </div>
      <div className="space-y-2">
        <Label>Témoignage</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
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
