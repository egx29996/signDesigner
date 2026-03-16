import React from 'react';

interface AvailabilityZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  state: 'available' | 'in_use';
  fontCss: string;
}

/**
 * Availability indicator — green "AVAILABLE" or red "IN USE".
 */
export const AvailabilityZone: React.FC<AvailabilityZoneProps> = React.memo(
  ({ x, y, width, height, state, fontCss }) => {
    const isAvailable = state === 'available';
    const bgColor = isAvailable ? '#22c55e' : '#ef4444';
    const label = isAvailable ? 'AVAILABLE' : 'IN USE';
    const textSize = Math.min(height * 0.45, 14);

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={3}
          ry={3}
          fill={bgColor}
          opacity={0.9}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontFamily={fontCss}
          fontSize={textSize}
          fontWeight={700}
          letterSpacing="0.08em"
        >
          {label}
        </text>
      </g>
    );
  }
);

AvailabilityZone.displayName = 'AvailabilityZone';
