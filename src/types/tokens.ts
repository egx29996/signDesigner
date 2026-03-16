export interface DesignTokens {
  faceMaterial: string;
  faceColor: string;
  backerMaterial: string;
  backerColor: string;
  metalAccentFinish: 'brass' | 'brushed_nickel' | 'satin_aluminum' | 'matte_black' | 'chrome' | 'bronze';
  raisedTextColor: string;
  insertBgColor: string;
  insertTextColor: string;
  accentColor: string;
  fontFamily: string;
  pictogramFamily: 'geometric' | 'rounded' | 'bold';
  productionMethod: 'thermoform' | 'applique' | 'direct_print';
  surfaceTreatment: '1st_surface' | '2nd_surface';
  constructionType: 'single_piece' | 'two_piece' | 'three_piece';
  cornerRadius: number;
  dividerStyle: 'accent_bar' | 'thin_line' | 'none';
}

export interface ColorEntry {
  id: string;
  hex: string;
  name: string;
  code?: string;
  brand?: 'egx' | 'sherwin_williams' | 'benjamin_moore' | 'pantone' | 'custom';
  family?: string;
}

export interface MaterialDef {
  id: string;
  name: string;
  type: 'solid' | 'wood' | 'metal' | 'stone';
  color1?: string;
  color2?: string;
  color3?: string;
}

export interface FontDef {
  id: string;
  name: string;
  css: string;
  google: string;
}
