import React from 'react';

/**
 * Rounded pictogram family — softer, more approachable icons.
 * Thicker strokes (1.3x geometric), round caps/joins, larger heads.
 */

type IconType =
  | 'restroom_unisex'
  | 'restroom_men'
  | 'restroom_women'
  | 'stairwell'
  | 'fire_exit'
  | 'elevator'
  | 'exit';

const CAP = 'round' as const;
const JOIN = 'round' as const;

/* ── Person (standing figure) — rounded ───────────── */
function PersonIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.18; // larger head
  const sw = s * 0.104; // 1.3x geometric body stroke
  const armSw = s * 0.091; // 1.3x geometric arm/leg stroke
  const bodyTop = cy - s * 0.18;
  const bodyBot = cy + s * 0.15;
  const legBot = cy + s * 0.45;

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx} y1={bodyTop} x2={cx} y2={bodyBot} stroke={color} strokeWidth={sw} strokeLinecap={CAP} />
      <line x1={cx - s * 0.2} y1={cy - s * 0.03} x2={cx + s * 0.2} y2={cy - s * 0.03} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
      <line x1={cx} y1={bodyBot} x2={cx - s * 0.15} y2={legBot} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
      <line x1={cx} y1={bodyBot} x2={cx + s * 0.15} y2={legBot} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
    </g>
  );
}

/* ── Person with skirt — rounded ──────────────────── */
function PersonWithSkirtIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.18;
  const sw = s * 0.104;
  const armSw = s * 0.091;
  const bodyTop = cy - s * 0.18;
  const skirtTop = cy + s * 0.05;
  const skirtBot = cy + s * 0.25;
  const legBot = cy + s * 0.45;

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx} y1={bodyTop} x2={cx} y2={skirtTop} stroke={color} strokeWidth={sw} strokeLinecap={CAP} />
      <line x1={cx - s * 0.2} y1={cy - s * 0.03} x2={cx + s * 0.2} y2={cy - s * 0.03} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
      {/* Rounded skirt — trapezoid with rounded corners */}
      <path
        d={`M ${cx - s * 0.05} ${skirtTop} Q ${cx - s * 0.22} ${skirtBot} ${cx - s * 0.2} ${skirtBot} L ${cx + s * 0.2} ${skirtBot} Q ${cx + s * 0.22} ${skirtBot} ${cx + s * 0.05} ${skirtTop} Z`}
        fill={color}
      />
      <line x1={cx - s * 0.08} y1={skirtBot} x2={cx - s * 0.12} y2={legBot} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
      <line x1={cx + s * 0.08} y1={skirtBot} x2={cx + s * 0.12} y2={legBot} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
    </g>
  );
}

/* ── Stairs — rounded ─────────────────────────────── */
function StairsIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const steps = 4;
  const stepW = (s * 0.8) / steps;
  const stepH = (s * 0.6) / steps;
  const startX = cx - s * 0.4;
  const startY = cy + s * 0.3;

  const pathParts: string[] = [`M ${startX} ${startY}`];
  for (let i = 0; i < steps; i++) {
    const sx = startX + i * stepW;
    const sy = startY - i * stepH;
    pathParts.push(`L ${sx} ${sy - stepH}`);
    pathParts.push(`L ${sx + stepW} ${sy - stepH}`);
  }

  return (
    <path
      d={pathParts.join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={s * 0.078} // 1.3x
      strokeLinecap={CAP}
      strokeLinejoin={JOIN}
    />
  );
}

/* ── Fire / Exit running figure — rounded ─────────── */
function FireExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.15; // larger
  const sw = s * 0.091;
  const armSw = s * 0.078;

  return (
    <g>
      <circle cx={cx + s * 0.05} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx + s * 0.05} y1={cy - s * 0.2} x2={cx - s * 0.05} y2={cy + s * 0.1} stroke={color} strokeWidth={sw} strokeLinecap={CAP} />
      <line x1={cx - s * 0.05} y1={cy - s * 0.08} x2={cx + s * 0.25} y2={cy - s * 0.16} stroke={color} strokeWidth={armSw} strokeLinecap={CAP} />
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx + s * 0.2} y2={cy + s * 0.4} stroke={color} strokeWidth={sw} strokeLinecap={CAP} />
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx - s * 0.25} y2={cy + s * 0.35} stroke={color} strokeWidth={sw} strokeLinecap={CAP} />
      <rect
        x={cx + s * 0.3} y={cy - s * 0.4} width={s * 0.15} height={s * 0.8}
        fill="none" stroke={color} strokeWidth={s * 0.052} rx={s * 0.04}
        strokeLinejoin={JOIN}
      />
    </g>
  );
}

/* ── Elevator — rounded ──────────────────────────── */
function ElevatorIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const boxW = s * 0.7;
  const boxH = s * 0.8;

  return (
    <g>
      <rect
        x={cx - boxW / 2} y={cy - boxH / 2} width={boxW} height={boxH}
        fill="none" stroke={color} strokeWidth={s * 0.065} rx={s * 0.08}
        strokeLinejoin={JOIN}
      />
      <polygon
        points={`${cx - s * 0.08},${cy - s * 0.05} ${cx},${cy - s * 0.25} ${cx + s * 0.08},${cy - s * 0.05}`}
        fill={color} strokeLinejoin={JOIN}
      />
      <polygon
        points={`${cx - s * 0.08},${cy + s * 0.05} ${cx},${cy + s * 0.25} ${cx + s * 0.08},${cy + s * 0.05}`}
        fill={color} strokeLinejoin={JOIN}
      />
    </g>
  );
}

/* ── Exit (arrow + door) — rounded ────────────────── */
function ExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  return (
    <g>
      <rect
        x={cx - s * 0.15} y={cy - s * 0.35} width={s * 0.3} height={s * 0.7}
        fill="none" stroke={color} strokeWidth={s * 0.065} rx={s * 0.04}
        strokeLinejoin={JOIN}
      />
      <line
        x1={cx + s * 0.2} y1={cy} x2={cx + s * 0.45} y2={cy}
        stroke={color} strokeWidth={s * 0.078} strokeLinecap={CAP}
      />
      <polygon
        points={`${cx + s * 0.38},${cy - s * 0.08} ${cx + s * 0.48},${cy} ${cx + s * 0.38},${cy + s * 0.08}`}
        fill={color} strokeLinejoin={JOIN}
      />
    </g>
  );
}

export function renderRoundedIcon(
  icon: string,
  cx: number,
  cy: number,
  s: number,
  color: string,
): React.ReactElement {
  switch (icon as IconType) {
    case 'restroom_men':
      return <PersonIcon cx={cx} cy={cy} s={s} color={color} />;
    case 'restroom_women':
      return <PersonWithSkirtIcon cx={cx} cy={cy} s={s} color={color} />;
    case 'restroom_unisex':
      return (
        <g>
          <PersonIcon cx={cx - s * 0.4} cy={cy} s={s * 0.8} color={color} />
          <PersonWithSkirtIcon cx={cx + s * 0.4} cy={cy} s={s * 0.8} color={color} />
        </g>
      );
    case 'stairwell':
      return <StairsIcon cx={cx} cy={cy} s={s} color={color} />;
    case 'fire_exit':
      return <FireExitIcon cx={cx} cy={cy} s={s} color={color} />;
    case 'elevator':
      return <ElevatorIcon cx={cx} cy={cy} s={s} color={color} />;
    case 'exit':
      return <ExitIcon cx={cx} cy={cy} s={s} color={color} />;
    default:
      return (
        <g>
          <circle cx={cx} cy={cy} r={s * 0.5} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap={CAP} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={s * 0.6} fontWeight={700}>?</text>
        </g>
      );
  }
}
