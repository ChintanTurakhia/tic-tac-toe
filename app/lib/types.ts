export const GRID = 16; // 16 x 16 pixel canvas

// A grid cell is a hex color string, or null for transparent.
export type Cell = string | null;
export type Grid = Cell[]; // length GRID * GRID, row-major

export interface PublishedEmoji {
  id: string;
  name: string;
  artist: string;
  description: string;
  keywords: string[];
  codepoint: string; // playful "U+..." identifier
  grid: Grid;
  png: string; // data URL preview
  submittedAt: number;
}

export function emptyGrid(): Grid {
  return new Array(GRID * GRID).fill(null);
}

export const idx = (x: number, y: number) => y * GRID + x;
export const inBounds = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < GRID && y < GRID;
