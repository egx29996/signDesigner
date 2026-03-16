import React, { useMemo } from 'react';
import { Download, Send } from 'lucide-react';
import { usePackageStore } from '../../../stores/package-store';
import { getFamilyById } from '../../../lib/families-data';
import { getTexture } from '../../../lib/texture-registry';
import { SignRenderer } from '../../svg/SignRenderer';

// ---------------------------------------------------------------------------
// ReviewStep
// ---------------------------------------------------------------------------

export const ReviewStep: React.FC = () => {
  const familyId = usePackageStore((s) => s.familyId);
  const designTokens = usePackageStore((s) => s.designTokens);
  const signTypes = usePackageStore((s) => s.signTypes);

  const family = useMemo(() => getFamilyById(familyId), [familyId]);
  const texture = useMemo(() => getTexture(designTokens.faceMaterial), [designTokens.faceMaterial]);

  // Only sign types with qty > 0
  const activeTypes = useMemo(
    () => signTypes.filter((s) => s.quantity > 0),
    [signTypes],
  );

  const totalCount = useMemo(
    () => activeTypes.reduce((sum, s) => sum + s.quantity, 0),
    [activeTypes],
  );

  if (!family) {
    return (
      <div className="px-4 py-12 text-center text-gray-400">
        Please configure your package first.
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Package</h2>
        <p className="mt-2 text-sm text-gray-500">
          Confirm your selections before submitting for a quote.
        </p>
      </div>

      {/* Package summary card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{family.name} Collection</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalCount} {totalCount === 1 ? 'sign' : 'signs'} across{' '}
              {activeTypes.length} {activeTypes.length === 1 ? 'type' : 'types'}
            </p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
            style={{
              backgroundColor: 'rgba(26, 60, 94, 0.08)',
              color: '#1a3c5e',
            }}
          >
            {family.tier}
          </span>
        </div>

        {/* Token summary */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-gray-400">Material</span>
            <p className="font-semibold text-gray-700 mt-0.5">
              {texture?.name ?? designTokens.faceMaterial}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Face Color</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-200"
                style={{ backgroundColor: designTokens.faceColor }}
              />
              <span className="font-semibold text-gray-700">{designTokens.faceColor}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Text Color</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-200"
                style={{ backgroundColor: designTokens.raisedTextColor }}
              />
              <span className="font-semibold text-gray-700">{designTokens.raisedTextColor}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Pictogram</span>
            <p className="font-semibold text-gray-700 mt-0.5 capitalize">
              {designTokens.pictogramFamily}
            </p>
          </div>
        </div>
      </div>

      {/* Sign type grid */}
      {activeTypes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {activeTypes.map((st) => {
            const resolvedTokens = { ...designTokens, ...st.tokenOverrides };

            return (
              <div
                key={st.id}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4"
              >
                {/* Sign preview */}
                <div className="flex items-center justify-center w-full h-28 overflow-hidden mb-3">
                  <SignRenderer
                    signType={st}
                    resolvedTokens={resolvedTokens}
                    familyId={familyId}
                    scale={0.45}
                    showDimensions
                  />
                </div>

                {/* Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900">{st.typeName}</span>
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {st.typeCode}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {st.size.w}&Prime; &times; {st.size.h}&Prime;
                  </span>
                  <div className="mt-1">
                    <span className="text-sm font-bold" style={{ color: '#1a3c5e' }}>
                      Qty: {st.quantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 mb-8 text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl">
          No sign types have quantities set. Go back to add quantities.
        </div>
      )}

      {/* Sign schedule table */}
      {activeTypes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Sign Schedule</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeTypes.map((st, i) => (
                  <tr
                    key={st.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900">{st.typeName}</td>
                    <td className="px-4 py-2.5 text-gray-500">{st.typeCode}</td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {st.size.w}" x {st.size.h}"
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                      {st.quantity}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td colSpan={3} className="px-4 py-2.5 font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900">
                    {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Download PDF
        </button>

        <button
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: '#c9a84c' }}
        >
          <Send size={16} />
          Submit for Quote
        </button>
      </div>
    </div>
  );
};
