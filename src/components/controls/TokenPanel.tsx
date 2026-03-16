import { useEditorStore } from '../../stores/editor-store';
import { MaterialTab } from './MaterialTab';
import { ColorTab } from './ColorTab';
import { ZoneTab } from './ZoneTab';
import { SizeTab } from './SizeTab';
import { OverrideTab } from './OverrideTab';
import { TypographyTab } from './TypographyTab';

const TABS = [
  { id: 'materials', label: 'Materials' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Type' },
  { id: 'zones', label: 'Zones' },
  { id: 'size', label: 'Size' },
  { id: 'overrides', label: 'Per-Sign' },
] as const;

export function TokenPanel() {
  const activeTab = useEditorStore((s) => s.activeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex gap-0.5 rounded-md bg-white/[0.04] p-0.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded py-1.5 text-[10px] font-semibold tracking-wide transition-colors ${
                isActive
                  ? 'bg-accent-bg-strong text-accent-muted'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-2 flex-1 overflow-y-auto">
        {activeTab === 'materials' && <MaterialTab />}
        {activeTab === 'colors' && <ColorTab />}
        {activeTab === 'zones' && <ZoneTab />}
        {activeTab === 'typography' && <TypographyTab />}
        {activeTab === 'size' && <SizeTab />}
        {activeTab === 'overrides' && <OverrideTab />}
      </div>
    </div>
  );
}
