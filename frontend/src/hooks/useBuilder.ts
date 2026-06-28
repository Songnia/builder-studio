import { useState, useCallback, useEffect, useRef } from 'react';
import type { SiteConfig } from '@/types/builder';
import { defaultSiteConfig } from '@/types/builder';
import { siteConfigService } from '@/services/siteConfigService';
import { persistSiteConfigAssets } from '@/utils/siteConfigAssets';

// ── localStorage keys ──────────────────────────────────────────────────────────
const LS_STEP = 'vanda_current_step';
const LS_HAS_BUILT = 'vanda_has_built_site';
const TOTAL_STEPS = 9;

export function useBuilder() {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSiteBuilt, setHasSiteBuilt] = useState(false);
  const configIdRef = useRef<number | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configs = await siteConfigService.getMyConfigs();
        if (configs && configs.length > 0) {
          // Existing config found → user is returning to modify
          setConfig(configs[0].config_data);
          configIdRef.current = configs[0].id;
          setHasSiteBuilt(true);
          localStorage.setItem(LS_HAS_BUILT, 'true');

          // Restore the last step (minimum step 1 — skip Welcome)
          const savedStep = parseInt(localStorage.getItem(LS_STEP) || '1', 10);
          const restoredStep = Math.max(1, Math.min(savedStep, TOTAL_STEPS));
          setCurrentStep(restoredStep);
        } else {
          // No config → first time
          setHasSiteBuilt(false);
          localStorage.setItem(LS_HAS_BUILT, 'false');
          // Restore step only if user was already navigating (step 0 = Welcome)
          const savedStep = parseInt(localStorage.getItem(LS_STEP) || '0', 10);
          setCurrentStep(Math.max(0, Math.min(savedStep, TOTAL_STEPS)));
        }
      } catch (error) {
        console.error("Failed to load site config:", error);
        // Fall back to localStorage state if API fails
        const savedStep = parseInt(localStorage.getItem(LS_STEP) || '0', 10);
        const savedBuilt = localStorage.getItem(LS_HAS_BUILT) === 'true';
        setCurrentStep(savedStep);
        setHasSiteBuilt(savedBuilt);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const updateConfig = useCallback((updates: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateNestedConfig = useCallback(<K extends keyof SiteConfig>(
    key: K,
    value: SiteConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const addPhoto = useCallback((photo: { url: string; category: string }) => {
    const newPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...photo
    };
    setConfig(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
  }, []);

  const addPhotos = useCallback((newPhotos: { url: string; category: string }[]) => {
    const photosWithIds = newPhotos.map((photo, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      ...photo
    }));
    setConfig(prev => ({
      ...prev,
      photos: [...prev.photos, ...photosWithIds]
    }));
  }, []);

  const removePhoto = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== id)
    }));
  }, []);

  const updatePhoto = useCallback((id: string, updates: Partial<SiteConfig['photos'][number]>) => {
    setConfig(prev => ({
      ...prev,
      photos: prev.photos.map(photo => photo.id === id ? { ...photo, ...updates } : photo)
    }));
  }, []);

  const addService = useCallback((service: Omit<typeof config.services[0], 'id'>) => {
    const newService = {
      id: Date.now().toString(),
      ...service
    };
    setConfig(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  }, []);

  const removeService = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  }, []);

  const updateService = useCallback((id: string, updates: Partial<typeof config.services[0]>) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  }, []);

  const addPricingPlan = useCallback((plan: Omit<typeof config.pricingPlans[0], 'id'>) => {
    const newPlan = {
      id: Date.now().toString(),
      ...plan
    };
    setConfig(prev => ({
      ...prev,
      pricingPlans: [...prev.pricingPlans, newPlan]
    }));
  }, []);

  const removePricingPlan = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter(p => p.id !== id)
    }));
  }, []);

  const updatePricingPlan = useCallback((id: string, updates: Partial<typeof config.pricingPlans[0]>) => {
    setConfig(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  }, []);

  const addTestimonial = useCallback((testimonial: Omit<typeof config.testimonials[0], 'id'>) => {
    const newTestimonial = {
      id: Date.now().toString(),
      ...testimonial
    };
    setConfig(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
  }, []);

  const removeTestimonial = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  }, []);

  const updateTestimonial = useCallback((id: string, updates: Partial<typeof config.testimonials[0]>) => {
    setConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const toggleSection = useCallback((section: keyof typeof config.enabledSections) => {
    setConfig(prev => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [section]: !prev.enabledSections[section]
      }
    }));
  }, []);

  /** Persist step to localStorage and advance. */
  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, TOTAL_STEPS);
      localStorage.setItem(LS_STEP, String(next));
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = Math.max(prev - 1, 0);
      localStorage.setItem(LS_STEP, String(next));
      return next;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(step, TOTAL_STEPS));
    localStorage.setItem(LS_STEP, String(clamped));
    setCurrentStep(clamped);
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultSiteConfig);
    configIdRef.current = null;
    setCurrentStep(0);
    setHasSiteBuilt(false);
    localStorage.setItem(LS_STEP, '0');
    localStorage.setItem(LS_HAS_BUILT, 'false');
  }, []);

  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  /**
   * Saves the current config to the API (create or update).
   * Returns true on success, false on error.
   */
  const saveConfig = useCallback(async (updatesFromStep?: Partial<SiteConfig>): Promise<boolean> => {
    setIsSaving(true);
    try {
      const configToSave = updatesFromStep
        ? { ...config, ...updatesFromStep }
        : config;

      const preparedConfig = await persistSiteConfigAssets(configToSave);

      if (configIdRef.current !== null) {
        // Update existing config
        const result = await siteConfigService.update(
          configIdRef.current,
          preparedConfig,
          preparedConfig.siteName
        );
        setConfig(preparedConfig);
        // Mark site as built after first successful save
        setHasSiteBuilt(true);
        localStorage.setItem(LS_HAS_BUILT, 'true');
      } else {
        // Create new config
        const result = await siteConfigService.create(
          preparedConfig,
          preparedConfig.siteName
        );
        configIdRef.current = result.data.id;
        setConfig(preparedConfig);
        // Mark site as built after creation
        setHasSiteBuilt(true);
        localStorage.setItem(LS_HAS_BUILT, 'true');
      }
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  return {
    config,
    currentStep,
    isPreviewMode,
    isLoading,
    isSaving,
    hasSiteBuilt,
    updateConfig,
    updateNestedConfig,
    addPhoto,
    addPhotos,
    removePhoto,
    updatePhoto,
    addService,
    removeService,
    updateService,
    addPricingPlan,
    removePricingPlan,
    updatePricingPlan,
    addTestimonial,
    removeTestimonial,
    updateTestimonial,
    toggleSection,
    nextStep,
    prevStep,
    goToStep,
    togglePreviewMode,
    resetConfig,
    exportConfig,
    saveConfig
  };
}
