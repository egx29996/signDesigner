import { useState, useCallback } from 'react';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';
import { Section } from '../primitives/Section';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { validateSign } from '../../lib/ada-engine';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyDefaults } from '../../lib/families-data';

const SIZE_PRESETS = [
  { label: '8"x8"', desc: 'Room ID', w: 8, h: 8 },
  { label: '8"x6"', desc: 'Restroom', w: 8, h: 6 },
  { label: '12"x12"', desc: 'Directory', w: 12, h: 12 },
  { label: '6"x6"', desc: 'Exit / Stairwell', w: 6, h: 6 },
  { label: '18"x24"', desc: 'Directory Lg', w: 18, h: 24 },
  { label: 'Custom', desc: '', w: 0, h: 0 },
] as const;

const MIN_SIZE = 4;
const MAX_SIZE = 36;
const STEP = 0.5;

export function SizeTab() {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const signTypes = usePackageStore((s) => s.signTypes);
  const familyId = usePackageStore((s) => s.familyId);
  const globalTokens = usePackageStore((s) => s.designTokens);
  const setSignSize = usePackageStore((s) => s.setSignSize);

  const [aspectLock, setAspectLock] = useState(false);

  const activeSign = signTypes.find((s) => s.id === activeSignTypeId);
  if (!activeSign) {
    return (
      <div className="p-2 text-[11px] text-text-muted">
        No sign type selected.
      </div>
    );
  }

  const { w, h } = activeSign.size;
  const aspectRatio = w / h;

  // Resolve tokens for ADA check
  let adaResult = null;
  try {
    const familyDefaults = getFamilyDefaults(familyId);
    const resolved = resolveTokens(familyDefaults, globalTokens, activeSign.tokenOverrides);
    adaResult = validateSign(activeSign, resolved);
  } catch {
    // Family not loaded yet
  }

  // Check if current size matches a preset
  const isPreset = (pw: number, ph: number) =>
    Math.abs(w - pw) < 0.01 && Math.abs(h - ph) < 0.01;

  const isCustom = !SIZE_PRESETS.some((p) => p.w > 0 && isPreset(p.w, p.h));

  // ADA size warnings
  const hasPictogram = activeSign.zones.some((z) => z.zoneType === 'pictogram' && z.visible);
  const sizeWarnings: string[] = [];
  if (w < 6) sizeWarnings.push('Width below 6": may not meet ADA minimum for tactile signs.');
  if (hasPictogram && h < 6) sizeWarnings.push('Height below 6": ADA requires minimum 6" pictogram field height.');

  const clamp = (v: number) => Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(v / STEP) * STEP));

  const handleWidthChange = useCallback(
    (newW: number) => {
      newW = clamp(newW);
      if (aspectLock) {
        const newH = clamp(newW / aspectRatio);
        setSignSize(activeSignTypeId, newW, newH);
      } else {
        setSignSize(activeSignTypeId, newW, h);
      }
    },
    [activeSignTypeId, h, aspectLock, aspectRatio, setSignSize],
  );

  const handleHeightChange = useCallback(
    (newH: number) => {
      newH = clamp(newH);
      if (aspectLock) {
        const newW = clamp(newH * aspectRatio);
        setSignSize(activeSignTypeId, newW, newH);
      } else {
        setSignSize(activeSignTypeId, w, newH);
      }
    },
    [activeSignTypeId, w, aspectLock, aspectRatio, setSignSize],
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Size Presets */}
      <Section title="Size Presets">
        <div className="grid grid-cols-3 gap-1.5">
          {SIZE_PRESETS.map((preset) => {
            const active = preset.w === 0 ? isCustom : isPreset(preset.w, preset.h);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (preset.w > 0) setSignSize(activeSignTypeId, preset.w, preset.h);
                }}
                className={`flex flex-col items-center rounded-[4px] border py-1.5 text-center transition-colors ${
                  active
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-[11px] font-medium">{preset.label}</span>
                {preset.desc && (
                  <span className="text-[9px] text-text-muted">{preset.desc}</span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Custom Size */}
      <Section title="Custom Size">
        <div className="flex flex-col gap-3">
          {/* Aspect ratio lock */}
          <button
            type="button"
            onClick={() => setAspectLock((v) => !v)}
            className={`flex items-center gap-1.5 self-end rounded-[4px] border px-2 py-1 text-[10px] font-medium transition-colors ${
              aspectLock
                ? 'border-accent bg-accent-bg text-accent'
                : 'border-border bg-white/[0.03] text-text-muted hover:bg-white/[0.06]'
            }`}
          >
            {aspectLock ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            Aspect Ratio
          </button>

          {/* Width */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] text-text-muted">Width</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={STEP}
                  value={w}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-12 rounded border border-border bg-white/5 px-1 py-0.5 text-right text-[11px] text-text-secondary outline-none focus:border-accent"
                />
                <span className="text-[11px] text-text-muted">"</span>
              </div>
            </div>
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={STEP}
              value={w}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
            />
          </div>

          {/* Height */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] text-text-muted">Height</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={STEP}
                  value={h}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-12 rounded border border-border bg-white/5 px-1 py-0.5 text-right text-[11px] text-text-secondary outline-none focus:border-accent"
                />
                <span className="text-[11px] text-text-muted">"</span>
              </div>
            </div>
            <input
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={STEP}
              value={h}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
            />
          </div>
        </div>
      </Section>

      {/* ADA Size Warnings */}
      {sizeWarnings.length > 0 && (
        <Section title="Size Warnings">
          <div className="flex flex-col gap-1">
            {sizeWarnings.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 rounded-md border border-warning/20 bg-warning/10 p-2"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                <span className="text-[10px] leading-relaxed text-warning">{msg}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ADA Compliance */}
      <Section title="ADA Compliance">
        {adaResult ? (
          <div>
            {adaResult.valid && adaResult.warnings.length === 0 ? (
              <div className="rounded-md border border-success/20 bg-success/10 p-2">
                <span className="text-[11px] font-semibold text-success">
                  ADA Compliant
                </span>
              </div>
            ) : adaResult.errors.length > 0 ? (
              <div className="rounded-md border border-error/20 bg-error/10 p-2">
                <span className="text-[11px] font-semibold text-error">
                  ADA Issues ({adaResult.errors.length})
                </span>
              </div>
            ) : (
              <div className="rounded-md border border-warning/20 bg-warning/10 p-2">
                <span className="text-[11px] font-semibold text-warning">
                  Warnings ({adaResult.warnings.length})
                </span>
              </div>
            )}
            {(adaResult.errors.length > 0 || adaResult.warnings.length > 0) && (
              <div className="mt-1.5 flex flex-col gap-1">
                {adaResult.errors.map((issue, i) => (
                  <p key={i} className="text-[10px] leading-relaxed text-error">
                    {issue.message}
                  </p>
                ))}
                {adaResult.warnings.map((issue, i) => (
                  <p key={i} className="text-[10px] leading-relaxed text-warning">
                    {issue.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-[10px] text-text-muted">
            Load a family to check ADA compliance.
          </p>
        )}
      </Section>
    </div>
  );
}
