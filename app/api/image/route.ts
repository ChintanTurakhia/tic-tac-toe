import { NextRequest, NextResponse } from "next/server";
import { GameState, createInitialState } from "../../../lib/game"; // Adjust path as needed

// Simple SVG generation function
function generateSvg(state: GameState): string {
  const { board } = state;
  const size = 300; // SVG dimensions
  const cellSize = size / 3;
  const strokeWidth = 4;
  const symbolMargin = 15;
  const symbolStrokeWidth = 5;

  let svgContent = "";

  // Draw grid lines
  for (let i = 1; i < 3; i++) {
    const pos = i * cellSize;
    // Vertical line
    svgContent += `<line x1="${pos}" y1="0" x2="${pos}" y2="${size}" stroke="#aaa" stroke-width="${strokeWidth}" />\n`;
    // Horizontal line
    svgContent += `<line x1="0" y1="${pos}" x2="${size}" y2="${pos}" stroke="#aaa" stroke-width="${strokeWidth}" />\n`;
  }

  // Draw X's and O's
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cellValue = board[row][col];
      const x = col * cellSize;
      const y = row * cellSize;

      if (cellValue === "X") {
        // Draw X (two lines)
        svgContent += `<line x1="${x + symbolMargin}" y1="${y + symbolMargin}" x2="${x + cellSize - symbolMargin}" y2="${y + cellSize - symbolMargin}" stroke="#007bff" stroke-width="${symbolStrokeWidth}" />\n`;
        svgContent += `<line x1="${x + cellSize - symbolMargin}" y1="${y + symbolMargin}" x2="${x + symbolMargin}" y2="${y + cellSize - symbolMargin}" stroke="#007bff" stroke-width="${symbolStrokeWidth}" />\n`;
      } else if (cellValue === "O") {
        // Draw O (circle)
        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;
        const radius = cellSize / 2 - symbolMargin;
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="#dc3545" stroke-width="${symbolStrokeWidth}" fill="none" />\n`;
      }
    }
  }

  return `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="white" />
            ${svgContent}
        </svg>
    `;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log(
    "[/api/image] GET request received (Simplified - returning initial board)",
  );
  try {
    // REMOVED state parsing logic
    // ALWAYS generate the initial state image for this test
    const initialState = createInitialState();
    const svg = generateSvg(initialState);
    console.log("[/api/image] Generated SVG string (initial board):"); // Removed SVG logging for brevity

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate", // Prevent caching of the dynamic image
      },
    });
  } catch (error: unknown) {
    // Keep error handling just in case generateSvg fails
    console.error(
      "[/api/image] Error generating SVG:",
      error instanceof Error ? error.message : String(error),
    );
    const errorSvg = `
            <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#eee" />
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="red">Error generating image</text>
            </svg>
        `;
    return new NextResponse(errorSvg, {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
