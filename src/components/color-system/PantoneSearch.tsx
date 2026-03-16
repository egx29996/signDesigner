import { useEffect } from 'react';
import { useColorStore } from '../../stores/color-store';
import { ColorSwatch } from './ColorSwatch';
import type { ColorEntry } from '../../types/tokens';

interface PantoneSearchProps {
  onSelect: (color: ColorEntry) => void;
  activeHex?: string;
}

export function PantoneSearch({ onSelect, activeHex }: PantoneSearchProps) {
  const searchQuery = useColorStore((s) => s.searchQuery);
  const setSearchQuery = useColorStore((s) => s.setSearchQuery);
  const searchResults = useColorStore((s) => s.searchResults);
  const isLoading = useColorStore((s) => s.isLoading);
  const loadPantone = useColorStore((s) => s.loadPantone);
  const pantoneCache = useColorStore((s) => s._pantoneCache);

  useEffect(() => {
    loadPantone();
  }, [loadPantone]);

  const colors = searchQuery.trim() ? searchResults : (pantoneCache ?? []);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search PMS number or name..."
        className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] text-text-primary placeholder:text-text-muted focus:border-border-active focus:outline-none"
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <span className="text-[11px] text-text-muted">Loading Pantone colors...</span>
        </div>
      ) : colors.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          <span className="text-[11px] text-text-muted">No matching colors</span>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-1.5 max-h-[240px] overflow-y-auto pr-0.5">
          {colors.map((color) => (
            <ColorSwatch
              key={color.id}
              color={color}
              isActive={activeHex?.toLowerCase() === color.hex.toLowerCase()}
              onClick={() => onSelect(color)}
              size="sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
