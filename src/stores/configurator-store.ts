import { create } from 'zustand';

export interface ConfiguratorStep {
  id: string;
  label: string;
  shortLabel: string;
}

export const CONFIGURATOR_STEPS: ConfiguratorStep[] = [
  { id: 'family', label: 'Sign Family', shortLabel: 'Family' },
  { id: 'sign-type', label: 'Sign Type', shortLabel: 'Type' },
  { id: 'material', label: 'Face Material', shortLabel: 'Material' },
  { id: 'face-color', label: 'Face Color', shortLabel: 'Face' },
  { id: 'text-accent', label: 'Text & Accent', shortLabel: 'Colors' },
  { id: 'pictogram', label: 'Pictogram Style', shortLabel: 'Pictogram' },
  { id: 'content', label: 'Sign Content', shortLabel: 'Content' },
  { id: 'quantities', label: 'Quantities', shortLabel: 'Qty' },
  { id: 'review', label: 'Review Package', shortLabel: 'Review' },
];

interface ConfiguratorState {
  currentStepIndex: number;
  currentStep: ConfiguratorStep;
  totalSteps: number;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'backward';

  // Navigation
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;

  // Reset
  reset: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>()((set, get) => ({
  currentStepIndex: 0,
  currentStep: CONFIGURATOR_STEPS[0],
  totalSteps: CONFIGURATOR_STEPS.length,
  isTransitioning: false,
  transitionDirection: 'forward' as const,
  canGoNext: true,
  canGoPrev: false,

  goToStep(index: number) {
    const clamped = Math.max(0, Math.min(index, CONFIGURATOR_STEPS.length - 1));
    const direction = clamped > get().currentStepIndex ? 'forward' : 'backward';
    set({
      isTransitioning: true,
      transitionDirection: direction,
    });
    setTimeout(() => {
      set({
        currentStepIndex: clamped,
        currentStep: CONFIGURATOR_STEPS[clamped],
        canGoNext: clamped < CONFIGURATOR_STEPS.length - 1,
        canGoPrev: clamped > 0,
        isTransitioning: false,
      });
    }, 200);
  },

  nextStep() {
    const { currentStepIndex } = get();
    if (currentStepIndex < CONFIGURATOR_STEPS.length - 1) {
      get().goToStep(currentStepIndex + 1);
    }
  },

  prevStep() {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      get().goToStep(currentStepIndex - 1);
    }
  },

  reset() {
    set({
      currentStepIndex: 0,
      currentStep: CONFIGURATOR_STEPS[0],
      isTransitioning: false,
      transitionDirection: 'forward' as const,
      canGoNext: true,
      canGoPrev: false,
    });
  },
}));
