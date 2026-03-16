import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import { FAMILIES, type FamilyTier } from '../../../lib/families-data';
import { getDefaultZones } from '../../../lib/sign-type-defaults';
import { usePackageStore } from '../../../stores/package-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';
import { SignRenderer } from '../../svg/SignRenderer';
import type { SignTypeState, DesignTokens } from '../../../types';

// ---------------------------------------------------------------------------
// Tier badge colors
// ---------------------------------------------------------------------------

const TIER_CONFIG: Record<FamilyTier, { label: string; bg: string; text: string }> = {
  good: { label: 'Good', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  better: { label: 'Better', bg: 'bg-blue-50', text: 'text-blue-700' },
  best: { label: 'Best', bg: 'bg-amber-50', text: 'text-amber-700' },
  premium: { label: 'Premium', bg: 'bg-purple-50', text: 'text-purple-700' },
};

// ---------------------------------------------------------------------------
// Build a preview sign type for rendering a Room ID in each family
// ---------------------------------------------------------------------------

function buildPreviewSignType(): SignTypeState {
  return {
    id: 'room_id',
    typeCode: 'H',
    typeName: 'Room ID',
    size: { w: 8, h: 8 },
    zones: getDefaultZones('H'),
    tokenOverrides: {},
    quantity: 0,
  };
}

// ---------------------------------------------------------------------------
// FamilyStep
// ---------------------------------------------------------------------------

export const FamilyStep: React.FC = () => {
  const familyId = usePackageStore((s) => s.familyId);
  const loadFamily = usePackageStore((s) => s.loadFamily);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const previewSign = React.useMemo(() => buildPreviewSignType(), []);

  const handleSelect = useCallback(
    (id: string) => {
      loadFamily(id);
      setTimeout(() => nextStep(), 300);
    },
    [loadFamily, nextStep],
  );

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Sign Family</h2>
        <p className="mt-2 text-sm text-gray-500">
          Each family sets the design direction — materials, colors, and construction style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FAMILIES.map((family) => {
          const selected = familyId === family.id;
          const tier = TIER_CONFIG[family.tier];

          return (
            <button
              key={family.id}
              onClick={() => handleSelect(family.id)}
              className={[
                'relative flex flex-col items-center rounded-xl p-5 text-left transition-all duration-200 cursor-pointer',
                'border bg-white',
                selected
                  ? 'border-2 border-[#1a3c5e] bg-blue-50/50 shadow-md'
                  : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5',
              ].join(' ')}
            >
              {/* Selected check */}
              {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1a3c5e] flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Sign preview */}
              <div className="w-full flex justify-center py-3">
                <SignRenderer
                  signType={previewSign}
                  resolvedTokens={family.defaultTokens}
                  familyId={family.id}
                  scale={0.7}
                />
              </div>

              {/* Family name + tier badge */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-lg font-bold text-gray-900">{family.name}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.bg} ${tier.text}`}
                >
                  {tier.label}
                </span>
              </div>

              {/* Description */}
              <p className="mt-1.5 text-sm text-gray-500 text-center leading-relaxed line-clamp-2">
                {family.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
