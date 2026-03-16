import React from 'react';
import { renderGeometricIcon } from './GeometricPictograms';
import { renderRoundedIcon } from './RoundedPictograms';
import { renderBoldIcon } from './BoldPictograms';

export interface PictogramRendererProps {
  icon: string;
  cx: number;
  cy: number;
  s: number;
  color: string;
  family: 'geometric' | 'rounded' | 'bold';
}

export function renderPictogram({
  icon,
  cx,
  cy,
  s,
  color,
  family,
}: PictogramRendererProps): React.ReactElement {
  switch (family) {
    case 'rounded':
      return renderRoundedIcon(icon, cx, cy, s, color);
    case 'bold':
      return renderBoldIcon(icon, cx, cy, s, color);
    case 'geometric':
    default:
      return renderGeometricIcon(icon, cx, cy, s, color);
  }
}
