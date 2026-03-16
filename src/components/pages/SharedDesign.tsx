import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSharedPackage } from '../../lib/persistence';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyById, getFamilyDefaults } from '../../lib/families-data';
import { SignRenderer } from '../svg/SignRenderer';
import type { SerializedPackage } from '../../types';

export const SharedDesign: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<SerializedPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    loadSharedPackage(token)
      .then((data) => {
        if (!data) {
          setError('Design not found or link has expired.');
        } else {
          setPkg(data);
        }
      })
      .catch(() => setError('Failed to load shared design.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Shared Design</h2>
        <p className="text-sm text-text-muted mb-6">{error || 'Design not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90"
        >
          Design Your Own
        </button>
      </div>
    );
  }

  const family = getFamilyById(pkg.familyId);
  let familyDefaults = pkg.designTokens;
  try { familyDefaults = getFamilyDefaults(pkg.familyId); } catch { /* fallback */ }

  const activeTypes = pkg.signTypes.filter((st) => st.quantity > 0);
  const totalQty = pkg.signTypes.reduce((sum, st) => sum + st.quantity, 0);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-surface-elevated border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            EGX
          </span>
          <span className="text-text-muted text-sm">|</span>
          <span className="text-text-secondary text-sm font-medium tracking-wide">Shared Design</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity"
        >
          Design Your Own
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Package info */}
          <div className="mb-6 p-4 rounded-lg bg-surface-elevated border border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              {pkg.packageName} — {family?.name ?? 'Custom'} Family
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              {activeTypes.length} types | {totalQty} signs
            </p>
            {pkg.metadata.projectName && (
              <p className="text-[11px] text-text-secondary mt-1">
                Project: {pkg.metadata.projectName}
              </p>
            )}
          </div>

          {/* Sign cards */}
          {activeTypes.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-10">
              No signs configured in this package.
            </p>
          ) : (
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
            >
              {activeTypes.map((st) => {
                const resolved = resolveTokens(familyDefaults, pkg.designTokens, st.tokenOverrides);
                const PX = 25;
                const svgW = st.size.w * PX + 20;
                const svgH = st.size.h * PX + 34;
                const cardScale = Math.min(280 / svgW, 220 / svgH, 1.5);

                return (
                  <div
                    key={st.id}
                    className="flex flex-col items-center p-4 rounded-lg bg-surface-elevated border border-border"
                  >
                    <SignRenderer signType={st} resolvedTokens={resolved} scale={cardScale} showDimensions />
                    <div className="mt-4 w-full flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-text-primary">{st.typeName}</div>
                        <div className="text-[11px] text-text-muted">{st.typeCode}</div>
                      </div>
                      <div className="text-sm font-bold text-text-primary">
                        Qty: {st.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sign schedule table */}
          {activeTypes.length > 0 && (
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
                  </tr>
                </thead>
                <tbody>
                  {activeTypes.map((st, idx) => (
                    <tr key={st.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-elevated'}>
                      <td className="px-4 py-2 font-mono text-text-secondary">{st.typeCode}</td>
                      <td className="px-4 py-2 text-text-primary font-medium">{st.typeName}</td>
                      <td className="px-4 py-2 text-text-secondary">{st.size.w}" x {st.size.h}"</td>
                      <td className="px-4 py-2 text-center font-bold text-text-primary">{st.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-elevated border-t border-border">
                    <td colSpan={3} className="px-4 py-2 text-text-primary font-semibold">Total</td>
                    <td className="px-4 py-2 text-center font-bold text-accent">{totalQty}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-xs text-text-muted mb-3">Want to create your own sign package?</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity"
            >
              Design Your Own
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-text-muted mt-10">
            Powered by EGX Group — Make Your Projects One Trade Lighter
          </p>
        </div>
      </div>
    </div>
  );
};
