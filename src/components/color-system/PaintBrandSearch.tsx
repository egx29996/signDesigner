import { useEffect } from 'react';
import { useColorStore } from '../../stores/color-store';
import { ColorSwatch } from './ColorSwatch';
import type { ColorEntry } from '../../types/tokens';

interface PaintBrandSearchProps {
  onSelect: (color: ColorEntry) => void;
  activeHex?: string;
}

export function PaintBrandSearch({ onSelect, activeHex }: PaintBrandSearchProps) {
  const paintBrand = useColorStore((s) => s.paintBrand);
  const setPaintBrand = useColorStore((s) => s.setPaintBrand);
  const searchQuery = useColorStore((s) => s.searchQuery);
  const setSearchQuery = useColorStore((s) => s.setSearchQuery);
  const searchResults = useColorStore((s) => s.searchResults);
  const isLoading = useColorStore((s) => s.isLoading);
  const loadPaintBrand = useColorStore((s) => s.loadPaintBrand);
  const swCache = useColorStore((s) => s._swCache);
  const bmCache = useColorStore((s) => s._bmCache);

  useEffect(() => {
    loadPaintBrand(paintBrand);
  }, [paintBrand, loadPaintBrand]);

  const cache = paintBrand === 'sherwin_williams' ? swCache : bmCache;
  const colors = searchQuery.trim() ? searchResults : (cache ?? []);

  return (
    <div className="flex flex-col gap-2">
      {/* Brand selector */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setPaintBrand('sherwin_williams')}
          className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors ${
            paintBrand === 'sherwin_williams'
              ? 'bg-accent-bg-strong text-white'
              : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
          }`}
        >
          Sherwin-Williams
        </button>
        <button
          type="button"
          onClick={() => setPaintBrand('benjamin_moore')}
          className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors ${
            paintBrand === 'benjamin_moore'
              ? 'bg-accent-bg-strong text-white'
              : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
          }`}
        >
          Benjamin Moore
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search ${paintBrand === 'sherwin_williams' ? 'SW' : 'BM'} colors...`}
        className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] text-text-primary placeholder:text-text-muted focus:border-border-active focus:outline-none"
      />

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <span className="text-[11px] text-text-muted">Loading colors...</span>
        </div>
      ) : colors.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          <span className="text-[11px] text-text-muted">No matching colors</span>
        </div>
      ) : (
        <div className="max-h-[200px] overflow-y-auto pr-0.5">
          <div className="flex flex-col gap-1">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelect(color)}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
                  activeHex?.toLowerCase() === color.hex.toLowerCase()
                    ? 'bg-accent-bg border border-border-active'
                    : 'hover:bg-surface-elevated border border-transparent'
                }`}
              >
                <div
                  className="h-6 w-6 rounded-[3px] border border-white/15 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-text-primary truncate">{color.name}</span>
                  <span className="text-[10px] text-text-muted">{color.code}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
