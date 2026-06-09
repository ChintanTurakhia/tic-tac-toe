"use client";

import { useRef } from "react";
import { Grid, GRID } from "../lib/types";

interface Props {
  grid: Grid;
  onStrokeStart: () => void;
  onPaintCell: (index: number) => void;
}

export default function PixelCanvas({ grid, onStrokeStart, onPaintCell }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);

  function cellFromEvent(e: React.PointerEvent): number | null {
    const el = ref.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GRID);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GRID);
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return null;
    return y * GRID + x;
  }

  function handleDown(e: React.PointerEvent) {
    e.preventDefault();
    drawing.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    onStrokeStart();
    const i = cellFromEvent(e);
    if (i !== null) onPaintCell(i);
  }

  function handleMove(e: React.PointerEvent) {
    if (!drawing.current) return;
    const i = cellFromEvent(e);
    if (i !== null) onPaintCell(i);
  }

  function stop() {
    drawing.current = false;
  }

  return (
    <div
      ref={ref}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className="no-select grid aspect-square w-full max-w-[460px] rounded-2xl bg-white p-2 shadow-chunky ring-4 ring-white"
      style={{
        gridTemplateColumns: `repeat(${GRID}, 1fr)`,
        gridTemplateRows: `repeat(${GRID}, 1fr)`,
        // soft checkerboard so transparent + white pixels stay visible
        backgroundImage:
          "linear-gradient(45deg, #eef2ff 25%, transparent 25%), linear-gradient(-45deg, #eef2ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eef2ff 75%), linear-gradient(-45deg, transparent 75%, #eef2ff 75%)",
        backgroundSize: "28px 28px",
        backgroundPosition: "0 0, 0 14px, 14px -14px, -14px 0px",
        touchAction: "none",
      }}
    >
      {grid.map((cell, i) => (
        <div
          key={i}
          className="border border-black/5"
          style={{ backgroundColor: cell ?? "transparent" }}
        />
      ))}
    </div>
  );
}
