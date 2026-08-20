import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OnboardingStep {
  id: string;
  targetId: string; // matches data-onboarding-id
  title: string;
  explanation: string;
  type: 'action' | 'info';
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right';
  targetRoute?: string;
}

interface CapCutOnboardingSpotlightProps {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isActive: boolean;
  onNextStep?: () => void;
  onSkip?: () => void;
  onClose?: () => void;
  onComplete?: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const CapCutOnboardingSpotlight: React.FC<CapCutOnboardingSpotlightProps> = ({
  steps,
  currentStepIndex,
  isActive,
  onNextStep,
  onSkip,
  onClose,
}) => {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number; placement: string }>({ top: 0, left: 0, placement: 'bottom' });
  const [celebration] = useState<string | null>(null);
  const currentStep = steps[currentStepIndex];

  const updateTargetRect = useCallback(() => {
    if (!currentStep || !isActive) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(`[data-onboarding-id="${currentStep.targetId}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 10;
      const newRect = {
        top: Math.max(0, rect.top - padding),
        left: Math.max(0, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      };
      setTargetRect(newRect);

      // Compute card placement
      const cardWidth = 320;
      const cardHeight = 160;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let placement = currentStep.preferredPlacement || 'bottom';
      let top = 0;
      let left = 0;

      // Bottom placement fallback
      if (placement === 'bottom' && newRect.top + newRect.height + cardHeight + 20 < viewportHeight) {
        top = newRect.top + newRect.height + 16;
        left = Math.min(Math.max(16, newRect.left + newRect.width / 2 - cardWidth / 2), viewportWidth - cardWidth - 16);
      } else if (newRect.top - cardHeight - 20 > 0) {
        placement = 'top';
        top = newRect.top - cardHeight - 16;
        left = Math.min(Math.max(16, newRect.left + newRect.width / 2 - cardWidth / 2), viewportWidth - cardWidth - 16);
      } else {
        // Default floating center bottom
        placement = 'bottom';
        top = Math.min(newRect.top + newRect.height + 16, viewportHeight - cardHeight - 20);
        left = Math.min(Math.max(16, newRect.left), viewportWidth - cardWidth - 16);
      }

      setCardPos({ top, left, placement });
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    const interval = setInterval(updateTargetRect, 500);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
      clearInterval(interval);
    };
  }, [updateTargetRect]);

  if (!isActive || !currentStep || !targetRect) {
    return null;
  }

  // Calculate SVG arrow curve
  const arrowStartX = cardPos.left + 160;
  const arrowStartY = cardPos.placement === 'top' ? cardPos.top + 150 : cardPos.top;
  const arrowEndX = targetRect.left + targetRect.width / 2;
  const arrowEndY = cardPos.placement === 'top' ? targetRect.top + targetRect.height : targetRect.top;

  const controlX = (arrowStartX + arrowEndX) / 2 + (cardPos.placement === 'top' ? 20 : -20);
  const controlY = (arrowStartY + arrowEndY) / 2;

  const arrowPath = `M ${arrowStartX} ${arrowStartY} Q ${controlX} ${controlY} ${arrowEndX} ${arrowEndY}`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none transition-all duration-300">
      {/* Semi-transparent Backdrop Overlay with Box-Shadow Hole Punch */}
      <div
        className="absolute transition-all duration-300 rounded-2xl ring-2 ring-[#4caf50] shadow-[0_0_25px_rgba(76,175,80,0.5)] pointer-events-none"
        style={{
          top: `${targetRect.top}px`,
          left: `${targetRect.left}px`,
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`,
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.72), 0 0 25px rgba(76, 175, 80, 0.5)',
        }}
      />

      {/* SVG Curved Dashed Arrow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-50">
        <defs>
          <marker
            id="capcut-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 Z" fill="#4caf50" />
          </marker>
        </defs>
        <path
          d={arrowPath}
          fill="none"
          stroke="#4caf50"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          markerEnd="url(#capcut-arrowhead)"
          className="animate-drawArrow opacity-90"
        />
      </svg>

      {/* CapCut Coach Card */}
      <div
        className="absolute z-50 pointer-events-auto transition-all duration-300 ease-out"
        style={{
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
          width: '320px',
        }}
      >
        <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-5 relative space-y-3 transform transition-all duration-200 hover:scale-[1.01]">
          {/* Top Bar / Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#4caf50]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Coach Vanda</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStepIndex ? 'bg-[#4caf50] w-4' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={onClose || onSkip}
                className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
                title="Fermer l'onboarding"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coach Message */}
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base text-slate-100 leading-tight tracking-tight">
              {currentStep.title}
            </h4>
            {currentStep.explanation && (
              <p className="text-xs text-slate-300 leading-normal font-normal">
                {currentStep.explanation}
              </p>
            )}
          </div>

          {/* Celebration Indicator */}
          {celebration && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2 flex items-center gap-2 text-xs text-emerald-300 font-medium animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-[#4caf50] shrink-0" />
              <span>{celebration}</span>
            </div>
          )}

          {/* Card Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              Passer
            </button>
            {currentStep.type === 'info' ? (
              <Button
                onClick={onNextStep}
                size="sm"
                className="bg-[#4caf50] hover:bg-[#45a049] text-white font-bold text-xs h-8 px-4 rounded-xl shadow-lg gap-1"
              >
                <span>Continuer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <div className="text-[11px] text-slate-300 font-medium bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                Action requise ci-dessus 👆
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
