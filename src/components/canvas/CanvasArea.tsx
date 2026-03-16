import React from 'react';
import { useEditorStore } from '../../stores/editor-store';
import { usePackageStore } from '../../stores/package-store';
import { SignRenderer } from '../svg/SignRenderer';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyDefaults } from '../../lib/families-data';
import { PackageOverview } from './PackageOverview';

export const CanvasArea: React.FC = () => {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const setActiveSignType = useEditorStore((s) => s.setActiveSignType);
  const viewMode = useEditorStore((s) => s.viewMode);
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);

  // Package overview mode
  if (viewMode === 'package') {
    return <PackageOverview />;
  }

  // Single sign mode
  const activeSign = signTypes.find((st) => st.id === activeSignTypeId);

  // Resolve tokens for the active sign
  let resolvedTokens = designTokens;
  if (activeSign && familyId) {
    try {
      const familyDefaults = getFamilyDefaults(familyId);
      resolvedTokens = resolveTokens(familyDefaults, designTokens, activeSign.tokenOverrides);
    } catch {
      // Fall back to global tokens if family not found
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sign type switcher strip */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border overflow-x-auto">
        {signTypes.map((st) => {
          const isActive = st.id === activeSignTypeId;
          const btnClass = [
            'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors shrink-0',
            isActive
              ? 'bg-accent-bg-strong border border-accent/40 text-accent-light'
              : 'bg-surface-elevated border border-border text-text-secondary hover:border-border-active hover:text-text-primary',
          ].join(' ');
          return (
            <button
              key={st.id}
              onClick={() => setActiveSignType(st.id)}
              className={btnClass}
            >
              {/* Color indicator dot matching face color */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/10"
                style={{ backgroundColor: resolveSignFaceColor(st, designTokens, familyId) }}
              />
              <span>{st.typeName}</span>
              <span className="text-text-muted text-[10px]">{st.typeCode}</span>
              {st.quantity > 0 && (
                <span className="ml-0.5 bg-accent/20 text-accent text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {'\u00D7'}{st.quantity}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        {/* Wall background texture */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, var(--color-surface-hover) 0%, var(--color-surface) 70%)',
          }}
        />

        {/* Sign renderer */}
        <div className="relative z-10">
          {activeSign ? (
            <SignRenderer
              signType={activeSign}
              resolvedTokens={resolvedTokens}
              scale={1.6}
              showDimensions
            />
          ) : (
            <div className="text-text-muted text-sm">
              Select a sign type above to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Resolve the face color for a sign type (used for the indicator dot).
 */
function resolveSignFaceColor(
  st: { tokenOverrides: Record<string, unknown> },
  globalTokens: { faceColor: string },
  familyId: string,
): string {
  // Check sign-level override first
  if (typeof st.tokenOverrides.faceColor === 'string') {
    return st.tokenOverrides.faceColor;
  }
  // Then global tokens
  if (globalTokens.faceColor) {
    return globalTokens.faceColor;
  }
  // Fall back to family defaults
  try {
    const defaults = getFamilyDefaults(familyId);
    return defaults.faceColor;
  } catch {
    return '#1a3c5e';
  }
}
