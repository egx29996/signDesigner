import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useConfiguratorStore } from '../../stores/configurator-store';
import { usePackageStore } from '../../stores/package-store';
import { SignHero } from './SignHero';
import { StepNav } from './StepNav';
import { FamilyStep } from './steps/FamilyStep';
import { SignTypeStep } from './steps/SignTypeStep';
import { MaterialStep } from './steps/MaterialStep';
import { FaceColorStep } from './steps/FaceColorStep';
import { TextAccentStep } from './steps/TextAccentStep';
import { PictogramStep } from './steps/PictogramStep';
import { ContentStep } from './steps/ContentStep';
import { QuantitiesStep } from './steps/QuantitiesStep';
import { ReviewStep } from './steps/ReviewStep';

const STEP_COMPONENTS: Record<string, React.FC> = {
  'family': FamilyStep,
  'sign-type': SignTypeStep,
  'material': MaterialStep,
  'face-color': FaceColorStep,
  'text-accent': TextAccentStep,
  'pictogram': PictogramStep,
  'content': ContentStep,
  'quantities': QuantitiesStep,
  'review': ReviewStep,
};

// ---------------------------------------------------------------------------
// Main Configurator Shell
// ---------------------------------------------------------------------------

export const Configurator: React.FC = () => {
  const navigate = useNavigate();
  const { currentStep, currentStepIndex, totalSteps, isTransitioning, transitionDirection } =
    useConfiguratorStore();
  const packageName = usePackageStore((s) => s.packageName);

  const handleClose = () => {
    navigate('/');
  };

  // Slide animation classes
  const contentClasses = isTransitioning
    ? transitionDirection === 'forward'
      ? 'opacity-0 translate-x-8'
      : 'opacity-0 -translate-x-8'
    : 'opacity-100 translate-x-0';

  return (
    <div
      data-theme="light"
      className="min-h-screen flex flex-col bg-white text-gray-900"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ---- Top bar ---- */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white z-20">
        {/* Logo / brand */}
        <div className="flex items-center gap-3">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: '#1a3c5e' }}
          >
            EGX
          </span>
          {packageName && packageName !== 'Untitled Package' && (
            <span className="text-xs text-gray-400 hidden sm:inline">
              {packageName}
            </span>
          )}
        </div>

        {/* Step indicator (center) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-gray-900">
            {currentStep.label}
          </span>
          <span className="text-gray-400">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close configurator"
        >
          <X size={20} />
        </button>
      </header>

      {/* ---- Hero (sign preview) ---- */}
      <SignHero />

      {/* ---- Step content area ---- */}
      <div className="border-t border-gray-100 bg-white">
        <div
          className={`max-w-4xl mx-auto px-6 py-6 transition-all duration-200 ease-out ${contentClasses}`}
        >
          {(() => {
            const StepComponent = STEP_COMPONENTS[currentStep.id];
            return StepComponent ? <StepComponent /> : null;
          })()}
        </div>
      </div>

      {/* ---- Bottom navigation ---- */}
      <StepNav />
    </div>
  );
};
