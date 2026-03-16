import type { DesignTokens } from '../types';

/**
 * Merge token layers: family defaults → global overrides → per-sign overrides.
 * Later layers win. Returns a complete DesignTokens object.
 */
export function resolveTokens(
  familyDefaults: DesignTokens,
  globalOverrides: DesignTokens,
  signOverrides: Partial<DesignTokens>,
): DesignTokens {
  return { ...familyDefaults, ...globalOverrides, ...signOverrides };
}

/**
 * Resolve a single style binding name (e.g. 'raisedTextColor') into its
 * concrete value from the resolved tokens. Falls back to the raw binding
 * string if the token key doesn't exist — so literal CSS values still work.
 */
export function resolveStyleBinding(
  binding: string,
  resolvedTokens: DesignTokens,
): string {
  const value = (resolvedTokens as unknown as Record<string, unknown>)[binding];
  return typeof value === 'string' ? value : binding;
}
