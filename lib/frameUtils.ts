import { GameState } from "./game";

// More robust URL handling
function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    console.warn("NEXT_PUBLIC_URL not set, using fallback localhost URL");
    return "http://localhost:3000";
  }

  // Ensure URL doesn't have trailing slash
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const BASE_URL = getBaseUrl();

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
  console.log("[getFrameHtml] BASE_URL:", BASE_URL); // Log URL used

  // Pass state as a query parameter to the image route
  const stateParam = encodeURIComponent(JSON.stringify(state));
  const imageUrl = `${BASE_URL}/api/image?state=${stateParam}`;
  console.log("[getFrameHtml] Generated Image URL:", imageUrl);
  const postUrl = `${BASE_URL}/api/frame`;

  let buttons = "";

  if (state.gameOver) {
    // Game over state: show a "Play Again" button
    buttons += '<meta name="fc:frame:button:1" content="Play Again" />\n';
  } else if (state.playerChoice === null) {
    // Initial state: show Rock, Paper, Scissors buttons
    buttons += '<meta name="fc:frame:button:1" content="👊 Rock" />\n';
    buttons += '<meta name="fc:frame:button:2" content="✋ Paper" />\n';
    buttons += '<meta name="fc:frame:button:3" content="✌️ Scissors" />\n';
  } else {
    // After player has made a choice: show Next Round button
    buttons += '<meta name="fc:frame:button:1" content="Next Round" />\n';
  }

  // Simplified frame HTML with correct meta tag format
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Rock Paper Scissors</title>
    <meta property="og:title" content="Rock Paper Scissors" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${imageUrl}" />
    <meta name="fc:frame:image:aspect_ratio" content="1:1" />
    <meta name="fc:frame:post_url" content="${postUrl}" />
    <meta name="fc:frame:state" content="${encodeURIComponent(JSON.stringify(state))}" />
    ${buttons}
  </head>
  <body>Rock Paper Scissors Frame</body>
</html>`;
}

// Helper to extract meta tags for embedding in React Head
export function getFrameMetadata(state: GameState): Record<string, string> {
  console.log("[getFrameMetadata] State received:", JSON.stringify(state)); // Log incoming state
  console.log("[getFrameMetadata] BASE_URL:", BASE_URL); // Log URL used

  // Pass state as a query parameter to the image route
  const stateParam = encodeURIComponent(JSON.stringify(state));
  const imageUrl = `${BASE_URL}/api/image?state=${stateParam}`;
  console.log("[getFrameMetadata] Generated Image URL:", imageUrl);
  const postUrl = `${BASE_URL}/api/frame`;

  // Use the same format as in the HTML
  const metadata: Record<string, string> = {
    "og:title": "Rock Paper Scissors",
    "og:image": imageUrl,
    "fc:frame": "vNext",
    "fc:frame:image": imageUrl,
    "fc:frame:image:aspect_ratio": "1:1",
    "fc:frame:post_url": postUrl,
    "fc:frame:state": encodeURIComponent(JSON.stringify(state)),
  };

  if (state.gameOver) {
    metadata["fc:frame:button:1"] = "Play Again";
  } else if (state.playerChoice === null) {
    metadata["fc:frame:button:1"] = "👊 Rock";
    metadata["fc:frame:button:2"] = "✋ Paper";
    metadata["fc:frame:button:3"] = "✌️ Scissors";
  } else {
    metadata["fc:frame:button:1"] = "Next Round";
  }

  return metadata;
}
