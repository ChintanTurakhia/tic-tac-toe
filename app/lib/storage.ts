import { PublishedEmoji } from "./types";

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

// Build the text of an official-style emoji proposal for download.
export function buildProposal(e: PublishedEmoji): string {
  const date = new Date(e.submittedAt).toLocaleDateString();
  return [
    "============================================================",
    "        EMOJI ENCODING PROPOSAL  (junior edition)",
    "============================================================",
    "",
    `Proposed character : ${e.name}`,
    `Suggested codepoint: ${e.codepoint}`,
    `Submitted by       : ${e.artist}`,
    `Date               : ${date}`,
    "",
    "------------------------------------------------------------",
    "A. IDENTIFICATION",
    "------------------------------------------------------------",
    `CLDR short name : ${e.name}`,
    `Keywords        : ${e.keywords.join(", ") || "n/a"}`,
    "",
    "------------------------------------------------------------",
    "B. DESCRIPTION / WHY IT SHOULD EXIST",
    "------------------------------------------------------------",
    e.description || "(no description provided)",
    "",
    "------------------------------------------------------------",
    "C. SELECTION FACTORS",
    "------------------------------------------------------------",
    "[x] Compatibility       : drawn in a 16x16 grid",
    "[x] Expected usage level: high (it's awesome)",
    "[x] Distinctiveness     : one of a kind",
    "[x] Completeness        : ready to encode",
    "",
    "------------------------------------------------------------",
    "D. NOTE FROM EMOJI STUDIO",
    "------------------------------------------------------------",
    "This is a pretend proposal created for fun and learning.",
    "Real emoji are decided by the Unicode Consortium. You can",
    "read about the real (free!) proposal process here:",
    "https://www.unicode.org/emoji/proposals.html",
    "",
    "Keep drawing — maybe one day you'll submit a real one! 🎨",
    "============================================================",
  ].join("\n");
}
