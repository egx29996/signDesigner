import React, { useCallback, useState } from 'react';
import { Check } from 'lucide-react';
import { CURATED_COLORS, EXTENDED_COLORS, getContrastColor } from '../../../lib/color-utils';
import { getFamilyById } from '../../../lib/families-data';
import { usePackageStore } from '../../../stores/package-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';
import type { ColorEntry } from '../../../types';

// ---------------------------------------------------------------------------
// Swatch (reused pattern)
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
          'relative w-10 h-10 rounded-full transition-all duration-200 cursor-pointer',
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
            size={14}
            className="absolute inset-0 m-auto"
            style={{ color: contrast }}
          />
        )}
      </button>
      <span
        className={[
          'text-[10px] text-gray-500 text-center leading-tight max-w-12 truncate transition-opacity duration-150',
          selected || hovered ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        {color.name}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Color grid section
// ---------------------------------------------------------------------------

interface ColorSectionProps {
  selectedHex: string;
  onSelect: (hex: string) => void;
  familyPalette: ColorEntry[];
}

const ColorGrid: React.FC<ColorSectionProps> = ({ selectedHex, onSelect, familyPalette }) => {
  const familyHexes = new Set(familyPalette.map((c) => c.hex.toUpperCase()));
  const curatedHexes = new Set(CURATED_COLORS.map((c) => c.hex.toUpperCase()));

  const curated = CURATED_COLORS.filter((c) => !familyHexes.has(c.hex.toUpperCase()));
  const extended = EXTENDED_COLORS.filter(
    (c) => !familyHexes.has(c.hex.toUpperCase()) && !curatedHexes.has(c.hex.toUpperCase()),
  );

  const allColors = [...familyPalette, ...curated, ...extended];

  return (
    <div className="flex flex-wrap gap-3">
      {allColors.map((c) => (
        <Swatch
          key={c.id}
          color={c}
          selected={selectedHex.toUpperCase() === c.hex.toUpperCase()}
          onClick={() => onSelect(c.hex)}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// TextAccentStep
// ---------------------------------------------------------------------------

export const TextAccentStep: React.FC = () => {
  const raisedTextColor = usePackageStore((s) => s.designTokens.raisedTextColor);
  const accentColor = usePackageStore((s) => s.designTokens.accentColor);
  const familyId = usePackageStore((s) => s.familyId);
  const setToken = usePackageStore((s) => s.setToken);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const family = React.useMemo(() => getFamilyById(familyId), [familyId]);
  const familyPalette = family?.curatedPalette ?? [];

  const handleTextColor = useCallback(
    (hex: string) => {
      setToken('raisedTextColor', hex);
    },
    [setToken],
  );

  const handleAccentColor = useCallback(
    (hex: string) => {
      setToken('accentColor', hex);
      // Auto-advance after accent pick (both choices made)
      setTimeout(() => nextStep(), 300);
    },
    [setToken, nextStep],
  );

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Text & Accent Colors</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set your raised text color, then your accent / divider color.
        </p>
      </div>

      {/* Raised text color */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: raisedTextColor }}
          />
          Raised Text Color
        </h3>
        <ColorGrid
          selectedHex={raisedTextColor}
          onSelect={handleTextColor}
          familyPalette={familyPalette}
        />
      </div>

      {/* Accent / divider color */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: accentColor }}
          />
          Accent / Divider Color
        </h3>
        <ColorGrid
          selectedHex={accentColor}
          onSelect={handleAccentColor}
          familyPalette={familyPalette}
        />
      </div>
    </div>
  );
};
