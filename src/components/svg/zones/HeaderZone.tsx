import React from 'react';

interface HeaderZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  accentColor: string;
  cornerRadius: number;
}

/**
 * Colored accent header band at the top of a sign.
 * Uses clipPath for top-only rounded corners.
 */
export const HeaderZone: React.FC<HeaderZoneProps> = React.memo(
  ({ x, y, width, height, accentColor, cornerRadius }) => {
    const clipId = `header-clip-${x}-${y}`;

    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height + cornerRadius}
              rx={cornerRadius}
              ry={cornerRadius}
            />
          </clipPath>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={accentColor}
          opacity={0.85}
          clipPath={`url(#${clipId})`}
        />
      </g>
    );
  }
);

HeaderZone.displayName = 'HeaderZone';
