import React from 'react';
import { renderPictogram } from '../pictograms/PictogramRenderer';

interface PictogramZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  color: string;
  family: 'geometric' | 'rounded' | 'bold';
}

/**
 * Renders pictogram icons for ADA signage.
 * Dispatches to the correct icon family (geometric, rounded, bold).
 */
export const PictogramZone: React.FC<PictogramZoneProps> = React.memo(
  ({ x, y, width, height, icon, color, family }) => {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const s = Math.min(width, height) * 0.4;

    const iconContent = renderPictogram({ icon, cx, cy, s, color, family });

    return <g>{iconContent}</g>;
  }
);

PictogramZone.displayName = 'PictogramZone';
