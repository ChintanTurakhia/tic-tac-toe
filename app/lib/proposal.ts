import { PublishedEmoji } from "./types";
import { gridToSizedDataURL } from "./export";

// Official Unicode submission entry points and the current open window.
// The guidelines page always links to the current submission form.
export const UNICODE_GUIDELINES_URL = "https://www.unicode.org/emoji/proposals.html";
export const UNICODE_SUBMISSION_FORM_URL = "https://forms.gle/6KSiYHrUdBkTMNaB8";
export const UNICODE_WINDOW = {
  opensText: "April 2, 2026",
  closesText: "July 31, 2026",
  decisionText: "November 30, 2026",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Build a complete, printable emoji proposal that follows the official
// "Form for Emoji Proposals" structure (unicode.org/emoji/proposals.html).
// It embeds the required images and pre-fills what we can, leaving clearly
// marked prompts for the empirical evidence the submitter must add.
// Open the file and "Print -> Save as PDF", then submit the PDF via the form.
export function buildUnicodeProposalHTML(e: PublishedEmoji): string {
  const date = new Date(e.submittedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const color72 = gridToSizedDataURL(e.grid, 72, false);
  const color18 = gridToSizedDataURL(e.grid, 18, false);
  const bw72 = gridToSizedDataURL(e.grid, 72, true);
  const bw18 = gridToSizedDataURL(e.grid, 18, true);
  const kw = e.keywords.length ? e.keywords.join(", ") : "(add 4–8 search words)";

  const note = (t: string) => `<p class="note"><em>${t}</em></p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Proposal for Emoji: ${esc(e.name)}</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; color:#111; max-width: 740px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
  h1 { font-size: 22px; border-bottom: 3px solid #4f46e5; padding-bottom: 8px; }
  h2 { font-size: 17px; margin-top: 28px; color:#3730a3; border-bottom:1px solid #ddd; padding-bottom:4px; }
  h3 { font-size: 14px; margin-bottom: 4px; }
  .meta { color:#444; font-size: 14px; }
  .banner { background:#eef2ff; border:1px solid #c7d2fe; border-radius:8px; padding:12px 16px; font-size:13px; font-family: Arial, sans-serif; }
  .note { color:#6b7280; font-size:13px; font-family: Arial, sans-serif; background:#f9fafb; border-left:3px solid #c7d2fe; padding:6px 10px; }
  table { border-collapse: collapse; width:100%; font-size:13px; font-family: Arial, sans-serif; margin:8px 0; }
  td, th { border:1px solid #ccc; padding:6px 8px; text-align:left; vertical-align:top; }
  .imgrow { display:flex; gap:28px; align-items:flex-end; flex-wrap:wrap; margin:10px 0; }
  .imgrow figure { margin:0; text-align:center; }
  .imgrow img { image-rendering: pixelated; border:1px solid #ddd; background:#fff; }
  figcaption { font-size:12px; color:#555; font-family: Arial, sans-serif; margin-top:4px; }
  ul { margin-top:4px; }
  .fill { color:#9ca3af; }
  @media print { .banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>

<div class="banner">
  <strong>Unicode® Emoji Proposal</strong> — prepared with Emoji Studio in the official format.<br/>
  Submit your finished proposal as a <strong>publicly-accessible PDF</strong> via the Unicode Emoji Submission Form,
  linked from <a href="${UNICODE_GUIDELINES_URL}">unicode.org/emoji/proposals.html</a>.<br/>
  Submission window: <strong>${UNICODE_WINDOW.opensText} – ${UNICODE_WINDOW.closesText}</strong>
  (decisions by ${UNICODE_WINDOW.decisionText}).<br/>
  To export: open this file and choose <strong>Print → Save as PDF</strong>.
</div>

<h1>Proposal for Emoji: ${esc(e.name)}</h1>
<p class="meta">
  <strong>Submitter:</strong> ${esc(e.artist)} (main contact)<br/>
  <strong>Date:</strong> ${date}
</p>

<h2>1. Identification</h2>
<h3>Proposed CLDR short name</h3>
<p>${esc(e.name)}</p>
<h3>Keywords</h3>
<p>${esc(kw)}</p>
${note("Keywords are the words people would search to find this emoji. Do not repeat the name. Aim for 4–8.")}
<h3>Proposed category / sort location</h3>
<p class="fill">[Choose where it belongs in the emoji ordering, e.g. “Smileys &amp; Emotion”, “Animals &amp; Nature”, and the emoji it should sort after.]</p>

<h2>2. Images</h2>
<p>Color and black-and-white samples at the two required sizes (PNG, 72×72 and 18×18 px):</p>
<div class="imgrow">
  <figure><img src="${color72}" width="72" height="72" alt="color 72"/><figcaption>Color · 72×72</figcaption></figure>
  <figure><img src="${color18}" width="18" height="18" alt="color 18"/><figcaption>Color · 18×18</figcaption></figure>
  <figure><img src="${bw72}" width="72" height="72" alt="b&amp;w 72"/><figcaption>B&amp;W · 72×72</figcaption></figure>
  <figure><img src="${bw18}" width="18" height="18" alt="b&amp;w 18"/><figcaption>B&amp;W · 18×18</figcaption></figure>
</div>
<h3>License</h3>
<p>These images were created by ${esc(e.artist)} using Emoji Studio. The submitter certifies they
created these images and release them into the public domain (CC0), granting Unicode the right to use them.</p>

<h2>3. Selection Factors for Inclusion</h2>

<h3>A. Compatibility</h3>
<p class="fill">[Is this emoji already widely used on a major platform (e.g. Snapchat, a sticker set, a game)? If so, give details. If not, write “Not applicable”.]</p>

<h3>B. Expected Usage Level</h3>
<p><strong>Frequency evidence</strong> — fill in the counts and compare against the benchmark word “elephant”:</p>
<table>
  <tr><th>Measure</th><th>Your concept</th><th>“elephant” (benchmark)</th></tr>
  <tr><td>Google Search results</td><td class="fill">[count]</td><td class="fill">[count]</td></tr>
  <tr><td>Google Video Search results</td><td class="fill">[count]</td><td class="fill">[count]</td></tr>
  <tr><td>Google Trends — Web Search</td><td class="fill">[screenshot/score]</td><td class="fill">[score]</td></tr>
  <tr><td>Google Trends — Image Search</td><td class="fill">[screenshot/score]</td><td class="fill">[score]</td></tr>
  <tr><td>Google Books Ngram Viewer</td><td class="fill">[screenshot]</td><td class="fill">[reference]</td></tr>
</table>
<h3>Multiple usages &amp; meanings</h3>
<p class="fill">[List the different things this emoji could mean or stand for — the more, the better.]</p>
<h3>Use in sequences</h3>
<p class="fill">[How would this combine with other emoji to make new meanings?]</p>
<h3>Breaks new ground</h3>
<p>${e.description ? esc(e.description) : '<span class="fill">[Explain what new idea this expresses that no current emoji can.]</span>'}</p>

<h3>C. Distinctiveness</h3>
<p>The 18×18 sample above shows the design stays recognizable at small sizes.</p>
<p class="fill">[Describe what makes the silhouette clear and distinct from existing emoji.]</p>

<h3>D. Completeness</h3>
<p class="fill">[Does this fill a gap in a set or category that already exists? Explain.]</p>

<h2>4. Selection Factors for Exclusion</h2>
${note("Unicode rejects proposals that fail any of these. Address each one honestly.")}
<ul>
  <li><strong>Already representable:</strong> <span class="fill">[Show it can’t be made from existing emoji or sequences.]</span></li>
  <li><strong>Overly specific:</strong> <span class="fill">[Explain it isn’t too narrow.]</span></li>
  <li><strong>Open-ended:</strong> <span class="fill">[Explain it isn’t “one of many” that would force endless similar additions.]</span></li>
  <li><strong>Transient:</strong> <span class="fill">[Explain it isn’t a short-lived fad.]</span></li>
  <li><strong>Faulty comparison:</strong> <span class="fill">[Don’t argue “X exists, so this should too”.]</span></li>
  <li><strong>Not a person, deity, logo, or brand:</strong> <span class="fill">[Confirm.]</span></li>
</ul>

<h2>5. Other Information</h2>
<p class="fill">[Add references, links, design notes, or anything else that helps the committee.]</p>

<hr/>
<p class="note">Created with Emoji Studio. This document follows the structure of the official Unicode
Form for Emoji Proposals. Review the full, current requirements at
<a href="${UNICODE_GUIDELINES_URL}">${UNICODE_GUIDELINES_URL}</a> before submitting.</p>

</body>
</html>`;
}
