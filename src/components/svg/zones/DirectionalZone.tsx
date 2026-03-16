import React from 'react';

interface DirectionalRow {
  label: string;
  value: string;
  arrow?: 'left' | 'right' | 'up';
}

interface DirectionalZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: DirectionalRow[];
  textColor: string;
  fontCss: string;
}

/**
 * Directional wayfinding zone — arrow + destination text per row.
 */
export const DirectionalZone: React.FC<DirectionalZoneProps> = React.memo(
  ({ x, y, width: _width, height, rows, textColor, fontCss }) => {
    if (!rows || rows.length === 0) return null;

    const rowH = height / rows.length;
    const arrowSize = Math.min(rowH * 0.35, 12);
    const textSize = Math.min(rowH * 0.4, 14);
    const arrowPad = arrowSize * 2.5;

    return (
      <g>
        {rows.map((row, i) => {
          const rowY = y + i * rowH;
          const midY = rowY + rowH / 2;

          return (
            <g key={i}>
              {/* Arrow */}
              <ArrowIcon
                x={x + arrowSize}
                y={midY}
                size={arrowSize}
                direction={row.arrow || 'right'}
                color={textColor}
              />
              {/* Destination text */}
              <text
                x={x + arrowPad}
                y={midY}
                dominantBaseline="central"
                fill={textColor}
                fontFamily={fontCss}
                fontSize={textSize}
                fontWeight={500}
              >
                {row.label || row.value}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
);

DirectionalZone.displayName = 'DirectionalZone';

/* ── Arrow primitives ─────────────────────────────── */
function ArrowIcon({
  x,
  y,
  size,
  direction,
  color,
}: {
  x: number;
  y: number;
  size: number;
  direction: 'left' | 'right' | 'up';
  color: string;
}) {
  const s = size;

  if (direction === 'right') {
    return (
      <g>
        <line x1={x - s * 0.5} y1={y} x2={x + s * 0.5} y2={y} stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" />
        <polyline points={`${x + s * 0.15},${y - s * 0.4} ${x + s * 0.55},${y} ${x + s * 0.15},${y + s * 0.4}`} fill="none" stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  if (direction === 'left') {
    return (
      <g>
        <line x1={x - s * 0.5} y1={y} x2={x + s * 0.5} y2={y} stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" />
        <polyline points={`${x - s * 0.15},${y - s * 0.4} ${x - s * 0.55},${y} ${x - s * 0.15},${y + s * 0.4}`} fill="none" stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  // up
  return (
    <g>
      <line x1={x} y1={y + s * 0.5} x2={x} y2={y - s * 0.5} stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" />
      <polyline points={`${x - s * 0.4},${y - s * 0.15} ${x},${y - s * 0.55} ${x + s * 0.4},${y - s * 0.15}`} fill="none" stroke={color} strokeWidth={s * 0.15} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
