import type { SignTypeDef, ZoneState } from '../types';

// ---------------------------------------------------------------------------
// Sign type definitions — the 10 core types
// ---------------------------------------------------------------------------

export const SIGN_TYPES: SignTypeDef[] = [
  { id: 'room_id',    name: 'Room ID',       code: 'H',   defaultW: 8,  defaultH: 8 },
  { id: 'unit',       name: 'Unit',          code: 'A',   defaultW: 4,  defaultH: 4 },
  { id: 'restroom',   name: 'Restroom',      code: 'E',   defaultW: 8,  defaultH: 8 },
  { id: 'stairwell',  name: 'Stairwell',     code: 'E.2', defaultW: 8,  defaultH: 8 },
  { id: 'fire',       name: 'Fire Safety',   code: 'F',   defaultW: 8,  defaultH: 10 },
  { id: 'directory',  name: 'Directory',     code: 'B',   defaultW: 18, defaultH: 24 },
  { id: 'wayfinding', name: 'Wayfinding',    code: 'D',   defaultW: 18, defaultH: 12 },
  { id: 'overhead',   name: 'Overhead',      code: 'C',   defaultW: 24, defaultH: 6 },
  { id: 'flag',       name: 'Flag Mount',    code: 'M',   defaultW: 6,  defaultH: 6 },
  { id: 'meeting',    name: 'Meeting Room',  code: 'J',   defaultW: 10, defaultH: 10 },
];

// ---------------------------------------------------------------------------
// Default zone templates per sign type
// ---------------------------------------------------------------------------

type ZoneTemplate = Omit<ZoneState, 'id'> & { idSuffix: string };

function buildZones(typeCode: string, templates: ZoneTemplate[]): ZoneState[] {
  return templates.map((t) => ({
    id: `${typeCode}-${t.idSuffix}`,
    zoneType: t.zoneType,
    content: t.content,
    styleBindings: t.styleBindings,
    visible: t.visible,
    locked: t.locked,
    order: t.order,
  }));
}

const ZONE_TEMPLATES: Record<string, ZoneTemplate[]> = {
  // --- Room ID (H) ---
  H: [
    {
      idSuffix: 'header',
      zoneType: 'header',
      content: {},
      styleBindings: { backgroundColor: 'accentColor' },
      visible: true,
      locked: false,
      order: 0,
    },
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: '' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 2,
    },
    {
      idSuffix: 'divider',
      zoneType: 'divider',
      content: {},
      styleBindings: { color: 'accentColor' },
      visible: true,
      locked: false,
      order: 3,
    },
    {
      idSuffix: 'insert',
      zoneType: 'insert',
      content: {},
      styleBindings: { backgroundColor: 'insertBgColor', textColor: 'insertTextColor' },
      visible: true,
      locked: false,
      order: 4,
    },
  ],

  // --- Unit (A) ---
  A: [
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: '' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
  ],

  // --- Restroom (E) ---
  E: [
    {
      idSuffix: 'pictogram',
      zoneType: 'pictogram',
      content: { icon: 'restroom_unisex' },
      styleBindings: { color: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: 'RESTROOM' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 2,
    },
  ],

  // --- Stairwell (E.2) ---
  'E.2': [
    {
      idSuffix: 'pictogram',
      zoneType: 'pictogram',
      content: { icon: 'stairwell' },
      styleBindings: { color: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: 'STAIRWELL' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 2,
    },
    {
      idSuffix: 'code-info',
      zoneType: 'code_info',
      content: {},
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: false,
      order: 3,
    },
  ],

  // --- Fire Safety (F) ---
  F: [
    {
      idSuffix: 'pictogram',
      zoneType: 'pictogram',
      content: { icon: 'fire_exit' },
      styleBindings: { color: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
    {
      idSuffix: 'code-info',
      zoneType: 'code_info',
      content: { text: 'IN CASE OF FIRE\nUSE STAIRWAYS FOR EXIT\nDO NOT USE ELEVATORS' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 2,
    },
  ],

  // --- Directory (B) ---
  B: [
    {
      idSuffix: 'header',
      zoneType: 'header',
      content: { text: 'DIRECTORY' },
      styleBindings: { backgroundColor: 'accentColor' },
      visible: true,
      locked: false,
      order: 0,
    },
    {
      idSuffix: 'listing',
      zoneType: 'listing',
      content: {
        rows: [
          { label: 'Leasing Office',   value: '101' },
          { label: 'Management',       value: '102' },
          { label: 'Conference Room',  value: '103' },
          { label: 'Fitness Center',   value: '104' },
          { label: 'Mailroom',         value: '105' },
        ],
      },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: false,
      order: 1,
    },
  ],

  // --- Wayfinding (D) ---
  D: [
    {
      idSuffix: 'header',
      zoneType: 'header',
      content: { text: 'FLOOR 2' },
      styleBindings: { backgroundColor: 'accentColor' },
      visible: true,
      locked: false,
      order: 0,
    },
    {
      idSuffix: 'directional',
      zoneType: 'directional',
      content: {
        rows: [
          { label: 'Rooms 201-210', value: '', arrow: 'left' as const },
          { label: 'Rooms 211-220', value: '', arrow: 'right' as const },
          { label: 'Elevators',     value: '', arrow: 'up' as const },
        ],
      },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: false,
      order: 1,
    },
  ],

  // --- Overhead (C) ---
  C: [
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: 'ELEVATORS' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
  ],

  // --- Flag Mount (M) ---
  M: [
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: '201' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 0,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
  ],

  // --- Meeting Room (J) ---
  J: [
    {
      idSuffix: 'header',
      zoneType: 'header',
      content: {},
      styleBindings: { backgroundColor: 'accentColor' },
      visible: true,
      locked: false,
      order: 0,
    },
    {
      idSuffix: 'primary',
      zoneType: 'primary_text',
      content: { text: 'BOARDROOM' },
      styleBindings: { textColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 1,
    },
    {
      idSuffix: 'braille',
      zoneType: 'braille',
      content: {},
      styleBindings: { dotColor: 'raisedTextColor' },
      visible: true,
      locked: true,
      order: 2,
    },
    {
      idSuffix: 'insert',
      zoneType: 'insert',
      content: {},
      styleBindings: { backgroundColor: 'insertBgColor', textColor: 'insertTextColor' },
      visible: true,
      locked: false,
      order: 3,
    },
    {
      idSuffix: 'availability',
      zoneType: 'availability',
      content: { state: 'available' },
      styleBindings: {},
      visible: true,
      locked: false,
      order: 4,
    },
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getDefaultZones(typeCode: string): ZoneState[] {
  const templates = ZONE_TEMPLATES[typeCode];
  if (!templates) {
    return [];
  }
  return buildZones(typeCode, templates);
}
