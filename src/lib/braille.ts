// ---------------------------------------------------------------------------
// Braille data & logic — Grade 1 with number indicators
// ---------------------------------------------------------------------------

/**
 * Standard 6-dot braille cell layout:
 *
 *   1 ● ● 4
 *   2 ● ● 5
 *   3 ● ● 6
 *
 * Each character maps to an array of active dot numbers (1-6).
 */

export const BRAILLE_MAP: Record<string, number[]> = {
  // Letters a-z
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],

  // Digits use letter patterns (a=1, b=2, ... j=0) preceded by number indicator
  '1': [1],
  '2': [1, 2],
  '3': [1, 4],
  '4': [1, 4, 5],
  '5': [1, 5],
  '6': [1, 2, 4],
  '7': [1, 2, 4, 5],
  '8': [1, 2, 5],
  '9': [2, 4],
  '0': [2, 4, 5],

  // Number indicator (dots 3-4-5-6)
  '#': [3, 4, 5, 6],

  // Space — empty cell
  ' ': [],
};

/**
 * Dot position mapping. Each dot number (1-6) maps to its [col, row]
 * within a braille cell grid:
 *
 *   col 0  col 1
 *    dot1   dot4   row 0
 *    dot2   dot5   row 1
 *    dot3   dot6   row 2
 */
export const DOT_POSITIONS: Record<number, [col: number, row: number]> = {
  1: [0, 0],
  2: [0, 1],
  3: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
};

/**
 * Convert a text string to an array of braille cells (each cell is an
 * array of active dot numbers). Handles:
 *
 * - Lowercase letters → direct mapping
 * - Uppercase letters → treated as lowercase (braille Grade 1 simplified)
 * - Digits → preceded by number indicator (#) cell, consecutive digits
 *   share a single indicator
 * - Space → empty cell
 * - Unknown characters → skipped
 */
export function textToBrailleCells(text: string): number[][] {
  const cells: number[][] = [];
  let inNumber = false;

  for (const char of text) {
    const lower = char.toLowerCase();

    if (/[0-9]/.test(char)) {
      // Insert number indicator before first digit in a run
      if (!inNumber) {
        cells.push(BRAILLE_MAP['#']);
        inNumber = true;
      }
      cells.push(BRAILLE_MAP[char]);
    } else if (char === ' ') {
      inNumber = false;
      cells.push(BRAILLE_MAP[' ']);
    } else if (BRAILLE_MAP[lower]) {
      inNumber = false;
      cells.push(BRAILLE_MAP[lower]);
    }
    // Unknown characters are silently skipped
  }

  return cells;
}
