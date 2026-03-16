import React from 'react';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { CURATED_COLORS } from '../../lib/color-utils';
import { Section } from '../primitives/Section';
import type { DesignTokens } from '../../types';

const OVERRIDABLE_TOKENS: Array<{ key: keyof DesignTokens; label: string }> = [
  { key: 'faceColor', label: 'Face Color' },
  { key: 'raisedTextColor', label: 'Raised Text' },
  { key: 'accentColor', label: 'Accent' },
  { key: 'insertBgColor', label: 'Insert BG' },
  { key: 'insertTextColor', label: 'Insert Text' },
  { key: 'cornerRadius', label: 'Corner Radius' },
];

export function OverrideTab() {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const signTypes = usePackageStore((s) => s.signTypes);
  const globalTokens = usePackageStore((s) => s.designTokens);
  const setSignTypeOverride = usePackageStore((s) => s.setSignTypeOverride);
  const clearSignTypeOverride = usePackageStore((s) => s.clearSignTypeOverride);

  const activeSign = signTypes.find((s) => s.id === activeSignTypeId);

  if (!activeSign) {
    return (
      <div className="p-2 text-[11px] text-text-muted">
        No sign type selected.
      </div>
    );
  }

  const overrides = activeSign.tokenOverrides;
  const overrideCount = Object.keys(overrides).length;

  return (
    <div className="flex flex-col gap-1">
      {/* Status */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-primary">
          Overrides for {activeSign.typeName}
        </span>
        {overrideCount > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent-bg text-accent font-bold">
            {overrideCount} active
          </span>
        )}
      </div>

      {/* Color overrides */}
      {OVERRIDABLE_TOKENS.filter((t) => t.key !== 'cornerRadius').map(({ key, label }) => {
        const globalValue = globalTokens[key] as string;
        const overrideValue = overrides[key] as string | undefined;
        const isOverridden = overrideValue !== undefined;

        return (
          <Section key={key} title={label}>
            <div className="flex flex-col gap-1.5">
              {/* Current value indicator */}
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded border border-white/15"
                  style={{ backgroundColor: isOverridden ? overrideValue : globalValue }}
                />
                <span className="text-[10px] text-text-secondary flex-1 font-mono">
                  {(isOverridden ? overrideValue : globalValue).toUpperCase()}
                </span>
                {isOverridden && (
                  <button
                    type="button"
                    onClick={() => clearSignTypeOverride(activeSignTypeId, key)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-6 gap-1">
                {CURATED_COLORS.map((color) => {
                  const currentVal = isOverridden ? overrideValue : globalValue;
                  const isActive = currentVal?.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSignTypeOverride(activeSignTypeId, key, color.hex)}
                      className={`h-6 w-6 rounded transition-all ${
                        isActive
                          ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface border border-white'
                          : 'border border-white/15 hover:border-white/30'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>
          </Section>
        );
      })}

      {/* Corner radius override */}
      <Section title="Corner Radius">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={(overrides.cornerRadius as number) ?? globalTokens.cornerRadius}
            onChange={(e) =>
              setSignTypeOverride(activeSignTypeId, 'cornerRadius', Number(e.target.value))
            }
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
          />
          <span className="min-w-[28px] text-right text-[11px] text-text-secondary">
            {(overrides.cornerRadius as number) ?? globalTokens.cornerRadius}px
          </span>
          {overrides.cornerRadius !== undefined && (
            <button
              type="button"
              onClick={() => clearSignTypeOverride(activeSignTypeId, 'cornerRadius')}
              className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}
