import React from 'react';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { FONT_OPTIONS, MATERIALS } from '../../lib/constants';

export const BottomBar: React.FC = () => {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);

  const activeSign = signTypes.find((st) => st.id === activeSignTypeId);

  if (!activeSign) {
    return (
      <div className="h-8 min-h-8 flex items-center px-4 bg-surface border-t border-border">
        <span className="text-xs text-text-muted">No sign type selected</span>
      </div>
    );
  }

  const font = FONT_OPTIONS.find((f) => f.id === designTokens.fontFamily);
  const faceMat = MATERIALS.find((m) => m.id === designTokens.faceMaterial);
  const productionLabel = designTokens.productionMethod
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const sizeLabel = `${activeSign.size.w}\u2033\u00D7${activeSign.size.h}\u2033`;

  return (
    <div className="h-8 min-h-8 flex items-center justify-between px-4 bg-surface border-t border-border">
      {/* Left: Sign info pills */}
      <div className="flex items-center gap-3">
        <InfoPill label="Type" value={activeSign.typeName} />
        <InfoPill label="Code" value={activeSign.typeCode} />
        <InfoPill label="Size" value={sizeLabel} />
        <InfoPill label="Method" value={productionLabel} />
      </div>

      {/* Right: Font + Material */}
      <div className="flex items-center gap-3">
        <InfoPill label="Font" value={font?.name ?? designTokens.fontFamily} />
        <InfoPill label="Material" value={faceMat?.name ?? designTokens.faceMaterial} />
      </div>
    </div>
  );
};

const InfoPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
    <span className="text-xs text-text-secondary font-medium">{value}</span>
  </div>
);
