import type { SignTypeState, DesignTokens, ADAResult, ADAIssue } from '../types';

// ---------------------------------------------------------------------------
// WCAG luminance / contrast helpers
// ---------------------------------------------------------------------------

/**
 * Convert a hex color string to relative luminance per WCAG 2.1.
 */
export function hexToLuminance(hex: string): number {
  const clean = hex.replace(/^#/, '');
  const full =
    clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean;
  const num = parseInt(full, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1 contrast ratio between two hex colors. Result is between 1 and 21.
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const l1 = hexToLuminance(hex1);
  const l2 = hexToLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// ADA sign validation
// ---------------------------------------------------------------------------

/**
 * Run ADA compliance checks on a sign type with its resolved design tokens.
 *
 * Checks performed:
 *  1. Tactile character height — must be 5/8" min, 2" max
 *  2. Pictogram field height — 6" minimum when pictogram zone is present
 *  3. Contrast ratio between face and raised text
 *  4. Braille zone must be visible when present
 */
export function validateSign(
  signType: SignTypeState,
  resolvedTokens: DesignTokens,
): ADAResult {
  const errors: ADAIssue[] = [];
  const warnings: ADAIssue[] = [];
  const { h: signH } = signType.size;

  const visibleZones = signType.zones.filter((z) => z.visible);

  // ---------- 1. Tactile character height estimate ----------
  // Rough estimate: available text height = signH / visible zone count
  // This is simplified — real production checks use actual rendered glyph size.
  const textZones = visibleZones.filter(
    (z) => z.zoneType === 'primary_text' || z.zoneType === 'secondary_text',
  );
  if (textZones.length > 0) {
    const estimatedCharHeight = signH / Math.max(visibleZones.length, 1);
    if (estimatedCharHeight < 0.625) {
      errors.push({
        severity: 'error',
        code: 'ADA-CHAR-MIN',
        message: `Estimated character height (${estimatedCharHeight.toFixed(2)}") is below the 5/8" ADA minimum. Increase sign height or reduce zone count.`,
        signTypeId: signType.id,
        suggestion: 'Increase sign height or remove optional zones.',
      });
    }
    if (estimatedCharHeight > 2) {
      warnings.push({
        severity: 'warning',
        code: 'ADA-CHAR-MAX',
        message: `Estimated character height (${estimatedCharHeight.toFixed(2)}") exceeds the 2" ADA maximum for tactile characters. Text may need to be non-tactile at this size.`,
        signTypeId: signType.id,
        suggestion: 'Consider reducing sign height or adding more zones.',
      });
    }
  }

  // ---------- 2. Pictogram field height ----------
  const pictogramZone = visibleZones.find((z) => z.zoneType === 'pictogram');
  if (pictogramZone) {
    // Pictogram gets roughly proportional share; for proper check we use 40% minimum allocation
    const pictoHeight = signH * 0.4;
    if (pictoHeight < 6) {
      errors.push({
        severity: 'error',
        code: 'ADA-PICTO-FIELD',
        message: `Pictogram field height (~${pictoHeight.toFixed(1)}") is below the 6" ADA minimum. Sign must be at least 15" tall for a compliant pictogram field.`,
        signTypeId: signType.id,
        zoneId: pictogramZone.id,
        suggestion: `Increase sign height to at least ${Math.ceil(6 / 0.4)}" or remove pictogram.`,
      });
    }
  }

  // ---------- 3. Contrast ratio ----------
  const ratio = calculateContrastRatio(resolvedTokens.faceColor, resolvedTokens.raisedTextColor);
  if (ratio < 3) {
    errors.push({
      severity: 'error',
      code: 'ADA-CONTRAST-FAIL',
      message: `Contrast ratio between face (${resolvedTokens.faceColor}) and text (${resolvedTokens.raisedTextColor}) is ${ratio.toFixed(1)}:1 — below the 3:1 minimum.`,
      signTypeId: signType.id,
      suggestion: 'Choose colors with more contrast between face and text.',
    });
  } else if (ratio < 4.5) {
    warnings.push({
      severity: 'warning',
      code: 'ADA-CONTRAST-LOW',
      message: `Contrast ratio ${ratio.toFixed(1)}:1 meets the 3:1 minimum but is below the recommended 4.5:1 for optimal readability.`,
      signTypeId: signType.id,
      suggestion: 'Consider increasing contrast for better visibility.',
    });
  }

  // ---------- 4. Braille zone visibility ----------
  const brailleZone = signType.zones.find((z) => z.zoneType === 'braille');
  if (brailleZone && !brailleZone.visible) {
    errors.push({
      severity: 'error',
      code: 'ADA-BRAILLE-HIDDEN',
      message: 'Braille zone exists but is hidden. ADA requires Grade 2 braille on compliant signs.',
      signTypeId: signType.id,
      zoneId: brailleZone.id,
      suggestion: 'Make the braille zone visible or remove it entirely if the sign is non-ADA.',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
