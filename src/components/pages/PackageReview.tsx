import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackageStore } from '../../stores/package-store';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyById, getFamilyDefaults } from '../../lib/families-data';
import { SignRenderer } from '../svg/SignRenderer';
import { svgToPng } from '../../lib/svg-serializer';
import { exportPackagePdf } from '../../lib/pdf-export';

export const PackageReview: React.FC = () => {
  const navigate = useNavigate();
  const signTypes = usePackageStore((s) => s.signTypes);
  const designTokens = usePackageStore((s) => s.designTokens);
  const familyId = usePackageStore((s) => s.familyId);
  const metadata = usePackageStore((s) => s.metadata);
  const setQuantity = usePackageStore((s) => s.setQuantity);
  const [exporting, setExporting] = useState(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const family = getFamilyById(familyId);
  let familyDefaults = designTokens;
  try { familyDefaults = getFamilyDefaults(familyId); } catch { /* fallback */ }

  const activeTypes = signTypes.filter((st) => st.quantity > 0);
  const totalQty = signTypes.reduce((sum, st) => sum + st.quantity, 0);

  const handleExportPdf = useCallback(async () => {
    setExporting(true);
    try {
      const signImages = new Map<string, string>();
      if (svgContainerRef.current) {
        const svgs = svgContainerRef.current.querySelectorAll('svg');
        const ids = activeTypes.map((st) => st.id);
        for (let i = 0; i < svgs.length && i < ids.length; i++) {
          try {
            const png = await svgToPng(svgs[i] as SVGSVGElement, 2);
            signImages.set(ids[i], png);
          } catch (err) { console.warn('Capture failed:', err); }
        }
      }
      await exportPackagePdf({
        signTypes, designTokens, metadata,
        familyName: family?.name ?? 'Custom', signImages,
      });
    } catch (err) { console.error('PDF export failed:', err); }
    finally { setExporting(false); }
  }, [signTypes, designTokens, metadata, family, activeTypes]);

  if (activeTypes.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">No Signs in Package</h2>
        <p className="text-sm text-text-muted mb-4">Set quantities for at least one sign type.</p>
        <button onClick={() => navigate('/designer')} className="px-4 py-2 text-sm rounded bg-accent text-white hover:bg-accent-light">
          Back to Designer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-surface-elevated border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/designer')} className="text-text-secondary hover:text-text-primary text-sm">
            {'\u2190 Back'}
          </button>
          <span className="text-text-muted text-sm">|</span>
          <span className="text-text-primary text-sm font-semibold">Package Review</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-muted">
            {activeTypes.length} types | {totalQty} signs
          </span>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="px-4 py-1.5 text-xs font-medium rounded bg-accent text-white hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Generating...' : 'Download PDF'}
          </button>
          <button disabled className="px-4 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white opacity-50">
            Submit for Quote
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="mb-6 p-4 rounded-lg bg-surface-elevated border border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            {metadata.projectName || 'Untitled'} {'\u2014 '}{family?.name ?? 'Custom'} Family
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            {activeTypes.length} types | {totalQty} signs
          </p>
          <div className="flex gap-4 text-[11px] text-text-secondary mt-1">
            <span>Production: {designTokens.productionMethod.replace(/_/g, ' ')}</span>
            <span>Construction: {designTokens.constructionType.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <div ref={svgContainerRef} className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {activeTypes.map((st) => {
            const resolved = resolveTokens(familyDefaults, designTokens, st.tokenOverrides);
            const PX = 25;
            const svgW = st.size.w * PX + 20;
            const svgH = st.size.h * PX + 34;
            const cardScale = Math.min(280 / svgW, 220 / svgH, 1.5);
            return (
              <div key={st.id} className="flex flex-col items-center p-4 rounded-lg bg-surface-elevated border border-border">
                <SignRenderer signType={st} resolvedTokens={resolved} scale={cardScale} showDimensions />
                <div className="mt-4 w-full flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{st.typeName}</div>
                    <div className="text-[11px] text-text-muted">{st.typeCode}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQuantity(st.id, st.quantity - 1)}
                      disabled={st.quantity <= 0}
                      className="w-7 h-7 flex items-center justify-center rounded bg-surface border border-border text-text-secondary hover:text-text-primary disabled:opacity-30"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={st.quantity}
                      onChange={(e) => setQuantity(st.id, Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-10 h-7 text-center text-sm font-mono bg-surface border border-border rounded text-text-primary outline-none focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setQuantity(st.id, st.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-surface border border-border text-text-secondary hover:text-text-primary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-border overflow-hidden">
          <div className="bg-surface-elevated px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Sign Schedule</h3>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-surface-hover">
                <th className="px-4 py-2 text-left text-text-muted">Code</th>
                <th className="px-4 py-2 text-left text-text-muted">Type</th>
                <th className="px-4 py-2 text-left text-text-muted">Size</th>
                <th className="px-4 py-2 text-center text-text-muted">Qty</th>
                <th className="px-4 py-2 text-left text-text-muted">Production</th>
                <th className="px-4 py-2 text-left text-text-muted">Construction</th>
              </tr>
            </thead>
            <tbody>
              {activeTypes.map((st, idx) => (
                <tr key={st.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-elevated'}>
                  <td className="px-4 py-2 font-mono text-text-secondary">{st.typeCode}</td>
                  <td className="px-4 py-2 text-text-primary font-medium">{st.typeName}</td>
                  <td className="px-4 py-2 text-text-secondary">{st.size.w}" x {st.size.h}"</td>
                  <td className="px-4 py-2 text-center font-bold text-text-primary">{st.quantity}</td>
                  <td className="px-4 py-2 text-text-secondary capitalize">{designTokens.productionMethod.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 text-text-secondary capitalize">{designTokens.constructionType.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-elevated border-t border-border">
                <td colSpan={3} className="px-4 py-2 text-text-primary font-semibold">Total</td>
                <td className="px-4 py-2 text-center font-bold text-accent">{totalQty}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
