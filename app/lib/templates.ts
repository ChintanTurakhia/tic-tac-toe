import { Grid, GRID, emptyGrid } from "./types";

export interface Template {
  id: string;
  name: string;
  emoji: string; // a real emoji used as the picker icon
  primary: string; // the "main" color, used by the Describe re-color feature
  art: string[];
  legend: Record<string, string>;
}

// Turn a block of 16 strings (each 16 chars) into a flat color grid.
// '.' (or space) means transparent.
export function parseArt(art: string[], legend: Record<string, string>): Grid {
  const grid = emptyGrid();
  for (let y = 0; y < GRID; y++) {
    const row = art[y] ?? "";
    for (let x = 0; x < GRID; x++) {
      const ch = row[x];
      if (!ch || ch === "." || ch === " ") continue;
      const color = legend[ch];
      if (color) grid[y * GRID + x] = color;
    }
  }
  return grid;
}

const C = {
  Y: "#FACC15",
  K: "#111827",
  R: "#EF4444",
  O: "#FB923C",
  G: "#22C55E",
  B: "#3B82F6",
  P: "#A855F7",
  W: "#FFFFFF",
  N: "#F472B6", // pink (nose)
  C: "#FB923C", // cat fur (orange)
};

export const TEMPLATES: Template[] = [
  {
    id: "smiley",
    name: "Smiley",
    emoji: "🙂",
    primary: C.Y,
    legend: { Y: C.Y, K: C.K },
    art: [
      ".....YYYYYY.....",
      "...YYYYYYYYYY...",
      "..YYYYYYYYYYYY..",
      ".YYYYYYYYYYYYYY.",
      ".YYYYYYYYYYYYYY.",
      "YYYYKKYYYYKKYYYY",
      "YYYYKKYYYYKKYYYY",
      "YYYYYYYYYYYYYYYY",
      "YYYYYYYYYYYYYYYY",
      "YYYYKYYYYYYKYYYY",
      "YYYYKYYYYYYKYYYY",
      ".YYYYKKYYKKYYYY.",
      "..YYYYKKKKYYYY..",
      "...YYYYYYYYYY...",
      ".....YYYYYY.....",
      "................",
    ],
  },
  {
    id: "heart",
    name: "Heart",
    emoji: "❤️",
    primary: C.R,
    legend: { R: C.R },
    art: [
      "................",
      "................",
      "..RRR......RRR..",
      ".RRRRR....RRRRR.",
      ".RRRRRRRRRRRRRR.",
      ".RRRRRRRRRRRRRR.",
      ".RRRRRRRRRRRRRR.",
      "..RRRRRRRRRRRR..",
      "..RRRRRRRRRRRR..",
      "...RRRRRRRRRR...",
      "....RRRRRRRR....",
      ".....RRRRRR.....",
      "......RRRR......",
      ".......RR.......",
      "................",
      "................",
    ],
  },
  {
    id: "star",
    name: "Star",
    emoji: "⭐",
    primary: C.Y,
    legend: { S: C.Y },
    art: [
      "................",
      ".......SS.......",
      "......SSSS......",
      "......SSSS......",
      ".SSSSSSSSSSSSSS.",
      "..SSSSSSSSSSSS..",
      "...SSSSSSSSSS...",
      "...SSSSSSSSSS...",
      "..SSSSSSSSSSSS..",
      "..SSSSSSSSSSSS..",
      "..SSSSS..SSSSS..",
      ".SSSS......SSSS.",
      ".SSS........SSS.",
      "SS............SS",
      "................",
      "................",
    ],
  },
  {
    id: "cat",
    name: "Kitty",
    emoji: "🐱",
    primary: C.C,
    legend: { C: C.C, K: C.K, P: C.N },
    art: [
      "................",
      ".CC..........CC.",
      ".CCC........CCC.",
      ".CCCC......CCCC.",
      ".CCCCCCCCCCCCCC.",
      ".CCCCCCCCCCCCCC.",
      "CCCCCCCCCCCCCCCC",
      "CCCKKCCCCCCKKCCC",
      "CCCKKCCCCCCKKCCC",
      "CCCCCCCPPCCCCCCC",
      "CCCCCCKPPKCCCCCC",
      "CCCCCKCCCCKCCCCC",
      ".CCCCCKKKKCCCCC.",
      "..CCCCCCCCCCCC..",
      "...CCCCCCCCCC...",
      "................",
    ],
  },
  {
    id: "ghost",
    name: "Ghost",
    emoji: "👻",
    primary: C.W,
    legend: { W: C.W, K: C.K },
    art: [
      "................",
      "................",
      "....WWWWWWWW....",
      "...WWWWWWWWWW...",
      "..WWWWWWWWWWWW..",
      "..WWKKWWWWKKWW..",
      "..WWKKWWWWKKWW..",
      "..WWWWWWWWWWWW..",
      "..WWWWKKKKWWWW..",
      "..WWWWWWWWWWWW..",
      "..WWWWWWWWWWWW..",
      "..WWWWWWWWWWWW..",
      "..WWWWWWWWWWWW..",
      "..WW.WW..WW.WW..",
      "................",
      "................",
    ],
  },
  {
    id: "rainbow",
    name: "Rainbow",
    emoji: "🌈",
    primary: C.B,
    legend: {
      R: C.R,
      O: C.O,
      Y: C.Y,
      G: C.G,
      B: C.B,
      P: C.P,
      W: C.W,
    },
    art: [
      "................",
      "................",
      "...RRRRRRRRRR...",
      "...OOOOOOOOOO...",
      "...YYYYYYYYYY...",
      "...GGGGGGGGGG...",
      "...BBBBBBBBBB...",
      "...PPPPPPPPPP...",
      "...PPPPPPPPPP...",
      "................",
      ".WWW........WWW.",
      "WWWWW......WWWWW",
      "WWWWW......WWWWW",
      ".WWW........WWW.",
      "................",
      "................",
    ],
  },
];

export function buildTemplate(t: Template): Grid {
  return parseArt(t.art, t.legend);
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

// Swap every cell that matches `from` for `to` (used by Describe re-coloring).
export function recolor(grid: Grid, from: string, to: string): Grid {
  return grid.map((cell) =>
    cell && cell.toUpperCase() === from.toUpperCase() ? to : cell,
  );
}
