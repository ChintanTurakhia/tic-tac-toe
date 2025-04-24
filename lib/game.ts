export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[][];
export type Position = { row: number; col: number };

export type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameOver: boolean;
};

const BOARD_SIZE = 3;

export function createInitialState(): GameState {
  return {
    board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
  };
}

export function getAvailableMoves(board: Board): Position[] {
  const moves: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

export function checkWinner(board: Board): Player | 'draw' | null {
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (
      board[row][0] &&
      board[row][0] === board[row][1] &&
      board[row][0] === board[row][2]
    ) {
      return board[row][0];
    }
  }

  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    if (
      board[0][col] &&
      board[0][col] === board[1][col] &&
      board[0][col] === board[2][col]
    ) {
      return board[0][col];
    }
  }

  // Check diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0]
  ) {
    return board[0][2];
  }

  // Check for draw
  if (getAvailableMoves(board).length === 0) {
    return 'draw';
  }

  // No winner yet
  return null;
}

export function makeMove(state: GameState, row: number, col: number): GameState {
  if (state.gameOver || state.board[row]?.[col] !== null) {
    // Invalid move or game already over
    return state;
  }

  const newBoard = state.board.map((r, rowIndex) =>
    r.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? state.currentPlayer : cell
    )
  );

  const winner = checkWinner(newBoard);
  const gameOver = winner !== null;
  const nextPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

  return {
    board: newBoard,
    currentPlayer: gameOver ? state.currentPlayer : nextPlayer, // Keep current player if game ends
    winner,
    gameOver,
  };
}

// Basic AI: Tries to win, then block, then picks a random move.
export function getComputerMove(state: GameState): Position | null {
    if (state.gameOver || state.currentPlayer === 'X') {
        return null; // Should only be called for 'O's turn when game is active
    }

    const availableMoves = getAvailableMoves(state.board);
    const computerPlayer: Player = 'O';
    const humanPlayer: Player = 'X';

    // 1. Check if Computer ('O') can win in the next move
    for (const move of availableMoves) {
        const nextBoard = state.board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === move.row && colIndex === move.col ? computerPlayer : cell
            )
        );
        if (checkWinner(nextBoard) === computerPlayer) {
            return move;
        }
    }

    // 2. Check if Human ('X') can win in the next move, and block it
    for (const move of availableMoves) {
        const nextBoard = state.board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === move.row && colIndex === move.col ? humanPlayer : cell
            )
        );
        if (checkWinner(nextBoard) === humanPlayer) {
            return move; // Block the opponent's winning move
        }
    }

    // 3. Try to take the center
    if (state.board[1][1] === null) {
        return { row: 1, col: 1 };
    }

    // 4. Try to take a corner
    const corners: Position[] = [
        { row: 0, col: 0 }, { row: 0, col: 2 },
        { row: 2, col: 0 }, { row: 2, col: 2 }
    ];
    const availableCorners = corners.filter(corner => state.board[corner.row][corner.col] === null);
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Pick a random available move
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return null; // Should not happen if logic is correct and game isn't over
} 