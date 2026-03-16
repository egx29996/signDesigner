import { create } from 'zustand';

interface EditorState {
  activeSignTypeId: string;
  viewMode: 'single' | 'package';
  activeTab: 'materials' | 'colors' | 'zones' | 'size' | 'overrides' | 'typography';
  activeColorTarget: string | null;
  setActiveSignType: (id: string) => void;
  setViewMode: (mode: 'single' | 'package') => void;
  setActiveTab: (tab: EditorState['activeTab']) => void;
  setActiveColorTarget: (target: string | null) => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  activeSignTypeId: 'room_id',
  viewMode: 'single',
  activeTab: 'materials',
  activeColorTarget: null,

  setActiveSignType(id) {
    set({ activeSignTypeId: id });
  },

  setViewMode(mode) {
    set({ viewMode: mode });
  },

  setActiveTab(tab) {
    set({ activeTab: tab });
  },

  setActiveColorTarget(target) {
    set({ activeColorTarget: target });
  },
}));
