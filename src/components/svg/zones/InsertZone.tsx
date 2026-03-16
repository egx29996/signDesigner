import React from 'react';

interface InsertZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
  text: string;
  subtitle?: string;
  fontCss: string;
}

/**
 * Insert panel — contrasting background with primary + optional subtitle text.
 */
export const InsertZone: React.FC<InsertZoneProps> = React.memo(
  ({ x, y, width, height, bgColor, textColor, text, subtitle, fontCss }) => {
    const primarySize = Math.min(height * 0.35, 28);
    const subtitleSize = primarySize * 0.6;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={2}
          ry={2}
          fill={bgColor}
        />
        <text
          x={x + width / 2}
          y={y + height * 0.4}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontFamily={fontCss}
          fontSize={primarySize}
          fontWeight={700}
        >
          {text || ''}
        </text>
        {subtitle && (
          <text
            x={x + width / 2}
            y={y + height * 0.7}
            textAnchor="middle"
            dominantBaseline="central"
            fill={textColor}
            fontFamily={fontCss}
            fontSize={subtitleSize}
            fontWeight={400}
            opacity={0.7}
          >
            {subtitle}
          </text>
        )}
      </g>
    );
  }
);

InsertZone.displayName = 'InsertZone';
