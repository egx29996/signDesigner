import type { DesignTokens, ColorEntry } from './tokens';

export type ZoneType =
  | 'header'
  | 'primary_text'
  | 'braille'
  | 'pictogram'
  | 'insert'
  | 'secondary_text'
  | 'divider'
  | 'directional'
  | 'listing'
  | 'availability'
  | 'code_info'
  | 'backer';

export interface ZoneContent {
  text?: string;
  icon?: string;
  rows?: Array<{ label: string; value: string; arrow?: 'left' | 'right' | 'up' }>;
  state?: 'available' | 'in_use';
}

export interface ZoneState {
  id: string;
  zoneType: ZoneType;
  content: ZoneContent;
  styleBindings: Record<string, string>;
  visible: boolean;
  locked: boolean;
  order: number;
}

export interface SignTypeState {
  id: string;
  typeCode: string;
  typeName: string;
  size: { w: number; h: number };
  zones: ZoneState[];
  tokenOverrides: Partial<DesignTokens>;
  quantity: number;
}

export interface PackageMetadata {
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyAddress: string;
  notes: string;
}

export interface SignTypeDef {
  id: string;
  name: string;
  code: string;
  defaultW: number;
  defaultH: number;
}

export interface SerializedPackage {
  packageId: string | null;
  packageName: string;
  familyId: string;
  designTokens: DesignTokens;
  tokenColorSources: Record<string, ColorEntry>;
  signTypes: SignTypeState[];
  metadata: PackageMetadata;
  status: 'draft' | 'submitted' | 'quoted';
  shareToken: string | null;
}
