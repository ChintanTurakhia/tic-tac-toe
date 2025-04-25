import { NextRequest, NextResponse } from "next/server";
import {
  GameState,
  createInitialState,
  getChoiceEmoji,
  getResultText,
} from "../../../lib/game";

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

  // Generate SVG for the game
  const svg = generateGameSVG(state);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

function generateGameSVG(state: GameState): string {
  // SVG dimensions
  const width = 600;
  const height = 600;
  const emojiSize = 80;

  // Colors
  const bgColor = "#1E293B"; // Dark blue background
  const textColor = "#FFFFFF"; // White text
  const accentColor = "#3B82F6"; // Blue accent
  const winColor = "#10B981"; // Green for win
  const loseColor = "#EF4444"; // Red for lose
  const drawColor = "#F59E0B"; // Amber for draw

  // Start SVG
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${bgColor}" />
    
    <!-- Title -->
    <text x="${width / 2}" y="60" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${textColor}" text-anchor="middle">Rock Paper Scissors</text>
    
    <!-- Score -->
    <text x="${width / 2}" y="110" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle">Round ${state.round} of 5 | Score: You ${state.playerScore} - ${state.computerScore} Computer</text>`;

  // Initial state - show instructions
  if (state.playerChoice === null) {
    svg += `
      <text x="${width / 2}" y="${height / 2}" font-family="Arial, sans-serif" font-size="32" fill="${textColor}" text-anchor="middle">Choose your move!</text>
      <text x="${width / 2}" y="${height / 2 + 60}" font-family="Arial, sans-serif" font-size="24" fill="${accentColor}" text-anchor="middle">👊 Rock | ✋ Paper | ✌️ Scissors</text>
      <text x="${width / 2}" y="${height - 60}" font-family="Arial, sans-serif" font-size="20" fill="${accentColor}" text-anchor="middle">Click a button below to make your choice</text>
    `;
  }
  // Show result of the round
  else if (!state.gameOver) {
    const playerEmoji = getChoiceEmoji(state.playerChoice);
    const computerEmoji = getChoiceEmoji(state.computerChoice);
    const resultText = getResultText(state.result);

    let resultColor = accentColor;
    if (state.result === "win") resultColor = winColor;
    if (state.result === "lose") resultColor = loseColor;
    if (state.result === "draw") resultColor = drawColor;

    // Player choice
    svg += `
      <g>
        <text x="${width / 4}" y="${height / 2 - 80}" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle">You chose:</text>
        <text x="${width / 4}" y="${height / 2}" font-family="Arial, sans-serif" font-size="${emojiSize}" text-anchor="middle">${playerEmoji}</text>
        <text x="${width / 4}" y="${height / 2 + 80}" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle">${state.playerChoice}</text>
      </g>
    `;

    // Computer choice
    svg += `
      <g>
        <text x="${(3 * width) / 4}" y="${height / 2 - 80}" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle">Computer chose:</text>
        <text x="${(3 * width) / 4}" y="${height / 2}" font-family="Arial, sans-serif" font-size="${emojiSize}" text-anchor="middle">${computerEmoji}</text>
        <text x="${(3 * width) / 4}" y="${height / 2 + 80}" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle">${state.computerChoice}</text>
      </g>
    `;

    // VS in the middle
    svg += `
      <text x="${width / 2}" y="${height / 2}" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${accentColor}" text-anchor="middle">VS</text>
    `;

    // Result
    svg += `
      <rect x="100" y="${height - 150}" width="${width - 200}" height="80" rx="15" fill="rgba(0,0,0,0.3)" />
      <text x="${width / 2}" y="${height - 100}" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="${resultColor}" text-anchor="middle">${resultText}</text>
      <text x="${width / 2}" y="${height - 40}" font-family="Arial, sans-serif" font-size="20" fill="${accentColor}" text-anchor="middle">Click "Next Round" to continue</text>
    `;
  }
  // Game over state
  else {
    let finalResult = "";
    let finalColor = accentColor;

    if (state.playerScore > state.computerScore) {
      finalResult = "You Win The Game!";
      finalColor = winColor;
    } else if (state.playerScore < state.computerScore) {
      finalResult = "Computer Wins The Game!";
      finalColor = loseColor;
    } else {
      finalResult = "The Game Is A Draw!";
      finalColor = drawColor;
    }

    // Game over overlay
    svg += `
      <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(0,0,0,0.7)" />
      <rect x="50" y="${height / 2 - 100}" width="${width - 100}" height="200" rx="20" fill="${bgColor}" stroke="${finalColor}" stroke-width="4" />
      <text x="${width / 2}" y="${height / 2 - 30}" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${finalColor}" text-anchor="middle">Game Over</text>
      <text x="${width / 2}" y="${height / 2 + 30}" font-family="Arial, sans-serif" font-size="28" fill="${textColor}" text-anchor="middle">${finalResult}</text>
      <text x="${width / 2}" y="${height / 2 + 80}" font-family="Arial, sans-serif" font-size="24" fill="${accentColor}" text-anchor="middle">Final Score: You ${state.playerScore} - ${state.computerScore} Computer</text>
      <text x="${width / 2}" y="${height - 40}" font-family="Arial, sans-serif" font-size="20" fill="${accentColor}" text-anchor="middle">Click "Play Again" to start a new game</text>
    `;
  }

  // Close SVG
  svg += `</svg>`;

  return svg;
}
