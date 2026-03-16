import React from 'react';

interface ListingRow {
  label: string;
  value: string;
}

interface ListingZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: ListingRow[];
  textColor: string;
  fontCss: string;
}

/**
 * Directory listing zone — name left-aligned, room number right-aligned,
 * dotted leader line between.
 */
export const ListingZone: React.FC<ListingZoneProps> = React.memo(
  ({ x, y, width, height, rows, textColor, fontCss }) => {
    if (!rows || rows.length === 0) return null;

    const rowH = height / rows.length;
    const textSize = Math.min(rowH * 0.5, 12);
    const padX = width * 0.04;

    return (
      <g>
        {rows.map((row, i) => {
          const rowY = y + i * rowH;
          const midY = rowY + rowH / 2;
          const leftX = x + padX;
          const rightX = x + width - padX;

          // Approximate dotted leader positions
          const labelEndX = leftX + row.label.length * textSize * 0.55;
          const valueStartX = rightX - row.value.length * textSize * 0.55;
          const dotsStartX = Math.min(labelEndX + textSize * 0.5, valueStartX);
          const dotsEndX = Math.max(valueStartX - textSize * 0.5, dotsStartX);

          return (
            <g key={i}>
              {/* Name (left-aligned) */}
              <text
                x={leftX}
                y={midY}
                dominantBaseline="central"
                textAnchor="start"
                fill={textColor}
                fontFamily={fontCss}
                fontSize={textSize}
                fontWeight={500}
              >
                {row.label}
              </text>

              {/* Dotted leader */}
              {dotsEndX > dotsStartX && (
                <line
                  x1={dotsStartX}
                  y1={midY}
                  x2={dotsEndX}
                  y2={midY}
                  stroke={textColor}
                  strokeWidth={0.5}
                  strokeDasharray="1.5 3"
                  opacity={0.35}
                />
              )}

              {/* Room number (right-aligned) */}
              <text
                x={rightX}
                y={midY}
                dominantBaseline="central"
                textAnchor="end"
                fill={textColor}
                fontFamily={fontCss}
                fontSize={textSize}
                fontWeight={600}
              >
                {row.value}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
);

ListingZone.displayName = 'ListingZone';
