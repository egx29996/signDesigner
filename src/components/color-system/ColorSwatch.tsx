import type { ColorEntry } from '../../types/tokens';
import { getContrastColor } from '../../lib/color-utils';

interface ColorSwatchProps {
  color: ColorEntry;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function ColorSwatch({ color, isActive = false, onClick, size = 'sm' }: ColorSwatchProps) {
  const dim = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const textColor = getContrastColor(color.hex);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${dim} rounded-[4px] transition-all shrink-0 relative group ${
        isActive
          ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface border border-white'
          : 'border border-white/15 hover:border-white/30'
      }`}
      style={{ backgroundColor: color.hex }}
      title={`${color.name}${color.code ? ` (${color.code})` : ''}`}
    >
      {/* Show code on hover for md size */}
      {size === 'md' && (
        <span
          className="absolute inset-0 flex items-center justify-center text-[8px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: textColor }}
        >
          {color.code || ''}
        </span>
      )}
    </button>
  );
}
