import type { ZoneState, ZoneType } from '../types';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ZoneLayout {
  zoneId: string;
  zoneType: ZoneType;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Height allocation rules
// ---------------------------------------------------------------------------

type HeightRule =
  | { kind: 'fixed'; px: number }
  | { kind: 'percent'; pct: number }
  | { kind: 'flexible'; minPct: number; maxPct: number };

function getHeightRule(zoneType: ZoneType): HeightRule {
  switch (zoneType) {
    case 'header':
      return { kind: 'percent', pct: 0.12 };
    case 'braille':
      return { kind: 'fixed', px: 14 };
    case 'divider':
      return { kind: 'fixed', px: 6 };
    case 'availability':
      return { kind: 'percent', pct: 0.08 };
    case 'primary_text':
      return { kind: 'flexible', minPct: 0.15, maxPct: 0.40 };
    case 'pictogram':
      return { kind: 'flexible', minPct: 0.40, maxPct: 0.60 };
    case 'insert':
      return { kind: 'percent', pct: 0.20 };
    case 'secondary_text':
      return { kind: 'percent', pct: 0.12 };
    case 'listing':
      return { kind: 'flexible', minPct: 0.30, maxPct: 0.80 };
    case 'directional':
      return { kind: 'flexible', minPct: 0.30, maxPct: 0.80 };
    case 'code_info':
      return { kind: 'percent', pct: 0.15 };
    case 'backer':
      // Backer is rendered behind everything — full sign dimensions
      return { kind: 'percent', pct: 1 };
    default:
      return { kind: 'percent', pct: 0.10 };
  }
}

// ---------------------------------------------------------------------------
// Layout engine
// ---------------------------------------------------------------------------

/**
 * Calculate zone positions within a sign.
 *
 * @param signW     Sign width in inches
 * @param signH     Sign height in inches
 * @param zones     All zones (visible + hidden)
 * @param pxPerInch Pixels per inch for rendering (default 25)
 * @returns         Array of ZoneLayout objects for visible zones only
 */
export function calculateLayout(
  signW: number,
  signH: number,
  zones: ZoneState[],
  pxPerInch: number = 25,
): ZoneLayout[] {
  const totalW = signW * pxPerInch;
  const totalH = signH * pxPerInch;
  const padding = totalW * 0.06;
  const contentW = totalW - 2 * padding;

  // Filter to visible zones (excluding backer), sorted by order
  const backerZone = zones.find((z) => z.zoneType === 'backer' && z.visible);
  const visibleZones = zones
    .filter((z) => z.visible && z.zoneType !== 'backer')
    .sort((a, b) => a.order - b.order);

  const layouts: ZoneLayout[] = [];

  // If backer exists, it goes first at full size
  if (backerZone) {
    layouts.push({
      zoneId: backerZone.id,
      zoneType: 'backer',
      x: 0,
      y: 0,
      width: totalW,
      height: totalH,
    });
  }

  // ---- Phase 1: calculate fixed + percent heights, identify flexible zones ----

  interface ZoneAlloc {
    zone: ZoneState;
    rule: HeightRule;
    height: number; // resolved px
  }

  const allocs: ZoneAlloc[] = visibleZones.map((zone) => ({
    zone,
    rule: getHeightRule(zone.zoneType),
    height: 0,
  }));

  let usedHeight = 0;
  const flexAllocs: ZoneAlloc[] = [];

  for (const alloc of allocs) {
    const { rule } = alloc;
    if (rule.kind === 'fixed') {
      alloc.height = rule.px;
      usedHeight += rule.px;
    } else if (rule.kind === 'percent') {
      alloc.height = totalH * rule.pct;
      usedHeight += alloc.height;
    } else {
      // flexible — defer
      flexAllocs.push(alloc);
    }
  }

  // ---- Phase 2: distribute remaining space to flexible zones ----

  const remaining = Math.max(0, totalH - usedHeight);

  if (flexAllocs.length > 0) {
    // Weight each flex zone by its minPct
    const totalWeight = flexAllocs.reduce(
      (sum, a) => sum + (a.rule as { minPct: number }).minPct,
      0,
    );

    for (const alloc of flexAllocs) {
      const rule = alloc.rule as { minPct: number; maxPct: number };
      const share =
        totalWeight > 0
          ? (rule.minPct / totalWeight) * remaining
          : remaining / flexAllocs.length;

      // Clamp between min and max
      const minH = totalH * rule.minPct;
      const maxH = totalH * rule.maxPct;
      alloc.height = Math.max(minH, Math.min(maxH, share));
    }
  }

  // ---- Phase 3: position zones vertically ----

  let currentY = 0;
  for (const alloc of allocs) {
    layouts.push({
      zoneId: alloc.zone.id,
      zoneType: alloc.zone.zoneType,
      x: padding,
      y: currentY,
      width: contentW,
      height: alloc.height,
    });
    currentY += alloc.height;
  }

  return layouts;
}
