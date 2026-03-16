import { useCallback } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Eye, EyeOff } from 'lucide-react';
import { Section } from '../primitives/Section';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import type { ZoneState } from '../../types';

const DIVIDER_STYLES = [
  { id: 'accent_bar', label: 'Accent Bar' },
  { id: 'thin_line', label: 'Thin Line' },
  { id: 'none', label: 'None' },
] as const;

const ZONE_TYPE_LABELS: Record<string, string> = {
  header: 'Header',
  primary_text: 'Primary Text',
  braille: 'Braille',
  pictogram: 'Pictogram',
  insert: 'Insert',
  secondary_text: 'Secondary Text',
  divider: 'Divider',
  directional: 'Directional',
  listing: 'Listing',
  availability: 'Availability',
  code_info: 'Code Info',
  backer: 'Backer',
};

interface SortableZoneItemProps {
  zone: ZoneState;
  signTypeId: string;
  onToggleVisible: (zoneId: string, visible: boolean) => void;
}

function SortableZoneItem({ zone, signTypeId: _signTypeId, onToggleVisible }: SortableZoneItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: zone.id, disabled: zone.locked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isToggleable =
    !zone.locked &&
    ['header', 'insert', 'divider', 'secondary_text', 'pictogram'].includes(zone.zoneType);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1.5 rounded-[4px] border border-border bg-white/[0.02] px-1.5 py-1.5"
    >
      {/* Drag handle or lock icon */}
      {zone.locked ? (
        <Lock className="h-3.5 w-3.5 shrink-0 text-text-muted" />
      ) : (
        <button
          type="button"
          className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-secondary"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Zone label */}
      <span className="flex-1 text-[11px] text-text-secondary">
        {ZONE_TYPE_LABELS[zone.zoneType] ?? zone.zoneType.replace(/_/g, ' ')}
      </span>

      {/* Visibility toggle */}
      {isToggleable && (
        <button
          type="button"
          onClick={() => onToggleVisible(zone.id, !zone.visible)}
          className="shrink-0 text-text-muted hover:text-text-secondary"
          title={zone.visible ? 'Hide zone' : 'Show zone'}
        >
          {zone.visible ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 opacity-50" />
          )}
        </button>
      )}

      {/* Locked zones always show as visible */}
      {zone.locked && (
        <span className="text-[9px] text-text-muted">Required</span>
      )}
    </div>
  );
}

export function ZoneTab() {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const signTypes = usePackageStore((s) => s.signTypes);
  const tokens = usePackageStore((s) => s.designTokens);
  const setToken = usePackageStore((s) => s.setToken);
  const setZoneVisible = usePackageStore((s) => s.setZoneVisible);
  const setZoneContent = usePackageStore((s) => s.setZoneContent);
  const reorderZones = usePackageStore((s) => s.reorderZones);

  const activeSign = signTypes.find((s) => s.id === activeSignTypeId);
  if (!activeSign) {
    return (
      <div className="p-2 text-[11px] text-text-muted">
        No sign type selected.
      </div>
    );
  }

  const sortedZones = [...activeSign.zones].sort((a, b) => a.order - b.order);
  const zoneIds = sortedZones.map((z) => z.id);

  // Editable content zones
  const primaryTextZone = activeSign.zones.find((z) => z.zoneType === 'primary_text');
  const insertZone = activeSign.zones.find((z) => z.zoneType === 'insert');

  const handleToggleVisible = useCallback(
    (zoneId: string, visible: boolean) => {
      setZoneVisible(activeSignTypeId, zoneId, visible);
    },
    [activeSignTypeId, setZoneVisible],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const fromIndex = sortedZones.findIndex((z) => z.id === active.id);
      const toIndex = sortedZones.findIndex((z) => z.id === over.id);
      if (fromIndex === -1 || toIndex === -1) return;

      // ADA constraint: braille must stay below primary_text
      const reordered = [...sortedZones];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      const primaryIdx = reordered.findIndex((z) => z.zoneType === 'primary_text');
      const brailleIdx = reordered.findIndex((z) => z.zoneType === 'braille');

      if (primaryIdx !== -1 && brailleIdx !== -1 && brailleIdx < primaryIdx) {
        // Violation: braille above primary_text — revert
        return;
      }

      // Map back to the actual zones array indices
      const actualFromIndex = activeSign.zones.findIndex((z) => z.id === active.id);
      const actualToIndex = activeSign.zones.findIndex((z) => z.id === over.id);

      reorderZones(activeSignTypeId, actualFromIndex, actualToIndex);
    },
    [activeSignTypeId, activeSign.zones, sortedZones, reorderZones],
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Zone Order (drag-and-drop) */}
      <Section title="Zone Order">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={zoneIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1">
              {sortedZones.map((zone) => (
                <SortableZoneItem
                  key={zone.id}
                  zone={zone}
                  signTypeId={activeSignTypeId}
                  onToggleVisible={handleToggleVisible}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Section>

      {/* Divider Style */}
      <Section title="Divider Style">
        <div className="flex flex-col gap-1">
          {DIVIDER_STYLES.map((ds) => {
            const isActive = tokens.dividerStyle === ds.id;
            return (
              <button
                key={ds.id}
                type="button"
                onClick={() => setToken('dividerStyle', ds.id)}
                className={`rounded-[4px] border px-2 py-1.5 text-left text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-white/[0.03] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                {ds.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Corner Radius */}
      <Section title="Corner Radius">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={tokens.cornerRadius}
            onChange={(e) => setToken('cornerRadius', Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
          />
          <span className="min-w-[28px] text-right text-[11px] text-text-secondary">
            {tokens.cornerRadius}px
          </span>
        </div>
      </Section>

      {/* Content */}
      <Section title="Content">
        <div className="flex flex-col gap-2">
          {primaryTextZone && (
            <div>
              <label className="mb-1 block text-[10px] font-medium text-text-muted">
                Room Number
              </label>
              <input
                type="text"
                value={primaryTextZone.content.text ?? ''}
                onChange={(e) =>
                  setZoneContent(activeSignTypeId, primaryTextZone.id, {
                    text: e.target.value,
                  })
                }
                className="w-full rounded border border-border bg-white/5 p-1.5 text-[13px] text-text-primary outline-none focus:border-accent"
                placeholder="e.g. 101"
              />
            </div>
          )}
          {insertZone && insertZone.visible && (
            <div>
              <label className="mb-1 block text-[10px] font-medium text-text-muted">
                Name / Insert
              </label>
              <input
                type="text"
                value={insertZone.content.text ?? ''}
                onChange={(e) =>
                  setZoneContent(activeSignTypeId, insertZone.id, {
                    text: e.target.value,
                  })
                }
                className="w-full rounded border border-border bg-white/5 p-1.5 text-[13px] text-text-primary outline-none focus:border-accent"
                placeholder="e.g. Conference Room"
              />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
