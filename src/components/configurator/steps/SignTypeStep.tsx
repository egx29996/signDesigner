import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import { usePackageStore } from '../../../stores/package-store';
import { useEditorStore } from '../../../stores/editor-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';
import { SignRenderer } from '../../svg/SignRenderer';

// ---------------------------------------------------------------------------
// SignTypeStep
// ---------------------------------------------------------------------------

export const SignTypeStep: React.FC = () => {
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const setActiveSignType = useEditorStore((s) => s.setActiveSignType);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveSignType(id);
      setTimeout(() => nextStep(), 300);
    },
    [setActiveSignType, nextStep],
  );

  if (signTypes.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-gray-400">
        Please select a Sign Family first.
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Sign Type</h2>
        <p className="mt-2 text-sm text-gray-500">
          Select which sign type to customize. You can revisit other types later.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {signTypes.map((st) => {
          const selected = activeSignTypeId === st.id;
          const resolvedTokens = { ...designTokens, ...st.tokenOverrides };

          return (
            <button
              key={st.id}
              onClick={() => handleSelect(st.id)}
              className={[
                'relative flex flex-col items-center rounded-xl p-4 transition-all duration-200 cursor-pointer',
                'border bg-white',
                selected
                  ? 'border-2 border-[#1a3c5e] bg-blue-50/50 shadow-md ring-2 ring-[#1a3c5e]/20'
                  : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5',
              ].join(' ')}
            >
              {/* Selected check */}
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1a3c5e] flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Sign preview */}
              <div className="flex items-center justify-center w-full h-24 overflow-hidden">
                <SignRenderer
                  signType={st}
                  resolvedTokens={resolvedTokens}
                  familyId={familyId}
                  scale={0.4}
                />
              </div>

              {/* Name + code badge */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-sm font-semibold text-gray-900 truncate">{st.typeName}</span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  {st.typeCode}
                </span>
              </div>

              {/* Dimensions */}
              <span className="text-xs text-gray-400 mt-0.5">
                {st.size.w}&Prime; &times; {st.size.h}&Prime;
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
