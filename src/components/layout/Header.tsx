import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../stores/editor-store';
import { usePackageStore } from '../../stores/package-store';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const viewMode = useEditorStore((s) => s.viewMode);
  const setViewMode = useEditorStore((s) => s.setViewMode);
  const signTypes = usePackageStore((s) => s.signTypes);

  const activeCount = signTypes.filter((st) => st.quantity > 0).length;
  const totalQty = signTypes.reduce((sum, st) => sum + st.quantity, 0);

  return (
    <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-surface-elevated border-b border-border">
      {/* Left: Logo + title */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
          EGX
        </span>
        <span className="text-text-muted text-sm">|</span>
        <span className="text-text-secondary text-sm font-medium tracking-wide">
          Sign Designer
        </span>
      </div>

      {/* Center: View mode toggle */}
      <div className="flex items-center gap-1 bg-surface rounded-md p-0.5 border border-border">
        <ViewToggleBtn
          label="Single"
          active={viewMode === 'single'}
          onClick={() => setViewMode('single')}
        />
        <ViewToggleBtn
          label="Package"
          active={viewMode === 'package'}
          onClick={() => setViewMode('package')}
        />
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-3">
        {totalQty > 0 && (
          <span className="text-[10px] text-text-muted">
            {activeCount} types · {totalQty} signs
          </span>
        )}
        <button
          onClick={() => navigate('/review')}
          disabled={activeCount === 0}
          className="px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary
            hover:border-accent hover:text-accent transition-colors
            disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-secondary"
        >
          Review &amp; PDF
        </button>
        <button
          disabled
          className="px-3 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white cursor-not-allowed opacity-50"
        >
          Submit for Quote
        </button>
      </div>
    </header>
  );
};

/** Small toggle button used inside the view-mode segmented control. */
function ViewToggleBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const cls = [
    'px-3 py-1 text-[11px] font-semibold rounded transition-colors',
    active
      ? 'bg-accent-bg-strong text-accent-light shadow-sm'
      : 'text-text-muted hover:text-text-secondary',
  ].join(' ');

  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  );
}
