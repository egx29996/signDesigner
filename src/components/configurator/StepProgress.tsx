import React from 'react';
import { useConfiguratorStore, CONFIGURATOR_STEPS } from '../../stores/configurator-store';

export const StepProgress: React.FC = () => {
  const { currentStepIndex, totalSteps, currentStep } = useConfiguratorStore();
  const pct = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Step label */}
      <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">
        <span className="font-bold text-gray-900">{currentStep.label}</span>
        {' '}
        <span className="text-gray-400">
          {currentStepIndex + 1}/{totalSteps}
        </span>
      </span>

      {/* Progress bar */}
      <div className="w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: '#1a3c5e',
          }}
        />
      </div>

      {/* Dots (hidden on small screens) */}
      <div className="hidden sm:flex items-center gap-1 mt-0.5">
        {CONFIGURATOR_STEPS.map((step, i) => (
          <div
            key={step.id}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
            style={{
              backgroundColor:
                i <= currentStepIndex ? '#1a3c5e' : '#e5e7eb',
            }}
          />
        ))}
      </div>
    </div>
  );
};
