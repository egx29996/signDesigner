import type { FontDef, MaterialDef } from '../types/tokens';

export const FONT_OPTIONS: FontDef[] = [
  { id: 'futura', name: 'ADA Futura', css: "'Questrial', sans-serif", google: 'Questrial' },
  { id: 'helvetica', name: 'ADA Helvetica', css: "'DM Sans', sans-serif", google: 'DM+Sans:wght@400;500;700' },
  { id: 'avenir', name: 'ADA Avenir', css: "'Nunito Sans', sans-serif", google: 'Nunito+Sans:wght@400;600;700' },
  { id: 'gotham', name: 'ADA Gotham', css: "'Outfit', sans-serif", google: 'Outfit:wght@400;500;700' },
];

export const MATERIALS: MaterialDef[] = [
  { id: 'solid', name: 'Solid Color', type: 'solid' },
  { id: 'walnut', name: 'Dark Walnut', type: 'wood', color1: '#3E2723', color2: '#5D4037', color3: '#4E342E' },
  { id: 'oak', name: 'Natural Oak', type: 'wood', color1: '#C4A882', color2: '#D4B896', color3: '#B89B72' },
  { id: 'maple', name: 'Light Maple', type: 'wood', color1: '#E8D5B7', color2: '#F0E0C8', color3: '#DCC9A6' },
  { id: 'brushed_alum', name: 'Brushed Aluminum', type: 'metal', color1: '#B8BEC4', color2: '#CDD3D9', color3: '#A8AEB4' },
  { id: 'brass', name: 'Brushed Brass', type: 'metal', color1: '#C5A55A', color2: '#D4B76A', color3: '#B6944A' },
  { id: 'slate', name: 'Slate Stone', type: 'stone', color1: '#6B7B8D', color2: '#7D8D9F', color3: '#5A6A7C' },
];
