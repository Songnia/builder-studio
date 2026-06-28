import { PenLine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { builderSteps } from '@/types/builder';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';

interface BuilderLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
  embedded?: boolean;
  /** True if the user has already saved/built a site at least once */
  hasSiteBuilt?: boolean;
}

export function BuilderLayout({
  children,
  currentStep,
  onStepChange,
  embedded = false,
  hasSiteBuilt = false
}: BuilderLayoutProps) {
  const currentStepData = builderSteps[currentStep];
  const progress = ((currentStep + 1) / builderSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Hide if embedded in admin dashboard */}
      {!embedded && (
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo + badge contextuel */}
              <div className="flex items-center gap-3">
                <img
                  src={vandaLogo}
                  alt="Vanda Studio Logo"
                  style={{ height: '42px', objectFit: 'contain' }}
                />
                <div>
                  <h1 className="font-bold text-lg leading-tight" style={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>VANDA Builder</h1>
                  <p className="text-xs text-gray-500">Créez votre site en quelques minutes</p>
                </div>
                {/* Badge état utilisateur — visible uniquement à partir du step 1 */}
                {currentStep > 0 && (
                  hasSiteBuilt ? (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                      <PenLine className="w-3 h-3" />
                      Modification en cours
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <Sparkles className="w-3 h-3" />
                      Première création
                    </span>
                  )
                )}
              </div>

              {/* Progress */}
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Étape {currentStep + 1} sur {builderSteps.length}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </header>
      )}

      {/* Step Indicator - Always show in builder */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <StepIndicator
            currentStep={currentStep}
            onStepClick={onStepChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 mx-auto w-full transition-all duration-300 ${
        currentStepData.id === 'preview'
          ? 'max-w-full px-0 py-0 sm:py-4 md:py-8'
          : 'max-w-4xl px-4 py-4 md:py-8'
      }`}>
        {/* Step Title */}
        <div className={currentStepData.id === 'preview' ? 'mb-3 sm:mb-6 px-3 sm:px-0 mt-3 sm:mt-0' : 'mb-6'}>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{currentStepData.title}</h2>
          <p className="text-sm text-gray-500 hidden sm:block">{currentStepData.description}</p>
        </div>

        {/* Content */}
        <div className={currentStepData.id === 'preview' ? '' : 'bg-white rounded-xl shadow-sm border p-6 md:p-8'}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {!embedded && (
        <footer className="bg-white border-t py-4">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            VANDA Builder - Créez un site professionnel pour votre activité photo
          </div>
        </footer>
      )}
    </div>
  );
}
