import React, { useCallback, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { usePackageStore } from '../../../stores/package-store';
import { SignRenderer } from '../../svg/SignRenderer';

// ---------------------------------------------------------------------------
// QuantitiesStep
// ---------------------------------------------------------------------------

export const QuantitiesStep: React.FC = () => {
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);
  const setQuantity = usePackageStore((s) => s.setQuantity);

  const handleDecrement = useCallback(
    (id: string, currentQty: number) => {
      setQuantity(id, Math.max(0, currentQty - 1));
    },
    [setQuantity],
  );

  const handleIncrement = useCallback(
    (id: string, currentQty: number) => {
      setQuantity(id, currentQty + 1);
    },
    [setQuantity],
  );

  const handleInputChange = useCallback(
    (id: string, value: string) => {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        setQuantity(id, Math.max(0, parsed));
      } else if (value === '') {
        setQuantity(id, 0);
      }
    },
    [setQuantity],
  );

  const totalCount = useMemo(
    () => signTypes.reduce((sum, s) => sum + s.quantity, 0),
    [signTypes],
  );

  const activeTypeCount = useMemo(
    () => signTypes.filter((s) => s.quantity > 0).length,
    [signTypes],
  );

  if (signTypes.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-gray-400">
        Please select a Sign Family first.
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Quantities</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set how many of each sign type you need.
        </p>
      </div>

      <div className="space-y-3">
        {signTypes.map((st) => {
          const resolvedTokens = { ...designTokens, ...st.tokenOverrides };
          const isActive = st.quantity > 0;

          return (
            <div
              key={st.id}
              className={[
                'flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors duration-200',
                isActive
                  ? 'border-[#1a3c5e]/30 bg-blue-50/30'
                  : 'border-gray-200 bg-white',
              ].join(' ')}
            >
              {/* Mini preview */}
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center overflow-hidden">
                <SignRenderer
                  signType={st}
                  resolvedTokens={resolvedTokens}
                  familyId={familyId}
                  scale={0.2}
                />
              </div>

              {/* Name + code */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {st.typeName}
                  </span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    {st.typeCode}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {st.size.w}&Prime; &times; {st.size.h}&Prime;
                </span>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrement(st.id, st.quantity)}
                  disabled={st.quantity === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  value={st.quantity}
                  onChange={(e) => handleInputChange(st.id, e.target.value)}
                  className="w-12 h-8 text-center text-sm font-bold text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:border-transparent"
                />

                <button
                  onClick={() => handleIncrement(st.id, st.quantity)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <span className="text-sm text-gray-500">
          <span className="font-bold text-gray-900">{totalCount}</span>{' '}
          {totalCount === 1 ? 'sign' : 'signs'} across{' '}
          <span className="font-bold text-gray-900">{activeTypeCount}</span>{' '}
          {activeTypeCount === 1 ? 'type' : 'types'}
        </span>
      </div>
    </div>
  );
};
