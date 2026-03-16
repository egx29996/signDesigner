import React from 'react';

interface PrimaryTextZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  textColor: string;
  fontCss: string;
  fontSize?: number;
}

/**
 * Primary raised text zone — centered, bold, with tactile shadow filter.
 */
export const PrimaryTextZone: React.FC<PrimaryTextZoneProps> = React.memo(
  ({ x, y, width, height, text, textColor, fontCss, fontSize }) => {
    const computedSize = fontSize ?? Math.min(height * 0.5, 36);

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontFamily={fontCss}
        fontSize={computedSize}
        fontWeight={700}
        letterSpacing="0.05em"
        filter="url(#raised-text)"
      >
        {text || ''}
      </text>
    );
  }
);

PrimaryTextZone.displayName = 'PrimaryTextZone';
