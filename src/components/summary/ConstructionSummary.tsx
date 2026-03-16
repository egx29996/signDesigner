import { usePackageStore } from '../../stores/package-store';
import { FONT_OPTIONS } from '../../lib/constants';

const PRODUCTION_LABELS: Record<string, string> = {
  thermoform: 'Thermoformed',
  applique: 'Applique',
  direct_print: 'Direct Print',
};

const SURFACE_LABELS: Record<string, string> = {
  '1st_surface': '1st Surface',
  '2nd_surface': '2nd Surface',
};

const CONSTRUCTION_LABELS: Record<string, string> = {
  single_piece: 'Single Piece',
  two_piece: 'Two Piece',
  three_piece: 'Three Piece',
};

export function ConstructionSummary() {
  const tokens = usePackageStore((s) => s.designTokens);

  const font = FONT_OPTIONS.find((f) => f.id === tokens.fontFamily);
  const fontCss = font?.css ?? 'sans-serif';
  const fontName = font?.name ?? tokens.fontFamily;

  return (
    <div className="flex flex-col gap-4">
      {/* Construction Details */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Construction
        </h3>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted">Production</span>
            <span className="text-[10px] leading-relaxed text-text-secondary">
              {PRODUCTION_LABELS[tokens.productionMethod] ?? tokens.productionMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted">Surface</span>
            <span className="text-[10px] leading-relaxed text-text-secondary">
              {SURFACE_LABELS[tokens.surfaceTreatment] ?? tokens.surfaceTreatment}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted">Type</span>
            <span className="text-[10px] leading-relaxed text-text-secondary">
              {CONSTRUCTION_LABELS[tokens.constructionType] ?? tokens.constructionType}
            </span>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Typography
        </h3>
        <div className="rounded-md border border-border bg-white/[0.03] p-3">
          <p
            className="text-[10px] text-text-muted"
            style={{ fontFamily: fontCss }}
          >
            {fontName}
          </p>
          <p
            className="mt-1 text-[18px] leading-tight text-text-primary"
            style={{ fontFamily: fontCss }}
          >
            Aa Bb 123
          </p>
        </div>
      </div>
    </div>
  );
}
