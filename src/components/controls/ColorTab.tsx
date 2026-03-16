import { useState } from 'react';
import { usePackageStore } from '../../stores/package-store';
import { useColorStore } from '../../stores/color-store';
import { CURATED_COLORS, EXTENDED_COLORS } from '../../lib/color-utils';
import { getFamilyById } from '../../lib/families-data';
import { ColorSwatch } from '../color-system/ColorSwatch';
import { ColorPicker } from '../color-system/ColorPicker';
import { PantoneSearch } from '../color-system/PantoneSearch';
import { PaintBrandSearch } from '../color-system/PaintBrandSearch';
import type { DesignTokens, ColorEntry } from '../../types';

// ---------------------------------------------------------------------------
// Color target definitions
// ---------------------------------------------------------------------------

const COLOR_TARGETS: { key: keyof DesignTokens; label: string }[] = [
  { key: 'faceColor', label: 'Face' },
  { key: 'raisedTextColor', label: 'Text' },
  { key: 'accentColor', label: 'Accent' },
  { key: 'insertBgColor', label: 'Insert BG' },
  { key: 'insertTextColor', label: 'Insert Text' },
];

type LayerTab = 'curated' | 'extended' | 'pantone' | 'paint' | 'custom';

const LAYER_TABS: { id: LayerTab; label: string }[] = [
  { id: 'curated', label: 'Curated' },
  { id: 'extended', label: 'Extended' },
  { id: 'pantone', label: 'Pantone' },
  { id: 'paint', label: 'Paint' },
  { id: 'custom', label: 'Custom' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ColorTab() {
  const tokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);
  const setToken = usePackageStore((s) => s.setToken);
  const activeLayer = useColorStore((s) => s.activeLayer);
  const setActiveLayer = useColorStore((s) => s.setActiveLayer);

  const [activeTarget, setActiveTarget] = useState<keyof DesignTokens>('faceColor');

  const currentValue = (tokens[activeTarget] as string) ?? '';

  const handleColorSelect = (color: ColorEntry) => {
    setToken(activeTarget, color.hex);
    // When selecting a face color, also set faceMaterial to 'solid'
    if (activeTarget === 'faceColor') {
      setToken('faceMaterial', 'solid');
    }
  };

  const handleCustomChange = (hex: string) => {
    setToken(activeTarget, hex);
    if (activeTarget === 'faceColor') {
      setToken('faceMaterial', 'solid');
    }
  };

  // Get curated palette for current family, fallback to CURATED_COLORS
  const family = getFamilyById(familyId);
  const curatedPalette = family?.curatedPalette ?? CURATED_COLORS;

  return (
    <div className="flex flex-col gap-2">
      {/* Color target selector */}
      <div className="flex gap-1 flex-wrap">
        {COLOR_TARGETS.map((target) => {
          const isActive = activeTarget === target.key;
          const colorVal = (tokens[target.key] as string) ?? '#000000';
          return (
            <button
              key={target.key}
              type="button"
              onClick={() => setActiveTarget(target.key)}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'bg-accent-bg border border-border-active text-text-primary'
                  : 'bg-surface-elevated border border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div
                className="h-3.5 w-3.5 rounded-[2px] border border-white/20"
                style={{ backgroundColor: colorVal }}
              />
              {target.label}
            </button>
          );
        })}
      </div>

      {/* Layer tabs */}
      <div className="flex border-b border-border">
        {LAYER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveLayer(tab.id)}
            className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors border-b-2 ${
              activeLayer === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Layer content */}
      <div className="py-1">
        {activeLayer === 'curated' && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-text-muted">
              {family ? `${family.name} palette` : 'Default palette'}
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {curatedPalette.map((color) => (
                <ColorSwatch
                  key={color.id}
                  color={color}
                  isActive={currentValue.toLowerCase() === color.hex.toLowerCase()}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        )}

        {activeLayer === 'extended' && (
          <div className="grid grid-cols-6 gap-1.5 max-h-[260px] overflow-y-auto pr-0.5">
            {EXTENDED_COLORS.map((color) => (
              <ColorSwatch
                key={color.id}
                color={color}
                isActive={currentValue.toLowerCase() === color.hex.toLowerCase()}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        )}

        {activeLayer === 'pantone' && (
          <PantoneSearch
            onSelect={handleColorSelect}
            activeHex={currentValue}
          />
        )}

        {activeLayer === 'paint' && (
          <PaintBrandSearch
            onSelect={handleColorSelect}
            activeHex={currentValue}
          />
        )}

        {activeLayer === 'custom' && (
          <ColorPicker
            value={currentValue}
            onChange={handleCustomChange}
          />
        )}
      </div>
    </div>
  );
}
