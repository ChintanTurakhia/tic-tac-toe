"use client";

import Head from "next/head";
import Image from "next/image";
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
import { createInitialState } from "../lib/game";
import { getFrameMetadata } from "../lib/frameUtils";

// Generate initial frame metadata
const initialMetadata = getFrameMetadata(createInitialState());

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

  return (
    <>
      {/* Use next/head to inject initial frame meta tags */}
      <Head>
        {Object.entries(initialMetadata).map(([key, value]) => (
          <meta
            key={key}
            property={key.startsWith("og:") ? key : undefined}
            name={key.startsWith("fc:") ? key : undefined}
            content={value}
          />
        ))}
      </Head>
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
            <h1 className="text-2xl font-bold mb-4">Rock Paper Scissors</h1>
            <div className="mb-6">
              <Image
                src={`/api/image?state=${encodeURIComponent(JSON.stringify(createInitialState()))}`}
                alt="Rock Paper Scissors Game"
                width={300}
                height={300}
                className="border border-gray-300 rounded-md shadow-md"
                unoptimized
                priority
              />
            </div>
            <p className="text-center font-medium">
              This is a preview of the Rock Paper Scissors game.
            </p>
            <div className="mt-4 max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
              <h2 className="text-lg font-bold mb-2">How to Play:</h2>
              <ol className="list-decimal pl-5 space-y-2 text-left">
                <li>
                  <strong>Share this URL in a Farcaster cast:</strong>
                  <code className="block bg-white p-2 mt-1 rounded text-sm overflow-x-auto">
                    https://tic-tac-toe-mu-five-58.vercel.app
                  </code>
                </li>
                <li>
                  <strong>
                    The cast will display the game with three buttons
                  </strong>{" "}
                  for Rock, Paper, and Scissors.
                </li>
                <li>
                  <strong>Click one of the buttons</strong> to make your choice.
                </li>
                <li>
                  <strong>The computer will make its choice</strong> and the
                  result will be displayed.
                </li>
                <li>
                  <strong>
                    Click &quot;Next Round&quot; to continue playing
                  </strong>{" "}
                  until someone reaches 3 points or 5 rounds are completed.
                </li>
                <li>
                  <strong>At the end of the game</strong>, click &quot;Play
                  Again&quot; to start a new game.
                </li>
              </ol>
              <p className="mt-3 text-sm italic">
                Note: The game can only be played through a Farcaster Frame
                embedded in a cast, not directly on this website.
              </p>
              <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Rock beats Scissors, Scissors beats
                  Paper, and Paper beats Rock.
                </p>
              </div>
            </div>
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
    </>
  );
}
