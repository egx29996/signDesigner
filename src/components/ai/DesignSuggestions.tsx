import React, { useMemo, useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import type { DesignTokens } from '../../types/index.ts';
import { getContrastColor } from '../../lib/color-utils.ts';

// ---------------------------------------------------------------------------
// Color conversion helpers
// ---------------------------------------------------------------------------

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace(/^#/, '');
  const full =
    clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean;
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  // Normalize h to 0-360
  const hNorm = ((h % 360) + 360) % 360;

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const sClamped = Math.max(0, Math.min(1, s));
  const lClamped = Math.max(0, Math.min(1, l));

  if (sClamped === 0) {
    const v = Math.round(lClamped * 255);
    const hex = v.toString(16).padStart(2, '0');
    return `#${hex}${hex}${hex}`;
  }

  const q = lClamped < 0.5
    ? lClamped * (1 + sClamped)
    : lClamped + sClamped - lClamped * sClamped;
  const p = 2 * lClamped - q;

  const r = Math.round(hue2rgb(p, q, hNorm / 360 + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm / 360) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm / 360 - 1 / 3) * 255);

  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ---------------------------------------------------------------------------
// Palette generation
// ---------------------------------------------------------------------------

interface Palette {
  name: string;
  description: string;
  faceColor: string;
  raisedTextColor: string;
  accentColor: string;
}

function generatePalettes(tokens: DesignTokens): Palette[] {
  const faceHsl = hexToHsl(tokens.faceColor);
  const palettes: Palette[] = [];

  // 1. Complementary — rotate hue 180 degrees
  const compH = (faceHsl.h + 180) % 360;
  palettes.push({
    name: 'Complementary',
    description: 'High contrast with opposite hue',
    faceColor: tokens.faceColor,
    raisedTextColor: hslToHex(compH, Math.min(faceHsl.s + 0.1, 1), 0.85),
    accentColor: hslToHex(compH, Math.min(faceHsl.s + 0.15, 1), 0.5),
  });

  // 2. Analogous — hue +/- 30 degrees
  const anaH1 = (faceHsl.h + 30) % 360;
  const anaH2 = (faceHsl.h - 30 + 360) % 360;
  palettes.push({
    name: 'Analogous',
    description: 'Harmonious neighboring hues',
    faceColor: hslToHex(anaH2, faceHsl.s, faceHsl.l),
    raisedTextColor: hslToHex(faceHsl.h, faceHsl.s * 0.3, 0.92),
    accentColor: hslToHex(anaH1, Math.min(faceHsl.s + 0.2, 1), 0.55),
  });

  // 3. Monochromatic — vary lightness
  palettes.push({
    name: 'Monochromatic',
    description: 'Single hue with varied lightness',
    faceColor: hslToHex(faceHsl.h, faceHsl.s, Math.max(faceHsl.l - 0.15, 0.08)),
    raisedTextColor: hslToHex(faceHsl.h, faceHsl.s * 0.4, 0.9),
    accentColor: hslToHex(faceHsl.h, Math.min(faceHsl.s + 0.1, 1), Math.min(faceHsl.l + 0.25, 0.65)),
  });

  // 4. Triadic — rotate hue 120 degrees
  const triH1 = (faceHsl.h + 120) % 360;
  const triH2 = (faceHsl.h + 240) % 360;
  palettes.push({
    name: 'Triadic',
    description: 'Bold three-point color harmony',
    faceColor: tokens.faceColor,
    raisedTextColor: hslToHex(triH1, faceHsl.s * 0.6, 0.88),
    accentColor: hslToHex(triH2, Math.min(faceHsl.s + 0.1, 1), 0.5),
  });

  return palettes;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DesignSuggestionsProps {
  currentTokens: DesignTokens;
  onApply: (updates: Partial<DesignTokens>) => void;
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded border border-border shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      >
        <span
          className="flex items-center justify-center w-full h-full text-[7px] font-mono opacity-0 hover:opacity-100 transition-opacity"
          style={{ color: getContrastColor(color) }}
        >
          {color}
        </span>
      </div>
      <span className="text-[9px] text-text-muted">{label}</span>
    </div>
  );
}

export const DesignSuggestions: React.FC<DesignSuggestionsProps> = ({
  currentTokens,
  onApply,
}) => {
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  const palettes = useMemo(
    () => generatePalettes(currentTokens),
    [currentTokens],
  );

  const handleApply = (palette: Palette, index: number) => {
    onApply({
      faceColor: palette.faceColor,
      raisedTextColor: palette.raisedTextColor,
      accentColor: palette.accentColor,
    });
    setAppliedIndex(index);
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span className="text-[11px] font-semibold text-text-primary uppercase tracking-wide">
          Color Suggestions
        </span>
      </div>

      {/* Palette cards */}
      <div className="space-y-2">
        {palettes.map((palette, i) => (
          <div
            key={palette.name}
            className={[
              'flex items-center gap-3 p-3 rounded-lg border transition-colors',
              appliedIndex === i
                ? 'border-accent bg-accent-bg'
                : 'border-border bg-surface hover:border-border-active',
            ].join(' ')}
          >
            {/* Swatches */}
            <div className="flex gap-2">
              <Swatch color={palette.faceColor} label="Face" />
              <Swatch color={palette.raisedTextColor} label="Text" />
              <Swatch color={palette.accentColor} label="Accent" />
            </div>

            {/* Info + apply */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">
                {palette.name}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {palette.description}
              </p>
            </div>

            <button
              onClick={() => handleApply(palette, i)}
              className={[
                'flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded border transition-colors shrink-0',
                appliedIndex === i
                  ? 'border-accent text-accent bg-accent-bg'
                  : 'border-border text-text-secondary hover:border-accent hover:text-accent',
              ].join(' ')}
            >
              {appliedIndex === i ? (
                <>
                  <Check className="w-3 h-3" />
                  Applied
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
