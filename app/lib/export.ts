import { Grid, GRID } from "./types";

// Render a grid to a PNG data URL. Transparent cells stay transparent.
export function gridToDataURL(grid: Grid, scale = 32): string {
  if (typeof document === "undefined") return "";
  const size = GRID * scale;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const cell = grid[y * GRID + x];
      if (!cell) continue;
      ctx.fillStyle = cell;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return canvas.toDataURL("image/png");
}

export function downloadDataURL(dataURL: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  downloadDataURL(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// A playful, Unicode-style identifier (not a real assignment!).
export function makeCodepoint(): string {
  const hex = Math.floor(Math.random() * 0x1000)
    .toString(16)
    .toUpperCase()
    .padStart(3, "0");
  return `U+1F${hex}`;
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "my-emoji"
  );
}
