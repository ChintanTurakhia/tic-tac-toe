export type Choice = "rock" | "paper" | "scissors" | null;
export type Result = "win" | "lose" | "draw" | null;

export type GameState = {
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
  round: number;
  playerScore: number;
  computerScore: number;
  gameOver: boolean;
};

export function createInitialState(): GameState {
  return {
    playerChoice: null,
    computerChoice: null,
    result: null,
    round: 1,
    playerScore: 0,
    computerScore: 0,
    gameOver: false,
  };
}

export function getComputerChoice(): Choice {
  const choices: Choice[] = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

export function determineWinner(
  playerChoice: Choice,
  computerChoice: Choice,
): Result {
  if (!playerChoice || !computerChoice) return null;

  if (playerChoice === computerChoice) {
    return "draw";
  }

  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "win";
  }

  return "lose";
}

export function makeChoice(state: GameState, playerChoice: Choice): GameState {
  if (state.gameOver) {
    return state;
  }

  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);

  let playerScore = state.playerScore;
  let computerScore = state.computerScore;

  if (result === "win") {
    playerScore += 1;
  } else if (result === "lose") {
    computerScore += 1;
  }

  // Game is over after 5 rounds or if someone reaches 3 points
  const round = state.round + 1;
  const gameOver = round > 5 || playerScore >= 3 || computerScore >= 3;

  return {
    playerChoice,
    computerChoice,
    result,
    round,
    playerScore,
    computerScore,
    gameOver,
  };
}

export function playAgain(): GameState {
  return createInitialState();
}

export function getChoiceEmoji(choice: Choice): string {
  switch (choice) {
    case "rock":
      return "👊";
    case "paper":
      return "✋";
    case "scissors":
      return "✌️";
    default:
      return "❓";
  }
}

export function getResultText(result: Result): string {
  switch (result) {
    case "win":
      return "You win!";
    case "lose":
      return "You lose!";
    case "draw":
      return "It's a draw!";
    default:
      return "Choose your move!";
  }
}
