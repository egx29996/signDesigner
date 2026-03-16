import { Section } from '../primitives/Section';
import { usePackageStore } from '../../stores/package-store';
import { MATERIALS, FONT_OPTIONS } from '../../lib/constants';

const PRODUCTION_METHODS = [
  { id: 'thermoform', label: 'Thermoformed' },
  { id: 'applique', label: 'Applique' },
  { id: 'direct_print', label: 'Direct Print' },
] as const;

const CONSTRUCTION_TYPES = [
  { id: 'single_piece', label: 'Single Piece' },
  { id: 'two_piece', label: 'Two Piece' },
  { id: 'three_piece', label: 'Three Piece' },
] as const;

const SURFACE_TREATMENTS = [
  { id: '1st_surface', label: '1st Surface w/ Painted Returns' },
  { id: '2nd_surface', label: '2nd Surface Painted' },
] as const;

export function MaterialTab() {
  const tokens = usePackageStore((s) => s.designTokens);
  const setToken = usePackageStore((s) => s.setToken);

  return (
    <div className="flex flex-col gap-1">
      {/* Face Material */}
      <Section title="Face Material">
        <div className="grid grid-cols-4 gap-1.5">
          {MATERIALS.map((mat) => {
            const isActive = tokens.faceMaterial === mat.id;
            const bgStyle =
              mat.type === 'solid'
                ? { background: tokens.faceColor }
                : {
                    background: `linear-gradient(135deg, ${mat.color1} 0%, ${mat.color2} 50%, ${mat.color3} 100%)`,
                  };
            return (
              <button
                key={mat.id}
                type="button"
                onClick={() => setToken('faceMaterial', mat.id)}
                className={`h-8 w-11 rounded-[3px] border-2 transition-colors ${
                  isActive
                    ? 'border-accent'
                    : 'border-transparent hover:border-white/20'
                }`}
                style={bgStyle}
                title={mat.name}
              />
            );
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-text-secondary">
          {MATERIALS.find((m) => m.id === tokens.faceMaterial)?.name ?? tokens.faceMaterial}
        </p>
      </Section>

      {/* Production Method */}
      <Section title="Production Method">
        <div className="flex flex-col gap-1">
          {PRODUCTION_METHODS.map((pm) => {
            const isActive = tokens.productionMethod === pm.id;
            return (
              <button
                key={pm.id}
                type="button"
                onClick={() => setToken('productionMethod', pm.id)}
                className={`rounded-[4px] border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                {pm.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Construction */}
      <Section title="Construction">
        <div className="flex flex-col gap-1">
          {CONSTRUCTION_TYPES.map((ct) => {
            const isActive = tokens.constructionType === ct.id;
            return (
              <button
                key={ct.id}
                type="button"
                onClick={() => setToken('constructionType', ct.id)}
                className={`rounded-[4px] border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                {ct.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Surface Treatment */}
      <Section title="Surface Treatment">
        <div className="flex flex-col gap-1">
          {SURFACE_TREATMENTS.map((st) => {
            const isActive = tokens.surfaceTreatment === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setToken('surfaceTreatment', st.id)}
                className={`rounded-[4px] border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Font Family */}
      <Section title="Font Family">
        <div className="flex flex-col gap-1">
          {FONT_OPTIONS.map((font) => {
            const isActive = tokens.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => setToken('fontFamily', font.id)}
                className={`rounded-[4px] border px-2 py-1.5 text-left text-[12px] transition-colors ${
                  isActive
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
                style={{ fontFamily: font.css }}
              >
                {font.name}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
