import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import { usePackageStore } from '../../../stores/package-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';
import { renderPictogram } from '../../svg/pictograms/PictogramRenderer';

// ---------------------------------------------------------------------------
// Pictogram family definitions
// ---------------------------------------------------------------------------

const PICTOGRAM_FAMILIES: {
  id: 'geometric' | 'rounded' | 'bold';
  name: string;
  description: string;
}[] = [
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Clean geometric lines with precise angles. The modern standard.',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    description: 'Soft rounded forms with friendly curves. Warm and approachable.',
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Heavy bold weight with strong presence. High visibility and impact.',
  },
];

// ---------------------------------------------------------------------------
// PictogramPreview — renders a restroom_unisex icon in a mini SVG
// ---------------------------------------------------------------------------

interface PreviewProps {
  family: 'geometric' | 'rounded' | 'bold';
  color: string;
}

const PictogramPreview: React.FC<PreviewProps> = ({ family, color }) => {
  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.35;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      {renderPictogram({ icon: 'restroom_unisex', cx, cy, s, color, family })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// PictogramStep
// ---------------------------------------------------------------------------

export const PictogramStep: React.FC = () => {
  const pictogramFamily = usePackageStore((s) => s.designTokens.pictogramFamily);
  const raisedTextColor = usePackageStore((s) => s.designTokens.raisedTextColor);
  const setToken = usePackageStore((s) => s.setToken);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const handleSelect = useCallback(
    (id: 'geometric' | 'rounded' | 'bold') => {
      setToken('pictogramFamily', id);
      setTimeout(() => nextStep(), 300);
    },
    [setToken, nextStep],
  );

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Pictogram Style</h2>
        <p className="mt-2 text-sm text-gray-500">
          Choose the icon style used for restrooms, stairwells, and safety signs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PICTOGRAM_FAMILIES.map((fam) => {
          const selected = pictogramFamily === fam.id;

          return (
            <button
              key={fam.id}
              onClick={() => handleSelect(fam.id)}
              className={[
                'relative flex flex-col items-center rounded-xl p-6 transition-all duration-200 cursor-pointer',
                'border bg-white',
                selected
                  ? 'border-2 border-[#1a3c5e] bg-blue-50/50 ring-2 ring-[#1a3c5e]/20 shadow-md'
                  : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5',
              ].join(' ')}
            >
              {/* Selected check */}
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1a3c5e] flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Pictogram preview */}
              <div className="mb-4">
                <PictogramPreview family={fam.id} color={raisedTextColor} />
              </div>

              {/* Label */}
              <span className="text-base font-bold text-gray-900">{fam.name}</span>

              {/* Description */}
              <p className="mt-1.5 text-sm text-gray-500 text-center leading-relaxed">
                {fam.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
