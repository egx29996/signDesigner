import { usePackageStore } from '../../stores/package-store';
import { MATERIALS } from '../../lib/constants';

interface TokenRowProps {
  label: string;
  color?: string;
  value?: string;
}

function TokenRow({ label, color, value }: TokenRowProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border py-1.5">
      {color && (
        <div
          className="h-4 w-4 rounded-sm border border-white/15"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-[9px] text-text-muted">{label}</span>
      {value && (
        <span className="ml-auto text-[10px] text-text-secondary">{value}</span>
      )}
    </div>
  );
}

export function TokenSummary() {
  const tokens = usePackageStore((s) => s.designTokens);

  const faceMaterial = MATERIALS.find((m) => m.id === tokens.faceMaterial);
  const isSolid = tokens.faceMaterial === 'solid';

  return (
    <div>
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Design Tokens
      </h3>
      <div className="flex flex-col">
        <TokenRow
          label="Face Material"
          color={isSolid ? tokens.faceColor : undefined}
          value={faceMaterial?.name ?? tokens.faceMaterial}
        />
        <TokenRow label="Raised Text" color={tokens.raisedTextColor} />
        <TokenRow label="Accent" color={tokens.accentColor} />
        <TokenRow label="Insert BG" color={tokens.insertBgColor} />
        <TokenRow label="Insert Text" color={tokens.insertTextColor} />
      </div>
    </div>
  );
}
