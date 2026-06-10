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

// Convert a hex color (#RRGGBB) to its grayscale equivalent using luminance.
function hexToGray(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  const h = lum.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

// Render the grid into an exact pixel size (e.g. 18 or 72 for Unicode specs).
// Cell size may be fractional — canvas handles that fine.
export function gridToSizedDataURL(
  grid: Grid,
  size: number,
  grayscale = false,
): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.imageSmoothingEnabled = false;
  const cell = size / GRID;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const c = grid[y * GRID + x];
      if (!c) continue;
      ctx.fillStyle = grayscale ? hexToGray(c) : c;
      // Slight overlap (+0.5) avoids hairline gaps at fractional cell sizes.
      ctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
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
  downloadBlob(text, "text/plain;charset=utf-8", filename);
}

export function downloadHTML(html: string, filename: string) {
  downloadBlob(html, "text/html;charset=utf-8", filename);
}

function downloadBlob(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type });
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
