"use client";

import { useEffect, useState } from "react";

export function CursorFollower() {
  const [point, setPoint] = useState({ x: -100, y: -100, label: "" });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
      const label = target?.getAttribute("data-cursor") ?? "";
      setPoint({ x: event.clientX, y: event.clientY, label });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  if (!point.label) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 hidden size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/50 text-[10px] tracking-[0.16em] text-white uppercase backdrop-blur-md md:grid"
      style={{ left: point.x, top: point.y }}
    >
      {point.label}
    </div>
  );
}
