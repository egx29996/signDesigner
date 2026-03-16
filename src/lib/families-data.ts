import type { DesignTokens, ColorEntry } from '../types/tokens';

// ---------------------------------------------------------------------------
// Family tier type
// ---------------------------------------------------------------------------

export type FamilyTier = 'good' | 'better' | 'best' | 'premium';

// ---------------------------------------------------------------------------
// Family definition
// ---------------------------------------------------------------------------

export interface FamilyDef {
  id: string;
  name: string;
  tier: FamilyTier;
  description: string;
  defaultTokens: DesignTokens;
  curatedPalette: ColorEntry[];
}

// ---------------------------------------------------------------------------
// Essentials  — Good tier
// ---------------------------------------------------------------------------

const essentialsTokens: DesignTokens = {
  faceMaterial: 'acrylic',
  faceColor: '#1B2A4A',         // navy
  backerMaterial: 'none',
  backerColor: '#1B2A4A',
  metalAccentFinish: 'satin_aluminum',
  raisedTextColor: '#FFFFFF',   // white
  insertBgColor: '#FFFFFF',
  insertTextColor: '#1B2A4A',
  accentColor: '#4A5568',       // slate
  fontFamily: 'Helvetica Neue',
  pictogramFamily: 'geometric',
  productionMethod: 'thermoform',
  surfaceTreatment: '1st_surface',
  constructionType: 'single_piece',
  cornerRadius: 3,
  dividerStyle: 'thin_line',
};

const essentialsPalette: ColorEntry[] = [
  { id: 'ess-navy',       hex: '#1B2A4A', name: 'Navy',          family: 'blue' },
  { id: 'ess-white',      hex: '#FFFFFF', name: 'White',         family: 'neutral' },
  { id: 'ess-slate',      hex: '#4A5568', name: 'Slate',         family: 'neutral' },
  { id: 'ess-light-gray', hex: '#D1D5DB', name: 'Light Gray',    family: 'neutral' },
  { id: 'ess-charcoal',   hex: '#2D2D2D', name: 'Charcoal',      family: 'neutral' },
  { id: 'ess-steel',      hex: '#4682B4', name: 'Steel Blue',    family: 'blue' },
  { id: 'ess-cream',      hex: '#F5F0E8', name: 'Cream',         family: 'neutral' },
  { id: 'ess-black',      hex: '#000000', name: 'Black',         family: 'neutral' },
];

// ---------------------------------------------------------------------------
// Metro  — Better tier
// ---------------------------------------------------------------------------

const metroTokens: DesignTokens = {
  faceMaterial: 'acrylic',
  faceColor: '#2D2D2D',         // charcoal
  backerMaterial: 'acrylic',
  backerColor: '#374151',       // dark gray
  metalAccentFinish: 'brass',
  raisedTextColor: '#FFFFFF',
  insertBgColor: '#F5F0E8',
  insertTextColor: '#2D2D2D',
  accentColor: '#B8860B',       // brass
  fontFamily: 'Montserrat',
  pictogramFamily: 'geometric',
  productionMethod: 'thermoform',
  surfaceTreatment: '1st_surface',
  constructionType: 'two_piece',
  cornerRadius: 2,
  dividerStyle: 'accent_bar',
};

const metroPalette: ColorEntry[] = [
  { id: 'met-charcoal',   hex: '#2D2D2D', name: 'Charcoal',       family: 'neutral' },
  { id: 'met-white',      hex: '#FFFFFF', name: 'White',          family: 'neutral' },
  { id: 'met-brass',      hex: '#B8860B', name: 'Brass',          family: 'metal' },
  { id: 'met-dark-gray',  hex: '#374151', name: 'Dark Gray',      family: 'neutral' },
  { id: 'met-cream',      hex: '#F5F0E8', name: 'Cream',          family: 'neutral' },
  { id: 'met-gunmetal',   hex: '#2C3539', name: 'Gunmetal',       family: 'neutral' },
  { id: 'met-slate',      hex: '#4A5568', name: 'Slate',          family: 'neutral' },
  { id: 'met-warm-gray',  hex: '#78716C', name: 'Warm Gray',      family: 'neutral' },
  { id: 'met-bronze',     hex: '#CD7F32', name: 'Bronze',         family: 'metal' },
  { id: 'met-black',      hex: '#000000', name: 'Black',          family: 'neutral' },
];

// ---------------------------------------------------------------------------
// Signature  — Best tier
// ---------------------------------------------------------------------------

const signatureTokens: DesignTokens = {
  faceMaterial: 'walnut_wood',
  faceColor: '#5C4033',         // walnut
  backerMaterial: 'acrylic',
  backerColor: '#2D2D2D',
  metalAccentFinish: 'brushed_nickel',
  raisedTextColor: '#F5F0E8',   // cream
  insertBgColor: '#F5F0E8',
  insertTextColor: '#5C4033',
  accentColor: '#8B7D6B',       // taupe
  fontFamily: 'Garamond',
  pictogramFamily: 'rounded',
  productionMethod: 'applique',
  surfaceTreatment: '1st_surface',
  constructionType: 'two_piece',
  cornerRadius: 4,
  dividerStyle: 'accent_bar',
};

const signaturePalette: ColorEntry[] = [
  { id: 'sig-walnut',      hex: '#5C4033', name: 'Walnut',         family: 'earth' },
  { id: 'sig-cream',       hex: '#F5F0E8', name: 'Cream',          family: 'neutral' },
  { id: 'sig-taupe',       hex: '#8B7D6B', name: 'Taupe',          family: 'neutral' },
  { id: 'sig-charcoal',    hex: '#2D2D2D', name: 'Charcoal',       family: 'neutral' },
  { id: 'sig-sage',        hex: '#7D8E7B', name: 'Sage',           family: 'green' },
  { id: 'sig-linen',       hex: '#FAF0E6', name: 'Linen',          family: 'neutral' },
  { id: 'sig-espresso',    hex: '#3C1414', name: 'Espresso',        family: 'earth' },
  { id: 'sig-forest',      hex: '#2D4A2D', name: 'Forest',         family: 'green' },
  { id: 'sig-nickel',      hex: '#727472', name: 'Nickel',          family: 'metal' },
  { id: 'sig-burgundy',    hex: '#6B2D3E', name: 'Burgundy',       family: 'warm' },
  { id: 'sig-sand',        hex: '#C2B280', name: 'Sand',            family: 'neutral' },
  { id: 'sig-ivory',       hex: '#FFFFF0', name: 'Ivory',           family: 'neutral' },
];

// ---------------------------------------------------------------------------
// Prestige  — Premium tier
// ---------------------------------------------------------------------------

const prestigeTokens: DesignTokens = {
  faceMaterial: 'brushed_aluminum',
  faceColor: '#A8A9AD',         // brushed aluminum
  backerMaterial: 'painted_metal',
  backerColor: '#000000',
  metalAccentFinish: 'matte_black',
  raisedTextColor: '#000000',   // matte black
  insertBgColor: '#000000',
  insertTextColor: '#A8A9AD',
  accentColor: '#000000',
  fontFamily: 'Futura',
  pictogramFamily: 'bold',
  productionMethod: 'applique',
  surfaceTreatment: '1st_surface',
  constructionType: 'three_piece',
  cornerRadius: 0,
  dividerStyle: 'thin_line',
};

const prestigePalette: ColorEntry[] = [
  { id: 'pre-aluminum',    hex: '#A8A9AD', name: 'Brushed Aluminum', family: 'metal' },
  { id: 'pre-matte-black', hex: '#000000', name: 'Matte Black',      family: 'neutral' },
  { id: 'pre-white',       hex: '#FFFFFF', name: 'White',            family: 'neutral' },
  { id: 'pre-gunmetal',    hex: '#2C3539', name: 'Gunmetal',         family: 'neutral' },
  { id: 'pre-silver',      hex: '#C0C0C0', name: 'Silver',           family: 'metal' },
  { id: 'pre-charcoal',    hex: '#2D2D2D', name: 'Charcoal',         family: 'neutral' },
  { id: 'pre-dark-gray',   hex: '#374151', name: 'Dark Gray',        family: 'neutral' },
  { id: 'pre-champagne',   hex: '#F7E7CE', name: 'Champagne',        family: 'neutral' },
  { id: 'pre-pewter',      hex: '#96A8A1', name: 'Pewter',           family: 'metal' },
  { id: 'pre-bronze',      hex: '#CD7F32', name: 'Bronze',           family: 'metal' },
];

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const FAMILIES: FamilyDef[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    tier: 'good',
    description:
      'Clean, minimal single-piece thermoformed signs. Navy and white palette with geometric pictograms — the reliable workhorse for budget-conscious projects.',
    defaultTokens: essentialsTokens,
    curatedPalette: essentialsPalette,
  },
  {
    id: 'metro',
    name: 'Metro',
    tier: 'better',
    description:
      'Modern urban aesthetic with charcoal base and brass accents. Two-piece construction adds depth and a polished feel suited for Class A office and mixed-use.',
    defaultTokens: metroTokens,
    curatedPalette: metroPalette,
  },
  {
    id: 'signature',
    name: 'Signature',
    tier: 'best',
    description:
      'Premium natural materials with real walnut wood face and cream text. Appliqué construction delivers a handcrafted look for upscale hospitality and residential.',
    defaultTokens: signatureTokens,
    curatedPalette: signaturePalette,
  },
  {
    id: 'prestige',
    name: 'Prestige',
    tier: 'premium',
    description:
      'Luxury minimal — brushed aluminum face with matte black raised text. Three-piece construction with zero radius corners. The statement piece for trophy assets.',
    defaultTokens: prestigeTokens,
    curatedPalette: prestigePalette,
  },
];

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

export function getFamilyById(id: string): FamilyDef | undefined {
  return FAMILIES.find((f) => f.id === id);
}

export function getFamilyDefaults(familyId: string): DesignTokens {
  const family = getFamilyById(familyId);
  if (!family) {
    throw new Error(`Unknown family: ${familyId}`);
  }
  return { ...family.defaultTokens };
}
