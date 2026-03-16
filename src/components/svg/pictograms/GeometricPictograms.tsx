import React from 'react';

type IconType =
  | 'restroom_unisex'
  | 'restroom_men'
  | 'restroom_women'
  | 'stairwell'
  | 'fire_exit'
  | 'elevator'
  | 'exit';

/* ── Person (standing figure) ─────────────────────── */
function PersonIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.15;
  const bodyTop = cy - s * 0.2;
  const bodyBot = cy + s * 0.15;
  const legBot = cy + s * 0.45;

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx} y1={bodyTop} x2={cx} y2={bodyBot} stroke={color} strokeWidth={s * 0.08} strokeLinecap="round" />
      <line x1={cx - s * 0.2} y1={cy - s * 0.05} x2={cx + s * 0.2} y2={cy - s * 0.05} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <line x1={cx} y1={bodyBot} x2={cx - s * 0.15} y2={legBot} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <line x1={cx} y1={bodyBot} x2={cx + s * 0.15} y2={legBot} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
    </g>
  );
}

/* ── Person with skirt ────────────────────────────── */
function PersonWithSkirtIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.15;
  const bodyTop = cy - s * 0.2;
  const skirtTop = cy + s * 0.05;
  const skirtBot = cy + s * 0.25;
  const legBot = cy + s * 0.45;

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx} y1={bodyTop} x2={cx} y2={skirtTop} stroke={color} strokeWidth={s * 0.08} strokeLinecap="round" />
      <line x1={cx - s * 0.2} y1={cy - s * 0.05} x2={cx + s * 0.2} y2={cy - s * 0.05} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <polygon
        points={`${cx},${skirtTop} ${cx - s * 0.2},${skirtBot} ${cx + s * 0.2},${skirtBot}`}
        fill={color}
      />
      <line x1={cx - s * 0.08} y1={skirtBot} x2={cx - s * 0.12} y2={legBot} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <line x1={cx + s * 0.08} y1={skirtBot} x2={cx + s * 0.12} y2={legBot} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
    </g>
  );
}

/* ── Stairs ────────────────────────────────────────── */
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
      strokeWidth={s * 0.06}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/* ── Fire / Exit running figure ───────────────────── */
function FireExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.12;

  return (
    <g>
      <circle cx={cx + s * 0.05} cy={cy - s * 0.35} r={headR} fill={color} />
      <line x1={cx + s * 0.05} y1={cy - s * 0.22} x2={cx - s * 0.05} y2={cy + s * 0.1} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <line x1={cx - s * 0.05} y1={cy - s * 0.1} x2={cx + s * 0.25} y2={cy - s * 0.18} stroke={color} strokeWidth={s * 0.06} strokeLinecap="round" />
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx + s * 0.2} y2={cy + s * 0.4} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx - s * 0.25} y2={cy + s * 0.35} stroke={color} strokeWidth={s * 0.07} strokeLinecap="round" />
      <rect x={cx + s * 0.3} y={cy - s * 0.4} width={s * 0.15} height={s * 0.8} fill="none" stroke={color} strokeWidth={s * 0.04} />
    </g>
  );
}

/* ── Elevator ─────────────────────────────────────── */
function ElevatorIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const boxW = s * 0.7;
  const boxH = s * 0.8;

  return (
    <g>
      <rect
        x={cx - boxW / 2}
        y={cy - boxH / 2}
        width={boxW}
        height={boxH}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.05}
        rx={2}
      />
      <polygon
        points={`${cx - s * 0.08},${cy - s * 0.05} ${cx},${cy - s * 0.25} ${cx + s * 0.08},${cy - s * 0.05}`}
        fill={color}
      />
      <polygon
        points={`${cx - s * 0.08},${cy + s * 0.05} ${cx},${cy + s * 0.25} ${cx + s * 0.08},${cy + s * 0.05}`}
        fill={color}
      />
    </g>
  );
}

/* ── Exit (arrow + door) ──────────────────────────── */
function ExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  return (
    <g>
      <rect
        x={cx - s * 0.15}
        y={cy - s * 0.35}
        width={s * 0.3}
        height={s * 0.7}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.05}
      />
      <line
        x1={cx + s * 0.2}
        y1={cy}
        x2={cx + s * 0.45}
        y2={cy}
        stroke={color}
        strokeWidth={s * 0.06}
        strokeLinecap="round"
      />
      <polygon
        points={`${cx + s * 0.38},${cy - s * 0.08} ${cx + s * 0.48},${cy} ${cx + s * 0.38},${cy + s * 0.08}`}
        fill={color}
      />
    </g>
  );
}

export function renderGeometricIcon(
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
          <circle cx={cx} cy={cy} r={s * 0.5} fill="none" stroke={color} strokeWidth={2} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={s * 0.6} fontWeight={700}>?</text>
        </g>
      );
  }
}
