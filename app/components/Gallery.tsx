"use client";

import { PublishedEmoji } from "../lib/types";

interface Props {
  items: PublishedEmoji[];
  onRemix: (e: PublishedEmoji) => void;
  onDelete: (id: string) => void;
}

export default function Gallery({ items, onRemix, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white/60 p-6 text-center text-gray-400">
        No emoji published yet. Make the first one! 🌟
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((e) => (
        <div
          key={e.id}
          className="animate-pop rounded-2xl bg-white p-3 text-center shadow-chunky-sm"
        >
          <img
            src={e.png}
            alt={e.name}
            className="mx-auto mb-2 h-20 w-20 rounded-xl bg-indigo-50 p-1"
          />
          <div className="truncate text-sm font-extrabold text-gray-700" title={e.name}>
            {e.name}
          </div>
          <div className="mb-2 font-mono text-[11px] text-indigo-400">
            {e.codepoint}
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onRemix(e)}
              className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-200"
            >
              ✏️ Remix
            </button>
            <button
              onClick={() => onDelete(e.id)}
              className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-200"
              aria-label={`Delete ${e.name}`}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
