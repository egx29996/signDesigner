import React from 'react';
import { textToBrailleCells, DOT_POSITIONS } from '../../../lib/braille';

interface BrailleZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  dotColor: string;
}

/**
 * Renders Grade 1 braille as SVG circles.
 * Each cell contains up to 6 dots arranged in a 2x3 grid:
 *   col0  col1
 *   d1    d4    row 0
 *   d2    d5    row 1
 *   d3    d6    row 2
 */
export const BrailleZone: React.FC<BrailleZoneProps> = React.memo(
  ({ x, y, width, height, text, dotColor }) => {
    if (!text) return null;

    const cells = textToBrailleCells(text);
    const dotRadius = 1.2;
    const dotSpacing = 3; // spacing between dots within a cell
    const cellWidth = 7; // spacing between cell origins

    // Cell dimensions: 2 cols * dotSpacing wide, 3 rows * dotSpacing tall
    const totalCellsWidth = cells.length * cellWidth;
    const cellHeight = 2 * dotSpacing; // 3 rows = 2 gaps

    // Center horizontally and vertically within the zone
    const startX = x + (width - totalCellsWidth) / 2;
    const startY = y + (height - cellHeight) / 2;

    const dots: React.ReactElement[] = [];

    cells.forEach((activeDots, cellIdx) => {
      for (const dotNum of activeDots) {
        const pos = DOT_POSITIONS[dotNum];
        if (!pos) continue;
        const [col, row] = pos;
        const cx = startX + cellIdx * cellWidth + col * dotSpacing;
        const cy = startY + row * dotSpacing;
        dots.push(
          <circle
            key={`b-${cellIdx}-${dotNum}`}
            cx={cx}
            cy={cy}
            r={dotRadius}
            fill={dotColor}
          />
        );
      }
    });

    return <g>{dots}</g>;
  }
);

BrailleZone.displayName = 'BrailleZone';
