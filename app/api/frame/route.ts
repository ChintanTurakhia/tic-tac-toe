import { NextRequest, NextResponse } from "next/server";
import {
  GameState,
  createInitialState,
  makeChoice,
  playAgain,
} from "../../../lib/game";
import { getFrameHtml } from "../../../lib/frameUtils";

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
  let state: GameState = createInitialState();
  let buttonIndex: number | undefined;

  try {
    // Get the request body
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));

    // Extract the button index and state from the request
    const untrustedData = body.untrustedData;
    const trustedData = body.trustedData?.message;

    // Use trusted data if available, otherwise use untrusted data
    const data = trustedData || untrustedData;
    buttonIndex = data?.button;
    const stateString = data?.state;

    console.log("Button pressed:", buttonIndex);
    console.log(
      "State string:",
      stateString ? stateString.substring(0, 100) + "..." : "null",
    );

    // Parse the state if it exists
    if (stateString) {
      try {
        // Try to decode the state first, then parse it
        const decodedState = decodeURIComponent(stateString);
        state = JSON.parse(decodedState);
        console.log("State parsed successfully");
      } catch {
        // If decoding fails, try parsing directly
        try {
          state = JSON.parse(stateString);
          console.log("State parsed successfully (without decoding)");
        } catch (error) {
          console.error("Failed to parse state:", error);
          state = createInitialState();
        }
      }
    }

    // Handle button presses based on game state
    if (state.gameOver && buttonIndex === 1) {
      // If game is over and "Play Again" button is pressed
      console.log("Starting new game");
      state = playAgain();
    } else if (
      !state.gameOver &&
      state.playerChoice !== null &&
      buttonIndex === 1
    ) {
      // If player has made a choice and "Next Round" button is pressed
      console.log("Starting next round");
      // Reset choices but keep scores and increment round
      state = {
        ...state,
        playerChoice: null,
        computerChoice: null,
        result: null,
      };
    } else if (
      !state.gameOver &&
      state.playerChoice === null &&
      buttonIndex &&
      buttonIndex >= 1 &&
      buttonIndex <= 3
    ) {
      // Player is making a choice (Rock, Paper, or Scissors)
      let choice: "rock" | "paper" | "scissors" | null = null;
      switch (buttonIndex) {
        case 1:
          choice = "rock";
          break;
        case 2:
          choice = "paper";
          break;
        case 3:
          choice = "scissors";
          break;
        default:
          choice = null;
      }

      if (choice) {
        console.log(`Player chose: ${choice}`);
        state = makeChoice(state, choice);
      }
    } else {
      console.log(
        "No valid button press detected or invalid state for button press.",
      );
      // Return current state if no valid action
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
