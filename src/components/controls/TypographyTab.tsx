import { Section } from '../primitives/Section';
import { usePackageStore } from '../../stores/package-store';
import { FONT_OPTIONS } from '../../lib/constants';
import { renderGeometricIcon } from '../svg/pictograms/GeometricPictograms';
import { renderRoundedIcon } from '../svg/pictograms/RoundedPictograms';
import { renderBoldIcon } from '../svg/pictograms/BoldPictograms';

const PICTOGRAM_FAMILIES = [
  { id: 'geometric' as const, name: 'Geometric', render: renderGeometricIcon },
  { id: 'rounded' as const, name: 'Rounded', render: renderRoundedIcon },
  { id: 'bold' as const, name: 'Bold', render: renderBoldIcon },
];

export function TypographyTab() {
  const tokens = usePackageStore((s) => s.designTokens);
  const setToken = usePackageStore((s) => s.setToken);

  return (
    <div className="flex flex-col gap-1">
      <Section title="Font Family">
        <div className="flex flex-col gap-1">
          {FONT_OPTIONS.map((font) => {
            const isActive = tokens.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => setToken('fontFamily', font.id)}
                className={`w-full rounded-[4px] px-2.5 py-2 text-left transition-all ${
                  isActive
                    ? 'bg-accent-bg ring-1 ring-accent text-accent'
                    : 'bg-transparent hover:bg-white/5 text-text-secondary'
                }`}
              >
                <span
                  className="block text-[13px] leading-tight"
                  style={{ fontFamily: font.css }}
                >
                  {font.name}
                </span>
                <span className="block text-[10px] text-text-muted mt-0.5">
                  {font.css.replace(/'/g, '')}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Pictogram Style">
        <div className="grid grid-cols-3 gap-1.5">
          {PICTOGRAM_FAMILIES.map((fam) => {
            const isActive = tokens.pictogramFamily === fam.id;
            return (
              <button
                key={fam.id}
                type="button"
                onClick={() => setToken('pictogramFamily', fam.id)}
                className={`flex flex-col items-center gap-1 rounded-[4px] px-1 py-2 transition-all ${
                  isActive
                    ? 'bg-accent-bg ring-1 ring-accent'
                    : 'bg-transparent hover:bg-white/5'
                }`}
              >
                <svg width={36} height={36} viewBox="0 0 36 36">
                  {fam.render('restroom_unisex', 18, 18, 16, isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)')}
                </svg>
                <span
                  className={`text-[10px] leading-none ${
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  {fam.name}
                </span>
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
