import React from 'react';
import { BuilderLayout } from '@/builder/BuilderLayout';
import { WelcomeStep } from '@/builder/steps/WelcomeStep';
import { InfoStep } from '@/builder/steps/InfoStep';
import { BrandingStep } from '@/builder/steps/BrandingStep';
import { HeroStep } from '@/builder/steps/HeroStep';
import { PortfolioStep } from '@/builder/steps/PortfolioStep';
import { ServicesStep } from '@/builder/steps/ServicesStep';
import { PricingStep } from '@/builder/steps/PricingStep';
import { TestimonialsStep } from '@/builder/steps/TestimonialsStep';
import { ContactStep } from '@/builder/steps/ContactStep';
import { PreviewStep } from '@/builder/steps/PreviewStep';
import { useBuilder } from '@/hooks/useBuilder';

const SiteBuilder: React.FC = () => {
    const {
        config,
        currentStep,
        hasSiteBuilt,
        updateConfig,
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
        nextStep,
        prevStep,
        goToStep,
        resetConfig,
        isLoading,
        isSaving,
        saveConfig
    } = useBuilder();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Chargement de votre studio...</p>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <WelcomeStep onNext={nextStep} />;
            case 1: return <InfoStep config={config} onUpdate={updateConfig} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 2: return <BrandingStep config={config} onUpdate={updateConfig} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 3: return <HeroStep config={config} onUpdate={updateConfig} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 4: return <PortfolioStep config={config} onUpdate={updateConfig} onAddPhoto={addPhoto} onAddPhotos={addPhotos} onRemovePhoto={removePhoto} onUpdatePhoto={updatePhoto} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 5: return <ServicesStep config={config} onAddService={addService} onRemoveService={removeService} onUpdateService={updateService} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 6: return <PricingStep config={config} onAddPlan={addPricingPlan} onRemovePlan={removePricingPlan} onUpdatePlan={updatePricingPlan} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 7: return <TestimonialsStep config={config} onAddTestimonial={addTestimonial} onRemoveTestimonial={removeTestimonial} onUpdateTestimonial={updateTestimonial} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 8: return <ContactStep config={config} onUpdate={updateConfig} onNext={nextStep} onPrev={prevStep} onSave={saveConfig} isSaving={isSaving} />;
            case 9: return <PreviewStep config={config} onReset={resetConfig} onPrev={prevStep} />;
            default: return <WelcomeStep onNext={nextStep} />;
        }
    };

    return (
        <BuilderLayout
            currentStep={currentStep}
            onStepChange={goToStep}
            onNext={nextStep}
            onPrev={prevStep}
            embedded={true}
            hasSiteBuilt={hasSiteBuilt}
        >
            {renderStep()}
        </BuilderLayout>
    );
};

export default SiteBuilder;
