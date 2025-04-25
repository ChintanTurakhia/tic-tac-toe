import { NextRequest, NextResponse } from "next/server";
import {
  GameState,
  createInitialState,
  makeChoice,
  playAgain,
} from "../../../lib/game";
import { FrameRequest, getFrameHtml } from "../../../lib/frameUtils";

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
    // Log the raw request for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON body
    const body: FrameRequest = JSON.parse(rawBody);
    console.log("Parsed request body:", JSON.stringify(body));

    // Extract message data from trusted or untrusted data
    const message = body?.trustedData?.message ?? body?.untrustedData;
    console.log("Extracted message:", JSON.stringify(message));

    buttonIndex = message?.button;
    console.log("Button pressed:", buttonIndex);

    // Get state from the message
    const stateString = message?.state;
    console.log("Raw state string:", stateString);

    if (stateString) {
      try {
        // Try different parsing approaches
        try {
          // First try direct parsing
          state = JSON.parse(stateString);
        } catch (error) {
          // If that fails, try decoding first
          console.log(
            "Direct parsing failed, trying with decoding:",
            error instanceof Error ? error.message : String(error),
          );
          state = JSON.parse(decodeURIComponent(stateString));
        }

        console.log("Successfully parsed state:", JSON.stringify(state));

        // Basic sanity check
        if (
          typeof state.playerChoice === "undefined" &&
          typeof state.computerChoice === "undefined"
        ) {
          console.log("State failed sanity check, using initial state");
          throw new Error("Invalid state format");
        }
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
