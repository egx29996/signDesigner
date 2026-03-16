import React from 'react';

interface DividerZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style: 'accent_bar' | 'thin_line' | 'none';
  color: string;
}

/**
 * Decorative divider between sign zones.
 */
export const DividerZone: React.FC<DividerZoneProps> = React.memo(
  ({ x, y, width, height, style, color }) => {
    if (style === 'none') return null;

    if (style === 'accent_bar') {
      const padX = width * 0.08;
      const barH = Math.min(height * 0.5, 4);
      return (
        <rect
          x={x + padX}
          y={y + (height - barH) / 2}
          width={width - padX * 2}
          height={barH}
          rx={barH / 2}
          ry={barH / 2}
          fill={color}
          opacity={0.9}
        />
      );
    }

    // thin_line
    const lineY = y + height / 2;
    const padX = width * 0.1;
    return (
      <line
        x1={x + padX}
        y1={lineY}
        x2={x + width - padX}
        y2={lineY}
        stroke={color}
        strokeWidth={1}
        opacity={0.4}
      />
    );
  }
);

DividerZone.displayName = 'DividerZone';
