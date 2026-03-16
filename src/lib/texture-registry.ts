export interface TextureDefinition {
  id: string;
  name: string;
  imagePath: string;
  tileSize: number;
  opacity: number;
  baseColor?: string;
  category: 'metal' | 'wood' | 'stone' | 'solid' | 'specialty';
}

export const TEXTURE_REGISTRY: TextureDefinition[] = [
  // Metals
  { id: 'brushed-aluminum', name: 'Brushed Aluminum', imagePath: 'metal/brushed-aluminum.jpg', tileSize: 200, opacity: 0.25, baseColor: '#c0c0c0', category: 'metal' },
  { id: 'brushed-gold', name: 'Brushed Gold', imagePath: 'metal/brushed-gold.jpg', tileSize: 200, opacity: 0.25, baseColor: '#c9a84c', category: 'metal' },
  { id: 'brushed-bronze', name: 'Brushed Bronze', imagePath: 'metal/brushed-bronze.jpg', tileSize: 200, opacity: 0.25, baseColor: '#8B6914', category: 'metal' },
  { id: 'brushed-copper', name: 'Brushed Copper', imagePath: 'metal/brushed-copper.jpg', tileSize: 200, opacity: 0.2, baseColor: '#b87333', category: 'metal' },
  { id: 'brushed-nickel', name: 'Brushed Nickel', imagePath: 'metal/brushed-nickel.jpg', tileSize: 200, opacity: 0.2, baseColor: '#a0a0a0', category: 'metal' },
  { id: 'matte-black-metal', name: 'Matte Black Metal', imagePath: 'metal/matte-black.jpg', tileSize: 200, opacity: 0.15, baseColor: '#1a1a1a', category: 'metal' },
  { id: 'stainless-steel', name: 'Stainless Steel', imagePath: 'metal/stainless-steel.jpg', tileSize: 200, opacity: 0.2, baseColor: '#d4d4d4', category: 'metal' },

  // Woods
  { id: 'walnut', name: 'Walnut', imagePath: 'wood/walnut.jpg', tileSize: 300, opacity: 0.5, baseColor: '#5C4033', category: 'wood' },
  { id: 'oak', name: 'White Oak', imagePath: 'wood/oak.jpg', tileSize: 300, opacity: 0.45, baseColor: '#C4A882', category: 'wood' },
  { id: 'maple', name: 'Maple', imagePath: 'wood/maple.jpg', tileSize: 300, opacity: 0.4, baseColor: '#E8D4B8', category: 'wood' },
  { id: 'cherry', name: 'Cherry', imagePath: 'wood/cherry.jpg', tileSize: 300, opacity: 0.45, baseColor: '#8B4513', category: 'wood' },
  { id: 'ebony', name: 'Ebony', imagePath: 'wood/ebony.jpg', tileSize: 300, opacity: 0.35, baseColor: '#2C1B0E', category: 'wood' },

  // Stone
  { id: 'marble-white', name: 'White Marble', imagePath: 'stone/marble-white.jpg', tileSize: 400, opacity: 0.3, baseColor: '#f0ece4', category: 'stone' },
  { id: 'slate', name: 'Slate', imagePath: 'stone/slate.jpg', tileSize: 300, opacity: 0.3, baseColor: '#4a5568', category: 'stone' },
  { id: 'concrete', name: 'Concrete', imagePath: 'stone/concrete.jpg', tileSize: 300, opacity: 0.2, baseColor: '#9ca3af', category: 'stone' },

  // Solids (no texture overlay, pure color)
  { id: 'acrylic-matte', name: 'Acrylic Matte', imagePath: '', tileSize: 0, opacity: 0, category: 'solid' },
  { id: 'acrylic-gloss', name: 'Acrylic Gloss', imagePath: '', tileSize: 0, opacity: 0, category: 'solid' },
  { id: 'photopolymer', name: 'Photopolymer', imagePath: '', tileSize: 0, opacity: 0, category: 'solid' },
];

export function getTexture(id: string): TextureDefinition | undefined {
  return TEXTURE_REGISTRY.find(t => t.id === id);
}

export function getTexturesByCategory(category: TextureDefinition['category']): TextureDefinition[] {
  return TEXTURE_REGISTRY.filter(t => t.category === category);
}

/**
 * Generate an SVG pattern definition string for a texture.
 * Can be injected into SVG defs.
 */
export function generateTexturePattern(
  texture: TextureDefinition,
  patternId: string,
  tintColor?: string,
): string {
  if (!texture.imagePath) {
    return '';
  }

  const color = tintColor || texture.baseColor || '#808080';
  return [
    `<pattern id="${patternId}" patternUnits="userSpaceOnUse" width="${texture.tileSize}" height="${texture.tileSize}">`,
    `  <rect width="${texture.tileSize}" height="${texture.tileSize}" fill="${color}" />`,
    `  <image href="/textures/${texture.imagePath}" width="${texture.tileSize}" height="${texture.tileSize}" opacity="${texture.opacity}" preserveAspectRatio="xMidYMid slice" />`,
    `</pattern>`,
  ].join('\n');
}

/**
 * Load a texture image and return a data URL for inline use.
 */
const textureDataCache = new Map<string, string>();

export async function loadTextureAsDataUrl(texturePath: string): Promise<string> {
  const cached = textureDataCache.get(texturePath);
  if (cached) return cached;

  const res = await fetch(`/textures/${texturePath}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      textureDataCache.set(texturePath, dataUrl);
      resolve(dataUrl);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
