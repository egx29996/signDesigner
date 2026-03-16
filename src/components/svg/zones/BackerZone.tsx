import React from 'react';

interface BackerZoneProps {
  width: number;
  height: number;
  cornerRadius: number;
  constructionType: 'single_piece' | 'two_piece' | 'three_piece';
}

/**
 * Backer panel rendered behind the main sign face.
 * Only visible for two_piece or three_piece construction.
 * Rendered slightly larger than the sign with a gray offset.
 */
export const BackerZone: React.FC<BackerZoneProps> = React.memo(
  ({ width, height, cornerRadius, constructionType }) => {
    if (constructionType === 'single_piece') return null;

    const offset = 3;

    return (
      <rect
        x={-offset}
        y={-offset}
        width={width + offset * 2}
        height={height + offset * 2}
        rx={cornerRadius + 1}
        ry={cornerRadius + 1}
        fill="#9ca3af"
        opacity={0.2}
      />
    );
  }
);

BackerZone.displayName = 'BackerZone';
