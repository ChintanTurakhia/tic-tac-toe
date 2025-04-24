import { NextRequest, NextResponse } from "next/server";
// import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit"; // Removed - these are not in onchainkit
// Instead, we might use @farcaster/hub-nodejs or handle manually for now
import {
  GameState,
  createInitialState,
  makeMove,
  getComputerMove,
  // checkWinner, -> Removed unused import
  // Player, -> Removed unused import
  // CellValue -> Removed unused import
} from "../../../lib/game"; // Adjust path as needed
import { FrameRequest, getFrameHtml } from "../../../lib/frameUtils"; // Import from new location

// const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"; // Removed local definition

// Removed local FrameRequest/FrameMessage interfaces if they were still here

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest): Promise<NextResponse> {
  console.log("GET request received for initial frame");
  const initialState = createInitialState();
  const frameHtml = getFrameHtml(initialState);

  return new NextResponse(frameHtml, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("POST request received for frame interaction");
  let state: GameState;
  let buttonIndex: number | undefined;

  try {
    const body: FrameRequest = await req.json();
    // TODO: Add proper validation using @farcaster/hub-nodejs (requires Neynar API key)
    // Example: const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_API_DOCS' });
    // if (!isValid || !message) {
    //   console.error("Invalid frame message");
    //   return new NextResponse('Invalid frame message', { status: 400 });
    // }
    // console.log("Frame message:", message);

    // For now, bypass validation and parse manually (less secure)
    // Use untrustedData as fallback if trustedData isn't populated without validation
    const message = body?.trustedData?.message ?? body?.untrustedData;
    buttonIndex = message?.button;
    // Frame spec indicates state should be string. Let's trust that.
    const stateString = message?.state;

    if (stateString) {
      try {
        // state = JSON.parse(decodeURIComponent(stateString)); // If state was URL encoded and not auto-decoded
        state = JSON.parse(stateString); // Assuming it's just JSON string
        console.log("Deserialized state:", state);
        if (typeof state.board === "undefined")
          throw new Error("Invalid state format"); // Basic sanity check
      } catch (e) {
        console.error(
          "Error deserializing state:",
          e,
          "State string:",
          stateString,
        );
        state = createInitialState(); // Reset if state is invalid
      }
    } else {
      console.log("No state found, using initial state.");
      state = createInitialState();
    }

    if (state.gameOver && buttonIndex === 1) {
      // If game is over and "Play Again?" (button 1) is pressed
      console.log("Resetting game");
      state = createInitialState();
    } else if (
      !state.gameOver &&
      buttonIndex &&
      buttonIndex >= 1 &&
      buttonIndex <= 9
    ) {
      // Map button index (1-9) to row/col (0-2)
      const row = Math.floor((buttonIndex - 1) / 3);
      const col = (buttonIndex - 1) % 3;
      console.log(
        `Button ${buttonIndex} pressed, mapped to row: ${row}, col: ${col}`,
      );

      if (state.currentPlayer === "X" && state.board[row][col] === null) {
        // Player's move
        console.log("Processing player move");
        let nextState = makeMove(state, row, col);

        // Immediately check if game ended or if it's computer's turn
        if (!nextState.gameOver && nextState.currentPlayer === "O") {
          console.log("Processing computer move");
          // Use a simplified sync approach for API route, remove setTimeout
          const computerMove = getComputerMove(nextState);
          if (computerMove) {
            console.log(
              `Computer moves to row: ${computerMove.row}, col: ${computerMove.col}`,
            );
            nextState = makeMove(nextState, computerMove.row, computerMove.col);
          } else {
            console.log("Computer has no move?"); // Should not happen unless draw/win occurred simultaneously
          }
        }
        state = nextState; // Update state after moves
      } else {
        console.log("Invalid move or not player's turn");
        // Return current state if move is invalid (button on taken cell or O's turn)
      }
    } else {
      console.log("No valid button press detected or game not over for reset.");
      // No valid action, return current state
    }

    const frameHtml = getFrameHtml(state);
    return new NextResponse(frameHtml, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    // Return initial state frame on error
    const initialState = createInitialState();
    const frameHtml = getFrameHtml(initialState);
    return new NextResponse(frameHtml, {
      status: 500, // Internal Server Error
      headers: { "Content-Type": "text/html" },
    });
  }
}
