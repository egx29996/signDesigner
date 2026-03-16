import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { DesignTokens, ColorEntry, SignTypeState, PackageMetadata, SerializedPackage, ZoneContent } from '../types';
import { getFamilyById } from '../lib/families-data';
import { SIGN_TYPES, getDefaultZones } from '../lib/sign-type-defaults';

const MAX_HISTORY = 50;

interface HistorySnapshot {
  designTokens: DesignTokens;
  signTypes: SignTypeState[];
}

interface PackageState {
  // --- Data ---
  packageId: string | null;
  packageName: string;
  familyId: string;
  designTokens: DesignTokens;
  tokenColorSources: Record<string, ColorEntry>;
  signTypes: SignTypeState[];
  metadata: PackageMetadata;
  status: 'draft' | 'submitted' | 'quoted';
  shareToken: string | null;

  // --- History ---
  history: HistorySnapshot[];
  historyIndex: number;
  isDirty: boolean;

  // --- Actions ---
  loadFamily: (familyId: string) => void;
  setToken: <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => void;
  setTokenBatch: (updates: Partial<DesignTokens>) => void;
  setSignTypeOverride: (signTypeId: string, key: keyof DesignTokens, value: unknown) => void;
  clearSignTypeOverride: (signTypeId: string, key: keyof DesignTokens) => void;
  setZoneVisible: (signTypeId: string, zoneId: string, visible: boolean) => void;
  setZoneContent: (signTypeId: string, zoneId: string, content: Partial<ZoneContent>) => void;
  setSignSize: (signTypeId: string, w: number, h: number) => void;
  setQuantity: (signTypeId: string, qty: number) => void;
  reorderZones: (signTypeId: string, fromIndex: number, toIndex: number) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  serialize: () => SerializedPackage;
  hydrate: (data: SerializedPackage) => void;
  markClean: () => void;
}

const DEFAULT_TOKENS: DesignTokens = {
  faceMaterial: 'solid',
  faceColor: '#1a3c5e',
  backerMaterial: 'solid',
  backerColor: '#ffffff',
  metalAccentFinish: 'brushed_nickel',
  raisedTextColor: '#ffffff',
  insertBgColor: '#ffffff',
  insertTextColor: '#1a3c5e',
  accentColor: '#c9a84c',
  fontFamily: 'inter',
  pictogramFamily: 'geometric',
  productionMethod: 'thermoform',
  surfaceTreatment: '1st_surface',
  constructionType: 'two_piece',
  cornerRadius: 4,
  dividerStyle: 'accent_bar',
};

const DEFAULT_METADATA: PackageMetadata = {
  projectName: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  propertyAddress: '',
  notes: '',
};

function takeSnapshot(state: { designTokens: DesignTokens; signTypes: SignTypeState[] }): HistorySnapshot {
  return structuredClone({ designTokens: state.designTokens, signTypes: state.signTypes });
}

export const usePackageStore = create<PackageState>()(
  immer((set, get) => ({
    // --- Initial state ---
    packageId: null,
    packageName: 'Untitled Package',
    familyId: '',
    designTokens: { ...DEFAULT_TOKENS },
    tokenColorSources: {},
    signTypes: [],
    metadata: { ...DEFAULT_METADATA },
    status: 'draft',
    shareToken: null,
    history: [],
    historyIndex: -1,
    isDirty: false,

    // --- Actions ---

    loadFamily(familyId: string) {
      const family = getFamilyById(familyId);
      if (!family) return;
      const signTypes: SignTypeState[] = SIGN_TYPES.map((st) => ({
        id: st.id,
        typeCode: st.code,
        typeName: st.name,
        size: { w: st.defaultW, h: st.defaultH },
        zones: getDefaultZones(st.code),
        tokenOverrides: {},
        quantity: 0,
      }));
      set((s) => {
        s.familyId = familyId;
        s.designTokens = structuredClone(family.defaultTokens);
        s.signTypes = signTypes;
        s.history = [takeSnapshot({ designTokens: s.designTokens, signTypes: s.signTypes })];
        s.historyIndex = 0;
        s.isDirty = true;
      });
    },

    setToken(key, value) {
      get().pushHistory();
      set((s) => {
        (s.designTokens as Record<string, unknown>)[key] = value;
        s.isDirty = true;
      });
    },

    setTokenBatch(updates) {
      get().pushHistory();
      set((s) => {
        Object.assign(s.designTokens, updates);
        s.isDirty = true;
      });
    },

    setSignTypeOverride(signTypeId, key, value) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        if (st) {
          (st.tokenOverrides as Record<string, unknown>)[key] = value;
          s.isDirty = true;
        }
      });
    },

    clearSignTypeOverride(signTypeId, key) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        if (st) {
          delete (st.tokenOverrides as Record<string, unknown>)[key];
          s.isDirty = true;
        }
      });
    },

    setZoneVisible(signTypeId, zoneId, visible) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        const zone = st?.zones.find((z) => z.id === zoneId);
        if (zone) {
          zone.visible = visible;
          s.isDirty = true;
        }
      });
    },

    setZoneContent(signTypeId, zoneId, content) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        const zone = st?.zones.find((z) => z.id === zoneId);
        if (zone) {
          Object.assign(zone.content, content);
          s.isDirty = true;
        }
      });
    },

    setSignSize(signTypeId, w, h) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        if (st) {
          st.size = { w, h };
          s.isDirty = true;
        }
      });
    },

    setQuantity(signTypeId, qty) {
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        if (st) {
          st.quantity = Math.max(0, qty);
          s.isDirty = true;
        }
      });
    },

    reorderZones(signTypeId, fromIndex, toIndex) {
      get().pushHistory();
      set((s) => {
        const st = s.signTypes.find((t) => t.id === signTypeId);
        if (!st) return;
        const zones = st.zones;
        const [moved] = zones.splice(fromIndex, 1);
        zones.splice(toIndex, 0, moved);
        // Update order numbers
        zones.forEach((z, i) => { z.order = i; });
        s.isDirty = true;
      });
    },

    pushHistory() {
      set((s) => {
        const snapshot = takeSnapshot(s);
        // Truncate any forward history after current index
        const newHistory = s.history.slice(0, s.historyIndex + 1);
        newHistory.push(snapshot);
        // Cap at MAX_HISTORY entries
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }
        s.history = newHistory;
        s.historyIndex = newHistory.length - 1;
      });
    },

    undo() {
      set((s) => {
        if (s.historyIndex <= 0) return;
        s.historyIndex -= 1;
        const snapshot = structuredClone(s.history[s.historyIndex]);
        s.designTokens = snapshot.designTokens;
        s.signTypes = snapshot.signTypes;
        s.isDirty = true;
      });
    },

    redo() {
      set((s) => {
        if (s.historyIndex >= s.history.length - 1) return;
        s.historyIndex += 1;
        const snapshot = structuredClone(s.history[s.historyIndex]);
        s.designTokens = snapshot.designTokens;
        s.signTypes = snapshot.signTypes;
        s.isDirty = true;
      });
    },

    serialize(): SerializedPackage {
      const s = get();
      return {
        packageId: s.packageId,
        packageName: s.packageName,
        familyId: s.familyId,
        designTokens: structuredClone(s.designTokens),
        tokenColorSources: structuredClone(s.tokenColorSources),
        signTypes: structuredClone(s.signTypes),
        metadata: structuredClone(s.metadata),
        status: s.status,
        shareToken: s.shareToken,
      };
    },

    hydrate(data: SerializedPackage) {
      set((s) => {
        s.packageId = data.packageId;
        s.packageName = data.packageName;
        s.familyId = data.familyId;
        s.designTokens = structuredClone(data.designTokens);
        s.tokenColorSources = structuredClone(data.tokenColorSources);
        s.signTypes = structuredClone(data.signTypes);
        s.metadata = structuredClone(data.metadata);
        s.status = data.status;
        s.shareToken = data.shareToken;
        s.history = [takeSnapshot({ designTokens: s.designTokens, signTypes: s.signTypes })];
        s.historyIndex = 0;
        s.isDirty = false;
      });
    },

    markClean() {
      set((s) => {
        s.isDirty = false;
      });
    },
  }))
);
