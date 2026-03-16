import React from 'react';

interface CodeInfoZoneProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  textColor: string;
  fontCss: string;
}

/**
 * Regulatory / code information text zone.
 * Smaller font, left-aligned, supports newline-delimited multi-line text.
 */
export const CodeInfoZone: React.FC<CodeInfoZoneProps> = React.memo(
  ({ x, y, width, height, text, textColor, fontCss }) => {
    if (!text) return null;

    const lines = text.split('\n').filter(Boolean);
    const textSize = Math.min(height / Math.max(lines.length, 1) * 0.7, 10);
    const lineHeight = textSize * 1.4;
    const padX = width * 0.04;

    // Vertically center the block of lines
    const blockHeight = lines.length * lineHeight;
    const startY = y + (height - blockHeight) / 2 + textSize * 0.5;

    return (
      <g>
        {lines.map((line, i) => (
          <text
            key={i}
            x={x + padX}
            y={startY + i * lineHeight}
            dominantBaseline="central"
            textAnchor="start"
            fill={textColor}
            fontFamily={fontCss}
            fontSize={textSize}
            fontWeight={400}
            opacity={0.7}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }
);

CodeInfoZone.displayName = 'CodeInfoZone';
