import React from 'react';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyDefaults } from '../../lib/families-data';
import { PackageSignCard } from './PackageSignCard';

export const PackageOverview: React.FC = () => {
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const setActiveSignType = useEditorStore((s) => s.setActiveSignType);
  const setViewMode = useEditorStore((s) => s.setViewMode);

  let familyDefaults = designTokens;
  try {
    familyDefaults = getFamilyDefaults(familyId);
  } catch {
    /* use global tokens */
  }

  const handleCardClick = (id: string) => {
    setActiveSignType(id);
    setViewMode('single');
  };

  const activeCount = signTypes.filter((s) => s.quantity > 0).length;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Package Overview</h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Click any sign to edit {'\u00B7'} {activeCount} type{activeCount !== 1 ? 's' : ''} with quantities set
          </p>
        </div>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
      >
        {signTypes.map((st) => {
          const resolved = resolveTokens(familyDefaults, designTokens, st.tokenOverrides);
          return (
            <PackageSignCard
              key={st.id}
              signType={st}
              resolvedTokens={resolved}
              isActive={st.id === activeSignTypeId}
              onClick={() => handleCardClick(st.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
