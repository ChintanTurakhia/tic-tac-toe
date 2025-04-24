import { NextRequest, NextResponse } from "next/server";
import { GameState, createInitialState } from "../../../lib/game";

export async function GET(req: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`--- /api/image HIT --- ${timestamp} ---`);

  // Get state from query parameter
  let state: GameState;
  const stateParam = req.nextUrl.searchParams.get("state");

  if (stateParam) {
    try {
      state = JSON.parse(decodeURIComponent(stateParam));
      console.log("Parsed state:", state);
    } catch (e) {
      console.error("Error parsing state:", e);
      state = createInitialState();
    }
  } else {
    console.log("No state parameter found, using initial state");
    state = createInitialState();
  }

  // Generate SVG for the game board
  const svg = generateGameBoardSVG(state);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

function generateGameBoardSVG(state: GameState): string {
  const { board, winner, gameOver } = state;

  // SVG dimensions
  const width = 600;
  const height = 600;
  const cellSize = 200;
  const lineWidth = 10;
  const xoSize = 60; // Size of X and O symbols

  // Start SVG
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#f0f0f0" />
    
    <!-- Board grid lines -->
    <g stroke="#333" stroke-width="${lineWidth}">
      <!-- Vertical lines -->
      <line x1="${cellSize}" y1="0" x2="${cellSize}" y2="${height}" />
      <line x1="${2 * cellSize}" y1="0" x2="${2 * cellSize}" y2="${height}" />
      
      <!-- Horizontal lines -->
      <line x1="0" y1="${cellSize}" x2="${width}" y2="${cellSize}" />
      <line x1="0" y1="${2 * cellSize}" x2="${width}" y2="${2 * cellSize}" />
    </g>
    
    <!-- Game pieces -->
    <g>`;

  // Add X's and O's
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = board[row][col];
      const centerX = col * cellSize + cellSize / 2;
      const centerY = row * cellSize + cellSize / 2;

      if (cell === "X") {
        // Draw X
        svg += `
        <g stroke="#FF5722" stroke-width="${lineWidth}" stroke-linecap="round">
          <line x1="${centerX - xoSize}" y1="${centerY - xoSize}" x2="${centerX + xoSize}" y2="${centerY + xoSize}" />
          <line x1="${centerX + xoSize}" y1="${centerY - xoSize}" x2="${centerX - xoSize}" y2="${centerY + xoSize}" />
        </g>`;
      } else if (cell === "O") {
        // Draw O
        svg += `
        <circle cx="${centerX}" cy="${centerY}" r="${xoSize}" fill="none" stroke="#2196F3" stroke-width="${lineWidth}" />`;
      }
    }
  }

  // Add game status text
  if (gameOver) {
    let statusText = "";
    let statusColor = "#333";

    if (winner === "X") {
      statusText = "X Wins!";
      statusColor = "#FF5722";
    } else if (winner === "O") {
      statusText = "O Wins!";
      statusColor = "#2196F3";
    } else if (winner === "draw") {
      statusText = "It's a Draw!";
      statusColor = "#9C27B0";
    }

    svg += `
    <rect x="0" y="${height - 80}" width="${width}" height="80" fill="rgba(255,255,255,0.8)" />
    <text x="${width / 2}" y="${height - 30}" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="${statusColor}" text-anchor="middle">${statusText}</text>`;
  } else {
    // Show whose turn it is
    const turnText = `${state.currentPlayer}'s Turn`;
    const turnColor = state.currentPlayer === "X" ? "#FF5722" : "#2196F3";

    svg += `
    <rect x="0" y="${height - 60}" width="${width}" height="60" fill="rgba(255,255,255,0.8)" />
    <text x="${width / 2}" y="${height - 20}" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="${turnColor}" text-anchor="middle">${turnText}</text>`;
  }

  // Close SVG tags
  svg += `
    </g>
  </svg>`;

  return svg;
}
