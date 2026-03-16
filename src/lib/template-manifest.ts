export interface TemplateSlot {
  elementId: string;
  tokenKey: string;
  type: 'fill' | 'stroke' | 'pattern';
}

export interface TextSlot {
  elementId: string;
  zoneType: string;
  defaultContent?: string;
}

export interface PictogramSlot {
  elementId: string;
  width: number;
  height: number;
}

export interface TemplateConfig {
  svgPath: string;
  colorSlots: TemplateSlot[];
  textSlots: TextSlot[];
  pictogramSlot?: PictogramSlot;
  viewBox: string;
}

const DEFAULT_COLOR_SLOTS: TemplateSlot[] = [
  { elementId: 'face-fill', tokenKey: 'faceColor', type: 'fill' },
  { elementId: 'raised-text', tokenKey: 'raisedTextColor', type: 'fill' },
  { elementId: 'accent-bar', tokenKey: 'accentColor', type: 'fill' },
  { elementId: 'insert-background', tokenKey: 'insertBgColor', type: 'fill' },
  { elementId: 'insert-text', tokenKey: 'insertTextColor', type: 'fill' },
  { elementId: 'backer', tokenKey: 'faceColor', type: 'fill' },
];

// Registry: templates[familyId][signTypeId] = TemplateConfig
const TEMPLATE_REGISTRY: Record<string, Record<string, TemplateConfig>> = {};

function getTemplateConfig(familyId: string, signTypeId: string): TemplateConfig | null {
  return TEMPLATE_REGISTRY[familyId]?.[signTypeId] ?? null;
}

function registerTemplate(familyId: string, signTypeId: string, config: TemplateConfig) {
  if (!TEMPLATE_REGISTRY[familyId]) {
    TEMPLATE_REGISTRY[familyId] = {};
  }
  TEMPLATE_REGISTRY[familyId][signTypeId] = config;
}

// ── Register sample Metro templates ──────────────────────────────────
registerTemplate('metro', 'room_id', {
  svgPath: 'metro/room_id.svg',
  colorSlots: DEFAULT_COLOR_SLOTS,
  textSlots: [
    { elementId: 'text-room-number', zoneType: 'room_number', defaultContent: '101' },
    { elementId: 'text-primary', zoneType: 'primary_text', defaultContent: 'CONFERENCE' },
  ],
  viewBox: '0 0 200 200',
});

registerTemplate('metro', 'restroom', {
  svgPath: 'metro/restroom.svg',
  colorSlots: DEFAULT_COLOR_SLOTS,
  textSlots: [
    { elementId: 'text-primary', zoneType: 'primary_text', defaultContent: 'RESTROOM' },
  ],
  pictogramSlot: { elementId: 'pictogram-slot', width: 120, height: 100 },
  viewBox: '0 0 200 200',
});

registerTemplate('metro', 'directory', {
  svgPath: 'metro/directory.svg',
  colorSlots: DEFAULT_COLOR_SLOTS,
  textSlots: [
    { elementId: 'text-primary', zoneType: 'primary_text', defaultContent: 'DIRECTORY' },
  ],
  viewBox: '0 0 450 600',
});

export { DEFAULT_COLOR_SLOTS, TEMPLATE_REGISTRY, getTemplateConfig, registerTemplate };
