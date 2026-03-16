import React from 'react';
import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';

export const QuantityEditor: React.FC = () => {
  const signTypes = usePackageStore((s) => s.signTypes);
  const setQuantity = usePackageStore((s) => s.setQuantity);
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const setActiveSignType = useEditorStore((s) => s.setActiveSignType);

  const totalQty = signTypes.reduce((sum, st) => sum + st.quantity, 0);
  const activeCount = signTypes.filter((st) => st.quantity > 0).length;

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">
          Quantities
        </h3>
        <span className="text-[10px] text-text-muted">
          {totalQty} signs · {activeCount} types
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {signTypes.map((st) => {
          const isActive = st.id === activeSignTypeId;
          return (
            <div
              key={st.id}
              className={`flex items-center gap-2 rounded px-2 py-1 transition-colors cursor-pointer ${
                isActive ? 'bg-accent-bg-strong' : 'hover:bg-surface-hover'
              }`}
              onClick={() => setActiveSignType(st.id)}
            >
              <span className={`flex-1 text-[11px] truncate ${
                isActive ? 'text-accent-light font-medium' : 'text-text-secondary'
              }`}>
                {st.typeName}
              </span>
              <span className="text-[9px] text-text-muted font-mono mr-1">
                {st.typeCode}
              </span>

              {/* Quantity controls */}
              <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setQuantity(st.id, st.quantity - 1)}
                  disabled={st.quantity <= 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold
                    bg-surface-elevated border border-border text-text-secondary
                    hover:bg-surface-hover hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={st.quantity}
                  onChange={(e) => setQuantity(st.id, Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-8 h-5 text-center text-[11px] font-mono bg-surface border border-border rounded
                    text-text-primary outline-none focus:border-accent
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(st.id, st.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold
                    bg-surface-elevated border border-border text-text-secondary
                    hover:bg-surface-hover hover:text-text-primary"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
