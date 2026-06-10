import { PublishedEmoji } from "./types";

// Gallery persistence. The downloadable proposal package lives in ./proposal.ts.

const KEY = "emoji-studio-gallery-v1";

export function loadGallery(): PublishedEmoji[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGallery(items: PublishedEmoji[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // localStorage may be full or unavailable — fail quietly.
  }
}
