import React from 'react';

/**
 * Bold pictogram family — heavy, high-contrast icons.
 * Solid fills, thick strokes (1.8x geometric), blocky proportions.
 */

type IconType =
  | 'restroom_unisex'
  | 'restroom_men'
  | 'restroom_women'
  | 'stairwell'
  | 'fire_exit'
  | 'elevator'
  | 'exit';

/* ── Person (standing figure) — bold ──────────────── */
function PersonIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.17;
  const torsoW = s * 0.18;
  const torsoH = s * 0.3;
  const torsoTop = cy - s * 0.16;
  const legW = s * 0.1;
  const legH = s * 0.28;
  const legTop = torsoTop + torsoH;
  const armSw = s * 0.126; // 1.8x geometric

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      {/* Solid torso rectangle */}
      <rect x={cx - torsoW / 2} y={torsoTop} width={torsoW} height={torsoH} fill={color} rx={s * 0.02} />
      {/* Thick arms */}
      <line x1={cx - s * 0.22} y1={cy - s * 0.03} x2={cx + s * 0.22} y2={cy - s * 0.03} stroke={color} strokeWidth={armSw} strokeLinecap="butt" />
      {/* Thick solid legs */}
      <rect x={cx - s * 0.14} y={legTop} width={legW} height={legH} fill={color} rx={s * 0.02} />
      <rect x={cx + s * 0.04} y={legTop} width={legW} height={legH} fill={color} rx={s * 0.02} />
    </g>
  );
}

/* ── Person with skirt — bold ─────────────────────── */
function PersonWithSkirtIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.17;
  const torsoW = s * 0.18;
  const torsoTop = cy - s * 0.16;
  const torsoBot = cy + s * 0.05;
  const skirtBot = cy + s * 0.28;
  const legW = s * 0.1;
  const legH = s * 0.17;
  const legTop = skirtBot;
  const armSw = s * 0.126;

  return (
    <g>
      <circle cx={cx} cy={cy - s * 0.35} r={headR} fill={color} />
      {/* Solid torso */}
      <rect x={cx - torsoW / 2} y={torsoTop} width={torsoW} height={torsoBot - torsoTop} fill={color} rx={s * 0.02} />
      {/* Thick arms */}
      <line x1={cx - s * 0.22} y1={cy - s * 0.03} x2={cx + s * 0.22} y2={cy - s * 0.03} stroke={color} strokeWidth={armSw} strokeLinecap="butt" />
      {/* Bold skirt — wide trapezoid */}
      <polygon
        points={`${cx - s * 0.1},${torsoBot} ${cx - s * 0.24},${skirtBot} ${cx + s * 0.24},${skirtBot} ${cx + s * 0.1},${torsoBot}`}
        fill={color}
      />
      {/* Thick solid legs */}
      <rect x={cx - s * 0.14} y={legTop} width={legW} height={legH} fill={color} rx={s * 0.02} />
      <rect x={cx + s * 0.04} y={legTop} width={legW} height={legH} fill={color} rx={s * 0.02} />
    </g>
  );
}

/* ── Stairs — bold ────────────────────────────────── */
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
      strokeWidth={s * 0.108} // 1.8x
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  );
}

/* ── Fire / Exit running figure — bold ────────────── */
function FireExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const headR = s * 0.14;
  const sw = s * 0.126;
  const armSw = s * 0.108;

  return (
    <g>
      <circle cx={cx + s * 0.05} cy={cy - s * 0.35} r={headR} fill={color} />
      {/* Bold body */}
      <line x1={cx + s * 0.05} y1={cy - s * 0.2} x2={cx - s * 0.05} y2={cy + s * 0.1} stroke={color} strokeWidth={sw} strokeLinecap="butt" />
      {/* Bold arms */}
      <line x1={cx - s * 0.05} y1={cy - s * 0.08} x2={cx + s * 0.25} y2={cy - s * 0.16} stroke={color} strokeWidth={armSw} strokeLinecap="butt" />
      {/* Bold legs */}
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx + s * 0.2} y2={cy + s * 0.4} stroke={color} strokeWidth={sw} strokeLinecap="butt" />
      <line x1={cx - s * 0.05} y1={cy + s * 0.1} x2={cx - s * 0.25} y2={cy + s * 0.35} stroke={color} strokeWidth={sw} strokeLinecap="butt" />
      {/* Heavy door frame */}
      <rect x={cx + s * 0.3} y={cy - s * 0.4} width={s * 0.18} height={s * 0.8} fill="none" stroke={color} strokeWidth={s * 0.072} />
    </g>
  );
}

/* ── Elevator — bold ──────────────────────────────── */
function ElevatorIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  const boxW = s * 0.75;
  const boxH = s * 0.85;

  return (
    <g>
      <rect
        x={cx - boxW / 2} y={cy - boxH / 2} width={boxW} height={boxH}
        fill="none" stroke={color} strokeWidth={s * 0.09} rx={2}
      />
      {/* Larger arrows */}
      <polygon
        points={`${cx - s * 0.1},${cy - s * 0.05} ${cx},${cy - s * 0.28} ${cx + s * 0.1},${cy - s * 0.05}`}
        fill={color}
      />
      <polygon
        points={`${cx - s * 0.1},${cy + s * 0.05} ${cx},${cy + s * 0.28} ${cx + s * 0.1},${cy + s * 0.05}`}
        fill={color}
      />
    </g>
  );
}

/* ── Exit (arrow + door) — bold ───────────────────── */
function ExitIcon({ cx, cy, s, color }: { cx: number; cy: number; s: number; color: string }) {
  return (
    <g>
      <rect
        x={cx - s * 0.15} y={cy - s * 0.35} width={s * 0.3} height={s * 0.7}
        fill="none" stroke={color} strokeWidth={s * 0.09}
      />
      {/* Bold arrow */}
      <line
        x1={cx + s * 0.2} y1={cy} x2={cx + s * 0.45} y2={cy}
        stroke={color} strokeWidth={s * 0.108} strokeLinecap="butt"
      />
      <polygon
        points={`${cx + s * 0.36},${cy - s * 0.1} ${cx + s * 0.5},${cy} ${cx + s * 0.36},${cy + s * 0.1}`}
        fill={color}
      />
    </g>
  );
}

export function renderBoldIcon(
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
          <circle cx={cx} cy={cy} r={s * 0.5} fill="none" stroke={color} strokeWidth={3.6} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={s * 0.6} fontWeight={900}>?</text>
        </g>
      );
  }
}
