import { create } from 'zustand';
import type { ColorEntry } from '../types/tokens';

type ColorLayer = 'curated' | 'extended' | 'pantone' | 'paint' | 'custom';
type PaintBrand = 'sherwin_williams' | 'benjamin_moore';

interface ColorStoreState {
  activeLayer: ColorLayer;
  searchQuery: string;
  paintBrand: PaintBrand;
  searchResults: ColorEntry[];
  isLoading: boolean;

  // Cached datasets (lazy-loaded)
  _pantoneCache: ColorEntry[] | null;
  _swCache: ColorEntry[] | null;
  _bmCache: ColorEntry[] | null;

  // Actions
  setActiveLayer: (layer: ColorLayer) => void;
  setSearchQuery: (query: string) => void;
  setPaintBrand: (brand: PaintBrand) => void;
  searchColors: (query: string) => void;
  loadPantone: () => Promise<ColorEntry[]>;
  loadPaintBrand: (brand: PaintBrand) => Promise<ColorEntry[]>;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

function filterColors(colors: ColorEntry[], query: string): ColorEntry[] {
  if (!query.trim()) return colors;
  const q = query.toLowerCase().trim();
  return colors.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.code && c.code.toLowerCase().includes(q)) ||
      c.hex.toLowerCase().includes(q)
  );
}

export const useColorStore = create<ColorStoreState>()((set, get) => ({
  activeLayer: 'curated',
  searchQuery: '',
  paintBrand: 'sherwin_williams',
  searchResults: [],
  isLoading: false,

  _pantoneCache: null,
  _swCache: null,
  _bmCache: null,

  setActiveLayer(layer) {
    set({ activeLayer: layer, searchQuery: '', searchResults: [] });
  },

  setSearchQuery(query) {
    set({ searchQuery: query });
    get().searchColors(query);
  },

  setPaintBrand(brand) {
    set({ paintBrand: brand, searchQuery: '', searchResults: [] });
  },

  searchColors(query) {
    const state = get();
    const { activeLayer, paintBrand } = state;

    if (activeLayer === 'pantone') {
      const cache = state._pantoneCache;
      if (cache) {
        set({ searchResults: filterColors(cache, query) });
      }
    } else if (activeLayer === 'paint') {
      const cache = paintBrand === 'sherwin_williams' ? state._swCache : state._bmCache;
      if (cache) {
        set({ searchResults: filterColors(cache, query) });
      }
    }
  },

  async loadPantone() {
    const cached = get()._pantoneCache;
    if (cached) return cached;

    set({ isLoading: true });
    try {
      const data = await fetchJson<ColorEntry[]>('/colors/pantone-signage.json');
      set({ _pantoneCache: data, isLoading: false, searchResults: data });
      return data;
    } catch (err) {
      console.error('Failed to load Pantone colors:', err);
      set({ isLoading: false });
      return [];
    }
  },

  async loadPaintBrand(brand) {
    const state = get();
    const cacheKey = brand === 'sherwin_williams' ? '_swCache' : '_bmCache';
    const cached = state[cacheKey];
    if (cached) return cached;

    set({ isLoading: true });
    try {
      const file = brand === 'sherwin_williams' ? 'sherwin-williams.json' : 'benjamin-moore.json';
      const data = await fetchJson<ColorEntry[]>(`/colors/${file}`);
      set({ [cacheKey]: data, isLoading: false, searchResults: data });
      return data;
    } catch (err) {
      console.error(`Failed to load ${brand} colors:`, err);
      set({ isLoading: false });
      return [];
    }
  },
}));
