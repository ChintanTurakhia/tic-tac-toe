import { Grid } from "./types";
import { TEMPLATES, buildTemplate, recolor } from "./templates";
import { COLOR_WORDS } from "./palette";

// Words that hint at a starter template.
const TEMPLATE_WORDS: Record<string, string> = {
  smile: "smiley",
  smiley: "smiley",
  happy: "smiley",
  face: "smiley",
  grin: "smiley",
  joy: "smiley",
  laugh: "smiley",
  heart: "heart",
  love: "heart",
  valentine: "heart",
  like: "heart",
  star: "star",
  shine: "star",
  shiny: "star",
  sparkle: "star",
  sparkly: "star",
  twinkle: "star",
  famous: "star",
  cat: "cat",
  kitty: "cat",
  kitten: "cat",
  meow: "cat",
  cute: "cat",
  ghost: "ghost",
  spooky: "ghost",
  boo: "ghost",
  scary: "ghost",
  halloween: "ghost",
  rainbow: "rainbow",
  colorful: "rainbow",
  colourful: "rainbow",
  pride: "rainbow",
  sky: "rainbow",
};

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "with",
  "and",
  "of",
  "my",
  "is",
  "it",
  "to",
  "that",
  "this",
  "for",
  "very",
  "really",
  "super",
  "emoji",
]);

export interface DescribeResult {
  grid: Grid;
  name: string;
  keywords: string[];
  templateId: string;
  colorWord?: string;
}

function titleCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Turn a free-text description into a starting emoji + name + keywords.
export function describeToEmoji(text: string): DescribeResult {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Pick the first word that names a template, else default to a smiley.
  let templateId = "smiley";
  for (const w of words) {
    if (TEMPLATE_WORDS[w]) {
      templateId = TEMPLATE_WORDS[w];
      break;
    }
  }

  // Pick the first color word, if any.
  let colorWord: string | undefined;
  let colorHex: string | undefined;
  for (const w of words) {
    if (COLOR_WORDS[w]) {
      colorWord = w;
      colorHex = COLOR_WORDS[w];
      break;
    }
  }

  const template = TEMPLATES.find((t) => t.id === templateId)!;
  let grid = buildTemplate(template);
  if (colorHex) grid = recolor(grid, template.primary, colorHex);

  // Build a fun name from the meaningful words.
  const meaningful = words.filter((w) => !STOPWORDS.has(w)).slice(0, 4);
  const name = meaningful.length
    ? titleCase(meaningful)
    : `${titleCase([template.name])} Buddy`;

  const keywords = Array.from(new Set(meaningful.length ? meaningful : [template.id]));

  return { grid, name, keywords, templateId, colorWord };
}
