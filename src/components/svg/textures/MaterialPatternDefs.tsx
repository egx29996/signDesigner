import React from 'react';

/**
 * Seeded PRNG — deterministic random for SVG patterns.
 * Avoids Math.random() which causes hydration mismatches and re-render flicker.
 */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Wood grain pattern ─────────────────────────────────── */
function WoodPattern({
  id,
  color1,
  color2,
  color3,
  seed,
  lineSpacing,
  variation,
}: {
  id: string;
  color1: string;
  color2: string;
  color3: string;
  seed: number;
  lineSpacing: number;
  variation: number;
}) {
  const rng = seededRandom(seed);
  const lines: React.ReactElement[] = [];
  const patternH = 120;
  const patternW = 200;

  for (let y = 0; y < patternH; y += lineSpacing) {
    const offset = (rng() - 0.5) * variation;
    const thickness = 0.5 + rng() * 1.2;
    const color = rng() > 0.5 ? color2 : color3;
    lines.push(
      <line
        key={`${id}-line-${y}`}
        x1={0}
        y1={y + offset}
        x2={patternW}
        y2={y + offset + (rng() - 0.5) * 2}
        stroke={color}
        strokeWidth={thickness}
        opacity={0.4 + rng() * 0.3}
      />
    );
  }

  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={patternW} height={patternH}>
      <rect width={patternW} height={patternH} fill={color1} />
      {lines}
    </pattern>
  );
}

/* ── Metal brushed pattern ──────────────────────────────── */
function MetalPattern({
  id,
  color1,
  color2,
  color3,
  seed,
}: {
  id: string;
  color1: string;
  color2: string;
  color3: string;
  seed: number;
}) {
  const rng = seededRandom(seed);
  const lines: React.ReactElement[] = [];
  const patternW = 200;
  const patternH = 60;

  for (let y = 0; y < patternH; y += 1.5) {
    const color = rng() > 0.5 ? color2 : color3;
    lines.push(
      <line
        key={`${id}-hl-${y}`}
        x1={0}
        y1={y + (rng() - 0.5) * 0.3}
        x2={patternW}
        y2={y + (rng() - 0.5) * 0.3}
        stroke={color}
        strokeWidth={0.3 + rng() * 0.4}
        opacity={0.15 + rng() * 0.2}
      />
    );
  }

  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={patternW} height={patternH}>
      <rect width={patternW} height={patternH} fill={color1} />
      {lines}
    </pattern>
  );
}

/* ── Stone pattern ──────────────────────────────────────── */
function StonePattern({
  id,
  color1,
  color2,
  color3,
  seed,
}: {
  id: string;
  color1: string;
  color2: string;
  color3: string;
  seed: number;
}) {
  const rng = seededRandom(seed);
  const elements: React.ReactElement[] = [];
  const patternW = 150;
  const patternH = 150;

  // Random dots
  for (let i = 0; i < 80; i++) {
    const cx = rng() * patternW;
    const cy = rng() * patternH;
    const r = 0.4 + rng() * 1.2;
    const color = rng() > 0.5 ? color2 : color3;
    elements.push(
      <circle
        key={`${id}-dot-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        opacity={0.15 + rng() * 0.2}
      />
    );
  }

  // Faint lines (veining)
  for (let i = 0; i < 6; i++) {
    const x1 = rng() * patternW;
    const y1 = rng() * patternH;
    const x2 = x1 + (rng() - 0.5) * 80;
    const y2 = y1 + (rng() - 0.5) * 40;
    elements.push(
      <line
        key={`${id}-vein-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color3}
        strokeWidth={0.5}
        opacity={0.1 + rng() * 0.1}
      />
    );
  }

  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width={patternW} height={patternH}>
      <rect width={patternW} height={patternH} fill={color1} />
      {elements}
    </pattern>
  );
}

/* ── Main component ─────────────────────────────────────── */
export const MaterialPatternDefs: React.FC = React.memo(() => {
  return (
    <defs>
      {/* Material texture patterns */}
      <WoodPattern
        id="mat-walnut"
        color1="#3E2723"
        color2="#5D4037"
        color3="#4E342E"
        seed={42}
        lineSpacing={3}
        variation={4}
      />
      <WoodPattern
        id="mat-oak"
        color1="#C4A882"
        color2="#D4B896"
        color3="#B89B72"
        seed={137}
        lineSpacing={4}
        variation={5}
      />
      <WoodPattern
        id="mat-maple"
        color1="#E8D5B7"
        color2="#F0E0C8"
        color3="#DCC9A6"
        seed={271}
        lineSpacing={5}
        variation={3}
      />
      <MetalPattern
        id="mat-brushed_alum"
        color1="#B8BEC4"
        color2="#CDD3D9"
        color3="#A8AEB4"
        seed={503}
      />
      <MetalPattern
        id="mat-brass"
        color1="#C5A55A"
        color2="#D4B76A"
        color3="#B6944A"
        seed={619}
      />
      <StonePattern
        id="mat-slate"
        color1="#6B7B8D"
        color2="#7D8D9F"
        color3="#5A6A7C"
        seed={743}
      />

      {/* Filter: drop shadow for sign panel */}
      <filter id="sign-shadow" x="-5%" y="-5%" width="115%" height="115%">
        <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
      </filter>

      {/* Filter: subtle shadow for raised/tactile text */}
      <filter id="raised-text" x="-2%" y="-2%" width="104%" height="104%">
        <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.4" floodColor="#000000" floodOpacity="0.35" />
      </filter>
    </defs>
  );
});

MaterialPatternDefs.displayName = 'MaterialPatternDefs';
