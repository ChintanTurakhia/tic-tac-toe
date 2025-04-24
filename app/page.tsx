"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  GameState,
  createInitialState,
  makeMove,
  getComputerMove,
} from "../lib/game";

const Button = ({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button {...props}>{children}</button>
);
const Icon = ({
  name,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { name: string }) => (
  <span {...props}>[{name}]</span>
);

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAddedResult = await addFrame();
    setFrameAdded(Boolean(frameAddedResult));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
        >
          <Icon name="plus" /> Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const handlePlayerMove = useCallback(
    (row: number, col: number) => {
      if (
        gameState.gameOver ||
        gameState.currentPlayer !== "X" ||
        gameState.board[row][col] !== null
      ) {
        return;
      }
      setGameState((prevState) => makeMove(prevState, row, col));
    },
    [gameState.gameOver, gameState.currentPlayer, gameState.board],
  );

  useEffect(() => {
    if (gameState.currentPlayer === "O" && !gameState.gameOver) {
      const timer = setTimeout(() => {
        const computerMove = getComputerMove(gameState);
        if (computerMove) {
          setGameState((prevState) =>
            makeMove(prevState, computerMove.row, computerMove.col),
          );
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameOver, gameState]);

  const getStatusMessage = (): string => {
    if (gameState.winner) {
      return gameState.winner === "draw"
        ? "It's a Draw!"
        : `${gameState.winner} Wins!`;
    }
    return gameState.currentPlayer === "X"
      ? "Your Turn (X)"
      : "Computer's Turn (O)";
  };

  const handleResetGame = () => {
    setGameState(createInitialState());
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">{getStatusMessage()}</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handlePlayerMove(rowIndex, colIndex)}
                  disabled={
                    cell !== null ||
                    gameState.gameOver ||
                    gameState.currentPlayer === "O"
                  }
                  className={`w-20 h-20 border border-gray-400 flex items-center justify-center text-4xl font-bold rounded
                              ${cell === "X" ? "text-blue-500" : "text-red-500"}
                              ${cell !== null || gameState.gameOver || gameState.currentPlayer === "O" ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-gray-100"}`}
                  aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}${cell ? `: ${cell}` : ""}`}
                >
                  {cell}
                </button>
              )),
            )}
          </div>
          {gameState.gameOver && (
            <Button
              onClick={handleResetGame}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again?
            </Button>
          )}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
