import type { ColorEntry } from '../types/tokens';

// ---------------------------------------------------------------------------
// Hex / RGB conversion
// ---------------------------------------------------------------------------

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace(/^#/, '');
  const full =
    clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ---------------------------------------------------------------------------
// Contrast helper — returns black or white for best readability
// ---------------------------------------------------------------------------

export function getContrastColor(bgHex: string): string {
  const { r, g, b } = hexToRgb(bgHex);
  // Simple perceived brightness (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}

// ---------------------------------------------------------------------------
// Curated palette — the 12 core POC colors
// ---------------------------------------------------------------------------

export const CURATED_COLORS: ColorEntry[] = [
  { id: 'charcoal',    hex: '#2D2D2D', name: 'Charcoal',         family: 'neutral' },
  { id: 'white',       hex: '#FFFFFF', name: 'White',            family: 'neutral' },
  { id: 'navy',        hex: '#1B2A4A', name: 'Navy',             family: 'blue' },
  { id: 'sage',        hex: '#7D8E7B', name: 'Sage',             family: 'green' },
  { id: 'terracotta',  hex: '#C4754B', name: 'Terracotta',       family: 'warm' },
  { id: 'cream',       hex: '#F5F0E8', name: 'Cream',            family: 'neutral' },
  { id: 'slate',       hex: '#4A5568', name: 'Slate',            family: 'neutral' },
  { id: 'brass',       hex: '#B8860B', name: 'Brass',            family: 'metal' },
  { id: 'forest',      hex: '#2D4A2D', name: 'Forest',           family: 'green' },
  { id: 'burgundy',    hex: '#6B2D3E', name: 'Burgundy',         family: 'warm' },
  { id: 'taupe',       hex: '#8B7D6B', name: 'Taupe',            family: 'neutral' },
  { id: 'black',       hex: '#000000', name: 'Black',            family: 'neutral' },
];

// ---------------------------------------------------------------------------
// Extended palette — 40+ industry colors
// ---------------------------------------------------------------------------

export const EXTENDED_COLORS: ColorEntry[] = [
  // Grays
  { id: 'light-gray',       hex: '#D1D5DB', name: 'Light Gray',       family: 'neutral' },
  { id: 'medium-gray',      hex: '#9CA3AF', name: 'Medium Gray',      family: 'neutral' },
  { id: 'dark-gray',        hex: '#374151', name: 'Dark Gray',        family: 'neutral' },
  { id: 'warm-gray',        hex: '#78716C', name: 'Warm Gray',        family: 'neutral' },
  { id: 'cool-gray',        hex: '#6B7280', name: 'Cool Gray',        family: 'neutral' },
  { id: 'silver',           hex: '#C0C0C0', name: 'Silver',           family: 'metal' },
  { id: 'gunmetal',         hex: '#2C3539', name: 'Gunmetal',         family: 'neutral' },

  // Blues
  { id: 'steel-blue',       hex: '#4682B4', name: 'Steel Blue',       family: 'blue' },
  { id: 'midnight-blue',    hex: '#191970', name: 'Midnight Blue',    family: 'blue' },
  { id: 'cobalt',           hex: '#0047AB', name: 'Cobalt',           family: 'blue' },
  { id: 'sky-blue',         hex: '#87CEEB', name: 'Sky Blue',         family: 'blue' },
  { id: 'teal',             hex: '#008080', name: 'Teal',             family: 'blue' },
  { id: 'prussian-blue',    hex: '#003153', name: 'Prussian Blue',    family: 'blue' },

  // Greens
  { id: 'hunter-green',     hex: '#355E3B', name: 'Hunter Green',     family: 'green' },
  { id: 'olive',            hex: '#808000', name: 'Olive',            family: 'green' },
  { id: 'emerald',          hex: '#50C878', name: 'Emerald',          family: 'green' },
  { id: 'sea-green',        hex: '#2E8B57', name: 'Sea Green',        family: 'green' },
  { id: 'moss',             hex: '#4A5D23', name: 'Moss',             family: 'green' },

  // Reds / Warm
  { id: 'brick-red',        hex: '#CB4154', name: 'Brick Red',        family: 'warm' },
  { id: 'rust',             hex: '#B7410E', name: 'Rust',             family: 'warm' },
  { id: 'wine',             hex: '#722F37', name: 'Wine',             family: 'warm' },
  { id: 'coral',            hex: '#FF7F50', name: 'Coral',            family: 'warm' },
  { id: 'burnt-sienna',     hex: '#E97451', name: 'Burnt Sienna',     family: 'warm' },
  { id: 'mahogany',         hex: '#C04000', name: 'Mahogany',         family: 'warm' },
  { id: 'crimson',          hex: '#DC143C', name: 'Crimson',          family: 'warm' },

  // Browns / Earth
  { id: 'walnut',           hex: '#5C4033', name: 'Walnut',           family: 'earth' },
  { id: 'espresso',         hex: '#3C1414', name: 'Espresso',         family: 'earth' },
  { id: 'chestnut',         hex: '#954535', name: 'Chestnut',         family: 'earth' },
  { id: 'cocoa',            hex: '#4B3621', name: 'Cocoa',            family: 'earth' },
  { id: 'saddle-brown',     hex: '#8B4513', name: 'Saddle Brown',     family: 'earth' },

  // Beiges / Creams
  { id: 'linen',            hex: '#FAF0E6', name: 'Linen',            family: 'neutral' },
  { id: 'ivory',            hex: '#FFFFF0', name: 'Ivory',            family: 'neutral' },
  { id: 'sand',             hex: '#C2B280', name: 'Sand',             family: 'neutral' },
  { id: 'almond',           hex: '#EFDECD', name: 'Almond',           family: 'neutral' },
  { id: 'champagne',        hex: '#F7E7CE', name: 'Champagne',        family: 'neutral' },
  { id: 'wheat',            hex: '#F5DEB3', name: 'Wheat',            family: 'neutral' },

  // Metals
  { id: 'brushed-aluminum', hex: '#A8A9AD', name: 'Brushed Aluminum', family: 'metal' },
  { id: 'antique-brass',    hex: '#CD9575', name: 'Antique Brass',    family: 'metal' },
  { id: 'bronze',           hex: '#CD7F32', name: 'Bronze',           family: 'metal' },
  { id: 'copper',           hex: '#B87333', name: 'Copper',           family: 'metal' },
  { id: 'nickel',           hex: '#727472', name: 'Nickel',           family: 'metal' },
  { id: 'gold',             hex: '#FFD700', name: 'Gold',             family: 'metal' },
  { id: 'rose-gold',        hex: '#B76E79', name: 'Rose Gold',        family: 'metal' },
  { id: 'pewter',           hex: '#96A8A1', name: 'Pewter',           family: 'metal' },
];
