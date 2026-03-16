import React, { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { CURATED_COLORS, EXTENDED_COLORS, getContrastColor } from '../../../lib/color-utils';
import { getFamilyById } from '../../../lib/families-data';
import { usePackageStore } from '../../../stores/package-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';
import type { ColorEntry } from '../../../types';

// ---------------------------------------------------------------------------
// Swatch component
// ---------------------------------------------------------------------------

interface SwatchProps {
  color: ColorEntry;
  selected: boolean;
  onClick: () => void;
}

const Swatch: React.FC<SwatchProps> = ({ color, selected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isLight = color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#FAF0E6';
  const contrast = getContrastColor(color.hex);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          'relative w-12 h-12 rounded-full transition-all duration-200 cursor-pointer',
          selected
            ? 'ring-2 ring-offset-2 ring-[#1a3c5e] scale-110'
            : 'hover:scale-110',
          isLight ? 'border border-gray-200' : '',
        ].join(' ')}
        style={{ backgroundColor: color.hex }}
        title={color.name}
      >
        {selected && (
          <Check
            size={16}
            className="absolute inset-0 m-auto"
            style={{ color: contrast }}
          />
        )}
      </button>

      {/* Name label — show on hover or selected */}
      <span
        className={[
          'text-[10px] text-gray-500 text-center leading-tight max-w-14 truncate transition-opacity duration-150',
          selected || hovered ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {color.name}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// FaceColorStep
// ---------------------------------------------------------------------------

export const FaceColorStep: React.FC = () => {
  const faceColor = usePackageStore((s) => s.designTokens.faceColor);
  const familyId = usePackageStore((s) => s.familyId);
  const setToken = usePackageStore((s) => s.setToken);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const family = React.useMemo(() => getFamilyById(familyId), [familyId]);
  const familyPalette = family?.curatedPalette ?? [];

  // Deduplicate extended colors that are already in the family palette
  const familyHexes = new Set(familyPalette.map((c) => c.hex.toUpperCase()));
  const curatedHexes = new Set(CURATED_COLORS.map((c) => c.hex.toUpperCase()));
  const extended = EXTENDED_COLORS.filter(
    (c) => !familyHexes.has(c.hex.toUpperCase()) && !curatedHexes.has(c.hex.toUpperCase()),
  );
  const curated = CURATED_COLORS.filter((c) => !familyHexes.has(c.hex.toUpperCase()));

  const handleSelect = useCallback(
    (hex: string) => {
      setToken('faceColor', hex);
      setTimeout(() => nextStep(), 300);
    },
    [setToken, nextStep],
  );

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Face Color</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set the background color of the sign face.
        </p>
      </div>

      {/* Family palette */}
      {familyPalette.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Family Palette
          </h3>
          <div className="flex flex-wrap gap-4">
            {familyPalette.map((c) => (
              <Swatch
                key={c.id}
                color={c}
                selected={faceColor.toUpperCase() === c.hex.toUpperCase()}
                onClick={() => handleSelect(c.hex)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Curated colors */}
      {curated.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Curated Colors
          </h3>
          <div className="flex flex-wrap gap-4">
            {curated.map((c) => (
              <Swatch
                key={c.id}
                color={c}
                selected={faceColor.toUpperCase() === c.hex.toUpperCase()}
                onClick={() => handleSelect(c.hex)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Extended colors */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Extended Colors
        </h3>
        <div className="flex flex-wrap gap-4">
          {extended.map((c) => (
            <Swatch
              key={c.id}
              color={c}
              selected={faceColor.toUpperCase() === c.hex.toUpperCase()}
              onClick={() => handleSelect(c.hex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
