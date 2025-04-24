import { GameState } from "./game"; // Assuming game.ts is in the same lib directory

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"; // Fallback for local dev

// Basic type definition for FrameRequest body (replace with proper validation later)
export interface FrameMessage {
  button?: number;
  state?: string; // Assuming state comes as a string
  // Add other relevant fields from FrameData if needed
}
export interface FrameRequest {
  trustedData?: {
    message?: FrameMessage;
  };
  // Add other potential fields if needed
  untrustedData?: {
    button?: number;
    state?: string;
  };
}

// Function to generate frame HTML meta tags
export function getFrameHtml(state: GameState): string {
  console.log("[getFrameHtml] State received:", JSON.stringify(state)); // Log incoming state
  console.log("[getFrameHtml] NEXT_PUBLIC_URL:", NEXT_PUBLIC_URL); // Log URL used

  // Pass state as a query parameter to the image route
  const stateParam = encodeURIComponent(JSON.stringify(state));
  const imageUrl = `${NEXT_PUBLIC_URL}/api/image?state=${stateParam}`;
  console.log("[getFrameHtml] Generated Image URL:", imageUrl);
  const postUrl = `${NEXT_PUBLIC_URL}/api/frame`;

  let buttons = "";
  if (!state.gameOver) {
    // Simple approach: 1 button for each cell (1-9)
    for (let i = 1; i <= 9; i++) {
      buttons += `<meta name="fc:frame:button:${i}" content="Cell ${i}" />\n`;
    }
  } else {
    // Game over state: show a "Play Again" button
    buttons += '<meta name="fc:frame:button:1" content="Play Again?" />\n';
  }

  // Note: Returning only the meta tags might be more useful if embedding in React's Head
  // But for now, let's keep the full HTML structure for standalone use if needed.
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Tic-Tac-Toe Frame" />
        <meta property="og:image" content="${imageUrl}" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${imageUrl}" />
        <meta name="fc:frame:image:aspect_ratio" content="1:1" />
        <meta name="fc:frame:post_url" content="${postUrl}" />
        <meta name="fc:frame:state" content='${JSON.stringify(state)}' />
        ${buttons}
      </head>
      <body>Tic-Tac-Toe Frame Content (This won't be visible in the frame itself)</body>
    </html>
  `;
}

// Helper to extract meta tags for embedding in React Head
export function getFrameMetadata(state: GameState): Record<string, string> {
  console.log("[getFrameMetadata] State received:", JSON.stringify(state)); // Log incoming state
  console.log("[getFrameMetadata] NEXT_PUBLIC_URL:", NEXT_PUBLIC_URL); // Log URL used

  // Pass state as a query parameter to the image route
  const stateParam = encodeURIComponent(JSON.stringify(state));
  const imageUrl = `${NEXT_PUBLIC_URL}/api/image?state=${stateParam}`;
  console.log("[getFrameMetadata] Generated Image URL:", imageUrl);
  const postUrl = `${NEXT_PUBLIC_URL}/api/frame`;

  const metadata: Record<string, string> = {
    "og:title": "Tic-Tac-Toe Frame",
    "og:image": imageUrl,
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:post_url": postUrl,
    "fc:frame:state": JSON.stringify(state),
  };

  if (!state.gameOver) {
    for (let i = 1; i <= 9; i++) {
      metadata[`fc:frame:button:${i}`] = `Cell ${i}`;
    }
  } else {
    metadata["fc:frame:button:1"] = "Play Again?";
  }

  return metadata;
}
