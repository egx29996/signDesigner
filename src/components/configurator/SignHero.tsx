import React, { useMemo } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { SignRenderer } from '../svg/SignRenderer';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyById } from '../../lib/families-data';

export const SignHero: React.FC = () => {
  const [zoom, setZoom] = React.useState(1);

  const familyId = usePackageStore((s) => s.familyId);
  const designTokens = usePackageStore((s) => s.designTokens);
  const signTypes = usePackageStore((s) => s.signTypes);
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);

  const activeSign = useMemo(
    () => signTypes.find((st) => st.id === activeSignTypeId) ?? signTypes[0],
    [signTypes, activeSignTypeId],
  );

  const resolvedTokens = useMemo(() => {
    if (!activeSign) return designTokens;
    const family = getFamilyById(familyId);
    const defaults = family?.defaultTokens ?? designTokens;
    return resolveTokens(defaults, designTokens, activeSign.tokenOverrides);
  }, [familyId, designTokens, activeSign]);

  if (!activeSign) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: '#f5f3f0' }}
      >
        <p className="text-gray-400 text-sm">Select a sign family to begin</p>
      </div>
    );
  }

  const dimLabel = `${activeSign.size.w}″ × ${activeSign.size.h}″ — ${activeSign.typeName}`;
  const scale = zoom * 1.8;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#f5f3f0' }}
    >
      {/* Sign preview */}
      <div
        className="transition-opacity duration-300"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}
      >
        <SignRenderer
          signType={activeSign}
          resolvedTokens={resolvedTokens}
          familyId={familyId}
          scale={scale}
          showDimensions={false}
        />
      </div>

      {/* Dimension label */}
      <p className="mt-4 text-xs font-medium text-gray-500 tracking-wide">
        {dimLabel}
      </p>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur rounded-lg border border-gray-200 p-0.5">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-[10px] text-gray-400 font-medium w-8 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
};
