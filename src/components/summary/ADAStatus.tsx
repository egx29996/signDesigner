import { usePackageStore } from '../../stores/package-store';
import { useEditorStore } from '../../stores/editor-store';
import { validateSign } from '../../lib/ada-engine';
import { resolveTokens } from '../../lib/token-resolver';
import { getFamilyDefaults } from '../../lib/families-data';

export function ADAStatus() {
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);
  const signTypes = usePackageStore((s) => s.signTypes);
  const familyId = usePackageStore((s) => s.familyId);
  const globalTokens = usePackageStore((s) => s.designTokens);

  const activeSign = signTypes.find((s) => s.id === activeSignTypeId);

  if (!activeSign || !familyId) {
    return (
      <div className="p-2 text-[10px] text-text-muted">
        Load a family to view ADA status.
      </div>
    );
  }

  let adaResult;
  try {
    const familyDefaults = getFamilyDefaults(familyId);
    const resolved = resolveTokens(familyDefaults, globalTokens, activeSign.tokenOverrides);
    adaResult = validateSign(activeSign, resolved);
  } catch {
    return (
      <div className="p-2 text-[10px] text-text-muted">
        Unable to validate — family not found.
      </div>
    );
  }

  const hasErrors = adaResult.errors.length > 0;
  const hasWarnings = adaResult.warnings.length > 0;

  return (
    <div>
      {/* Status card */}
      {adaResult.valid && !hasWarnings ? (
        <div className="rounded-md border border-success/20 bg-success/10 p-2">
          <span className="text-[11px] font-semibold text-success">
            ADA Compliant
          </span>
        </div>
      ) : hasErrors ? (
        <div className="rounded-md border border-error/20 bg-error/10 p-2">
          <span className="text-[11px] font-semibold text-error">
            ADA Issues
          </span>
        </div>
      ) : (
        <div className="rounded-md border border-warning/20 bg-warning/10 p-2">
          <span className="text-[11px] font-semibold text-warning">
            {adaResult.warnings.length} Warning{adaResult.warnings.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Issue list */}
      {(hasErrors || hasWarnings) && (
        <div className="mt-2 flex flex-col gap-1.5">
          {adaResult.errors.map((issue, i) => (
            <p key={`e-${i}`} className="text-[10px] leading-relaxed text-error">
              {issue.message}
            </p>
          ))}
          {adaResult.warnings.map((issue, i) => (
            <p key={`w-${i}`} className="text-[10px] leading-relaxed text-warning">
              {issue.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
