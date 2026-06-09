"use client";

import { useEffect, useState } from "react";
import { Grid, PublishedEmoji } from "../lib/types";
import {
  gridToDataURL,
  downloadDataURL,
  downloadText,
  makeCodepoint,
  slugify,
} from "../lib/export";
import { buildProposal } from "../lib/storage";
import Confetti from "./Confetti";

interface Props {
  open: boolean;
  grid: Grid;
  defaultName: string;
  defaultKeywords: string[];
  onClose: () => void;
  onPublished: (e: PublishedEmoji) => void;
}

export default function PublishModal({
  open,
  grid,
  defaultName,
  defaultKeywords,
  onClose,
  onPublished,
}: Props) {
  const [name, setName] = useState(defaultName);
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState<PublishedEmoji | null>(null);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setArtist("");
      setDescription("");
      setPublished(null);
    }
  }, [open, defaultName]);

  if (!open) return null;

  const hasArt = grid.some((c) => c);

  function handleSubmit() {
    const emoji: PublishedEmoji = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim() || "My Emoji",
      artist: artist.trim() || "A Brilliant Kid",
      description: description.trim(),
      keywords: defaultKeywords,
      codepoint: makeCodepoint(),
      grid,
      png: gridToDataURL(grid, 16),
      submittedAt: Date.now(),
    };
    onPublished(emoji);
    setPublished(emoji);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {published && <Confetti />}
      <div className="animate-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        {!published ? (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-indigo-600">
                  🚀 Publish your emoji!
                </h2>
                <p className="text-sm text-gray-500">
                  Fill this out to send it to the Emoji Specifications Body.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <img
                src={gridToDataURL(grid, 12)}
                alt="Your emoji preview"
                className="h-28 w-28 rounded-2xl bg-indigo-50 p-2 shadow-chunky-sm"
              />
            </div>

            {!hasArt && (
              <p className="mb-3 rounded-xl bg-amber-100 p-3 text-center text-sm font-semibold text-amber-700">
                Your canvas is empty! Draw something first. 🎨
              </p>
            )}

            <label className="mb-3 block">
              <span className="text-sm font-bold text-gray-700">
                Emoji name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Happy Space Cat"
                className="mt-1 w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-lg focus:border-indigo-400"
              />
            </label>

            <label className="mb-3 block">
              <span className="text-sm font-bold text-gray-700">
                Your name (the artist!)
              </span>
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Sam, age 8"
                className="mt-1 w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-lg focus:border-indigo-400"
              />
            </label>

            <label className="mb-4 block">
              <span className="text-sm font-bold text-gray-700">
                Why should this emoji exist?
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Because every phone needs a happy space cat!"
                rows={3}
                className="mt-1 w-full rounded-xl border-2 border-gray-200 px-3 py-2 focus:border-indigo-400"
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!hasArt}
              className="w-full rounded-2xl bg-indigo-600 py-4 text-xl font-extrabold text-white shadow-chunky transition active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              📨 Submit to the Emoji Body!
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="mb-1 text-3xl font-extrabold text-emerald-600">
              🎉 It&apos;s official(ish)!
            </h2>
            <p className="mb-4 text-gray-500">
              Your emoji has been submitted. Here is your certificate:
            </p>

            <div className="mx-auto mb-5 max-w-sm rounded-2xl border-4 border-dashed border-indigo-300 bg-indigo-50 p-5">
              <img
                src={gridToDataURL(published.grid, 12)}
                alt={published.name}
                className="mx-auto mb-3 h-28 w-28 rounded-2xl bg-white p-2 shadow-chunky-sm"
              />
              <div className="text-xl font-extrabold text-indigo-700">
                {published.name}
              </div>
              <div className="font-mono text-sm text-indigo-500">
                {published.codepoint}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                by {published.artist}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() =>
                  downloadDataURL(
                    gridToDataURL(published.grid, 32),
                    `${slugify(published.name)}.png`,
                  )
                }
                className="flex-1 rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-chunky-sm active:translate-y-0.5"
              >
                ⬇️ Download PNG
              </button>
              <button
                onClick={() =>
                  downloadText(
                    buildProposal(published),
                    `${slugify(published.name)}-proposal.txt`,
                  )
                }
                className="flex-1 rounded-xl bg-sky-500 py-3 font-bold text-white shadow-chunky-sm active:translate-y-0.5"
              >
                📄 Download Proposal
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Psst — real emoji are decided by the Unicode Consortium. Anyone can
              submit a real proposal for free at unicode.org!
            </p>

            <button
              onClick={onClose}
              className="mt-4 rounded-xl bg-gray-100 px-6 py-2 font-bold text-gray-600 hover:bg-gray-200"
            >
              Make another! ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
