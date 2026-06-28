import { useState } from 'react';
import { Plus, X, Banknote, Edit2, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { SaveButton } from '@/builder/components/SaveButton';
import type { SiteConfig, PricingPlan } from '@/types/builder';

interface PricingStepProps {
  config: SiteConfig;
  onAddPlan: (plan: Omit<PricingPlan, 'id'>) => void;
  onRemovePlan: (id: string) => void;
  onUpdatePlan: (id: string, updates: Partial<PricingPlan>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: (updates?: Partial<SiteConfig>) => Promise<boolean>;
  isSaving: boolean;
}

export function PricingStep({ 
  config, 
  onAddPlan, 
  onRemovePlan, 
  onUpdatePlan,
  onNext, 
  onPrev,
  onSave,
  isSaving
}: PricingStepProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [plans, setPlans] = useState(config.pricingPlans);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [planDeleteConfirmOpen, setPlanDeleteConfirmOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    description: '',
    features: [''],
    recommended: false
  });

  const handleAddPlan = () => {
    if (newPlan.name && newPlan.price) {
      const planData = {
        name: newPlan.name,
        price: newPlan.price,
        description: newPlan.description,
        features: newPlan.features.filter(f => f.trim() !== ''),
        recommended: newPlan.recommended
      };
      onAddPlan(planData);
      setPlans(prev => [...prev, { id: Date.now().toString(), ...planData }]);
      setNewPlan({ name: '', price: '', description: '', features: [''], recommended: false });
      setDialogOpen(false);
      setIsDirty(true);
    }
  };

  const handleRemovePlan = (id: string) => {
    onRemovePlan(id);
    setPlans(prev => prev.filter(p => p.id !== id));
    setIsDirty(true);
  };

  const initiateRemovePlan = (id: string) => {
    setPlanToDelete(id);
    setPlanDeleteConfirmOpen(true);
  };

  const confirmRemovePlan = () => {
    if (planToDelete) {
      handleRemovePlan(planToDelete);
      setPlanToDelete(null);
      setPlanDeleteConfirmOpen(false);
    }
  };

  const handleUpdatePlan = (id: string, updates: Partial<PricingPlan>) => {
    onUpdatePlan(id, updates);
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    setIsDirty(true);
  };

  const addFeature = () => {
    setNewPlan(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <datalist id="services-list">
        {config.services?.map((service) => (
          <option key={service.id} value={service.title} />
        ))}
      </datalist>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Vos Tarifs</h2>
        <p className="text-gray-600">Définissez vos forfaits et prix</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Forfaits ({plans.length})</h3>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-semibold text-xs h-8 sm:h-10 px-3">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Ajouter un forfait
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau forfait</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="planName">Nom du forfait *</Label>
                  <Input
                    id="planName"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Forfait Premium"
                  />
                </div>

                {/* Prix */}
                <div className="space-y-2">
                  <Label htmlFor="planPrice">Prix *</Label>
                  <Input
                    id="planPrice"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Ex: 50 000 FCFA"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="planDescription">Description courte</Label>
                  <Textarea
                    id="planDescription"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez ce forfait..."
                    rows={2}
                  />
                </div>

                {/* Recommandé */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Marquer comme recommandé</span>
                  </div>
                  <Switch 
                    checked={newPlan.recommended}
                    onCheckedChange={(checked) => setNewPlan(prev => ({ ...prev, recommended: checked }))}
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Inclus dans ce forfait</Label>
                  {newPlan.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        list="services-list"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Élément ${index + 1}`}
                        autoComplete="off"
                      />
                      {newPlan.features.length > 1 && (
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
                  onClick={handleAddPlan}
                  disabled={!newPlan.name || !newPlan.price}
                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                >
                  Ajouter le forfait
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Banknote className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aucun forfait défini</p>
            <p className="text-sm text-gray-400">Ajoutez vos tarifs pour les afficher sur votre site</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`p-5 relative ${plan.recommended ? 'ring-2 ring-green-400' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      RECOMMANDÉ
                    </span>
                  </div>
                )}

                {editingPlan === plan.id ? (
                  <EditPlanForm 
                    plan={plan}
                    onSave={(updates) => {
                      handleUpdatePlan(plan.id, updates);
                      setEditingPlan(null);
                    }}
                    onCancel={() => setEditingPlan(null)}
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div className="flex justify-end gap-2 order-1 sm:order-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-600 transition-colors"
                            onClick={() => setEditingPlan(plan.id)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => initiateRemovePlan(plan.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <h4 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight order-2 sm:order-1 flex-1">
                          {plan.name}
                        </h4>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-green-600">{plan.price}</span>
                      </div>
                    </div>

                    {plan.description && (
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    )}

                    {plan.features.length > 0 && (
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {!plan.recommended && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-4 text-[11px] h-8 border-dashed hover:border-green-400 hover:text-green-600 font-semibold transition-all relative pl-8"
                        onClick={() => handleUpdatePlan(plan.id, { recommended: true })}
                      >
                        <Star className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" />
                        Marquer recommandé
                      </Button>
                    )}
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

      {/* Plan Delete Confirmation Dialog */}
      <Dialog open={planDeleteConfirmOpen} onOpenChange={setPlanDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Supprimer le forfait ?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-2">
              Êtes-vous sûr de vouloir supprimer ce forfait ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setPlanToDelete(null);
                setPlanDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmRemovePlan}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant pour éditer un forfait
function EditPlanForm({ 
  plan, 
  onSave, 
  onCancel 
}: { 
  plan: { name: string; price: string; description: string; features: string[]; recommended?: boolean };
  onSave: (updates: typeof plan) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(plan);

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
      <div className="space-y-2">
        <Label>Nom</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Prix</Label>
        <Input
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
        <span className="text-sm">Recommandé</span>
        <Switch 
          checked={formData.recommended}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recommended: checked }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Éléments inclus</Label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              list="services-list"
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder={`Élément ${index + 1}`}
              autoComplete="off"
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
