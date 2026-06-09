"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, GRID, emptyGrid, PublishedEmoji } from "../lib/types";
import { PALETTE, COLOR_WORDS } from "../lib/palette";
import { TEMPLATES, buildTemplate, recolor } from "../lib/templates";
import { describeToEmoji } from "../lib/describe";
import { loadGallery, saveGallery } from "../lib/storage";
import PixelCanvas from "./PixelCanvas";
import PublishModal from "./PublishModal";
import Gallery from "./Gallery";

type Tool = "pencil" | "eraser" | "fill";

function floodFill(grid: Grid, start: number, newColor: string): Grid {
  const target = grid[start];
  if (target === newColor) return grid;
  const out = grid.slice();
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    if (out[i] !== target) continue;
    out[i] = newColor;
    const x = i % GRID;
    const y = Math.floor(i / GRID);
    if (x > 0) stack.push(i - 1);
    if (x < GRID - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - GRID);
    if (y < GRID - 1) stack.push(i + GRID);
  }
  return out;
}

const COLOR_WORD_LIST = Object.values(COLOR_WORDS);
function randomColor() {
  return COLOR_WORD_LIST[Math.floor(Math.random() * COLOR_WORD_LIST.length)];
}

export default function EmojiStudio() {
  const [grid, setGrid] = useState<Grid>(emptyGrid());
  const [color, setColor] = useState(PALETTE[0].hex);
  const [tool, setTool] = useState<Tool>("pencil");
  const [history, setHistory] = useState<Grid[]>([]);
  const [name, setName] = useState("My Emoji");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [describeText, setDescribeText] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [gallery, setGallery] = useState<PublishedEmoji[]>([]);

  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    setGallery(loadGallery());
  }, []);

  function pushHistory() {
    setHistory((h) => [...h.slice(-29), gridRef.current]);
  }

  function onStrokeStart() {
    pushHistory();
  }

  function onPaintCell(index: number) {
    setGrid((prev) => {
      if (tool === "fill") return floodFill(prev, index, color);
      const next = tool === "eraser" ? null : color;
      if (prev[index] === next) return prev;
      const out = prev.slice();
      out[index] = next;
      return out;
    });
  }

  function undo() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const last = h[h.length - 1];
      setGrid(last);
      return h.slice(0, -1);
    });
  }

  function clearCanvas() {
    pushHistory();
    setGrid(emptyGrid());
  }

  function loadTemplate(id: string) {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    pushHistory();
    setGrid(buildTemplate(t));
    setName(t.name);
    setKeywords([t.id]);
  }

  function surprise() {
    const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    pushHistory();
    let g = buildTemplate(t);
    if (Math.random() > 0.4) g = recolor(g, t.primary, randomColor());
    setGrid(g);
    setName(`Surprise ${t.name}`);
    setKeywords([t.id, "surprise"]);
  }

  function applyDescribe() {
    if (!describeText.trim()) return;
    const result = describeToEmoji(describeText);
    pushHistory();
    setGrid(result.grid);
    setName(result.name);
    setKeywords(result.keywords);
  }

  function handlePublished(e: PublishedEmoji) {
    const next = [e, ...gallery];
    setGallery(next);
    saveGallery(next);
  }

  function remix(e: PublishedEmoji) {
    pushHistory();
    setGrid(e.grid.slice());
    setName(e.name);
    setKeywords(e.keywords);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEmoji(id: string) {
    const next = gallery.filter((g) => g.id !== id);
    setGallery(next);
    saveGallery(next);
  }

  const toolBtn = (t: Tool, label: string, emoji: string) => (
    <button
      onClick={() => setTool(t)}
      className={`flex-1 rounded-xl px-2 py-3 text-sm font-bold shadow-chunky-sm transition active:translate-y-0.5 ${
        tool === t
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-600 hover:bg-indigo-50"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <div>{label}</div>
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl">
          <span className="animate-floaty inline-block">🎨</span> Emoji Studio
        </h1>
        <p className="mt-2 text-lg font-semibold text-gray-500">
          Draw it, remix it, or describe it — then publish your very own emoji!
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Canvas side */}
        <div className="flex flex-col items-center">
          <div className="mb-3 rounded-full bg-white px-4 py-1 text-sm font-bold text-indigo-500 shadow-chunky-sm">
            Now making: <span className="text-indigo-700">{name}</span>
          </div>

          <PixelCanvas
            grid={grid}
            onStrokeStart={onStrokeStart}
            onPaintCell={onPaintCell}
          />

          {/* Tools */}
          <div className="mt-4 flex w-full max-w-[460px] gap-2">
            {toolBtn("pencil", "Draw", "✏️")}
            {toolBtn("fill", "Fill", "🪣")}
            {toolBtn("eraser", "Erase", "🧽")}
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="flex-1 rounded-xl bg-white px-2 py-3 text-sm font-bold text-gray-600 shadow-chunky-sm transition active:translate-y-0.5 hover:bg-amber-50 disabled:opacity-40"
            >
              <span className="text-lg">↩️</span>
              <div>Undo</div>
            </button>
            <button
              onClick={clearCanvas}
              className="flex-1 rounded-xl bg-white px-2 py-3 text-sm font-bold text-gray-600 shadow-chunky-sm transition active:translate-y-0.5 hover:bg-rose-50"
            >
              <span className="text-lg">🗑️</span>
              <div>Clear</div>
            </button>
          </div>

          {/* Palette */}
          <div className="mt-4 w-full max-w-[460px] rounded-2xl bg-white/70 p-3 shadow-chunky-sm">
            <div className="mb-2 text-sm font-bold text-gray-500">
              Pick a color
            </div>
            <div className="grid grid-cols-8 gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => {
                    setColor(c.hex);
                    setTool((t) => (t === "eraser" ? "pencil" : t));
                  }}
                  className={`aspect-square rounded-lg border-2 transition ${
                    color === c.hex
                      ? "scale-110 border-indigo-600 ring-2 ring-indigo-300"
                      : "border-black/10 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls side */}
        <div className="flex flex-col gap-5">
          {/* Start from an emoji */}
          <section className="rounded-2xl bg-white/80 p-4 shadow-chunky-sm">
            <h2 className="mb-1 text-lg font-extrabold text-gray-700">
              1️⃣ Start from an emoji
            </h2>
            <p className="mb-3 text-sm text-gray-500">
              Load one and change it however you like!
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t.id)}
                  className="rounded-xl bg-indigo-50 py-2 text-center transition hover:scale-105 hover:bg-indigo-100"
                >
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="text-[11px] font-bold text-gray-500">
                    {t.name}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={surprise}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 py-2 font-bold text-white shadow-chunky-sm active:translate-y-0.5"
            >
              🎲 Surprise me!
            </button>
          </section>

          {/* Describe it */}
          <section className="rounded-2xl bg-white/80 p-4 shadow-chunky-sm">
            <h2 className="mb-1 text-lg font-extrabold text-gray-700">
              2️⃣ Describe it with words
            </h2>
            <p className="mb-3 text-sm text-gray-500">
              Try “a blue happy cat” or “spooky purple ghost”.
            </p>
            <div className="flex gap-2">
              <input
                value={describeText}
                onChange={(e) => setDescribeText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyDescribe()}
                placeholder="a shiny pink star..."
                className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2 focus:border-indigo-400"
              />
              <button
                onClick={applyDescribe}
                className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-chunky-sm active:translate-y-0.5"
              >
                ✨ Make it
              </button>
            </div>
          </section>

          {/* Publish */}
          <section className="rounded-2xl bg-gradient-to-br from-amber-100 to-pink-100 p-4 shadow-chunky-sm">
            <h2 className="mb-1 text-lg font-extrabold text-gray-700">
              3️⃣ Publish it!
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Send your masterpiece to the official Emoji Specifications Body.
            </p>
            <button
              onClick={() => setPublishOpen(true)}
              className="w-full rounded-2xl bg-emerald-500 py-4 text-xl font-extrabold text-white shadow-chunky transition active:translate-y-1 active:shadow-none"
            >
              🚀 Publish my emoji!
            </button>
          </section>
        </div>
      </div>

      {/* Gallery */}
      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-extrabold text-gray-700">
          🏆 Published Emoji Gallery
        </h2>
        <Gallery items={gallery} onRemix={remix} onDelete={deleteEmoji} />
      </section>

      <footer className="mt-10 text-center text-sm text-gray-400">
        Made with 🎨 in Emoji Studio. Real emoji are decided by the{" "}
        <a
          href="https://www.unicode.org/emoji/proposals.html"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-indigo-400 underline"
        >
          Unicode Consortium
        </a>
        .
      </footer>

      <PublishModal
        open={publishOpen}
        grid={grid}
        defaultName={name}
        defaultKeywords={keywords}
        onClose={() => setPublishOpen(false)}
        onPublished={handlePublished}
      />
    </div>
  );
}
