import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfiguratorStore, CONFIGURATOR_STEPS } from '../../stores/configurator-store';
import { StepProgress } from './StepProgress';

export const StepNav: React.FC = () => {
  const { currentStepIndex, canGoPrev, canGoNext, prevStep, nextStep } =
    useConfiguratorStore();

  const isLastStep = currentStepIndex === CONFIGURATOR_STEPS.length - 1;
  const prevLabel = canGoPrev
    ? CONFIGURATOR_STEPS[currentStepIndex - 1].label
    : '';
  const nextLabel =
    !isLastStep && canGoNext
      ? CONFIGURATOR_STEPS[currentStepIndex + 1].label
      : '';

  return (
    <div
      className="sticky bottom-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200"
      style={{ minHeight: 64 }}
    >
      {/* Back */}
      <div className="flex-1 flex justify-start">
        {canGoPrev && (
          <button
            onClick={prevStep}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">{prevLabel}</span>
            <span className="sm:hidden">Back</span>
          </button>
        )}
      </div>

      {/* Center — progress */}
      <div className="flex-shrink-0">
        <StepProgress />
      </div>

      {/* Next / CTA */}
      <div className="flex-1 flex justify-end">
        {isLastStep ? (
          <button
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors"
            style={{
              backgroundColor: '#c9a84c',
              color: '#ffffff',
            }}
          >
            Submit for Quote
            <ChevronRight size={16} />
          </button>
        ) : canGoNext ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#1a3c5e' }}
          >
            <span className="hidden sm:inline">{nextLabel}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
