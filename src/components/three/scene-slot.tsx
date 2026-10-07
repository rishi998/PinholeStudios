"use client";

import dynamic from "next/dynamic";

import type { SceneKind } from "@/components/three/pinhole-canvas";

const PinholeCanvas = dynamic(() => import("@/components/three/pinhole-canvas").then((mod) => mod.PinholeCanvas), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-muted" />,
});

export function SceneSlot({
  kind = "aperture",
  color,
  className = "h-[320px] overflow-hidden rounded-3xl border border-border",
}: {
  kind?: SceneKind;
  color?: string;
  className?: string;
}) {
  return <PinholeCanvas kind={kind} color={color} className={className} />;
}
