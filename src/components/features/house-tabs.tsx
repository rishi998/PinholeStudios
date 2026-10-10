"use client";

import { useState } from "react";

import { StudioImage } from "@/components/studios/studio-image";
import { studioPhotos } from "@/data/pinhole-media";

const roomPhoto: Record<string, string> = {
  bedroom: "/media/custom/studios/the-house-setup/02.jpg",
  kitchen: "/media/custom/studios/the-house-setup/03.jpg",
  "living-room": "/media/custom/studios/the-house-setup/04.jpg",
  dining: "/media/custom/studios/the-house-setup/01.jpg",
};

export function HouseTabs({
  setups,
}: {
  setups: { id: string; name: string; summary: string; productionTypes: string[] }[];
}) {
  const [active, setActive] = useState(setups[0]?.id ?? "");
  const current = setups.find((setup) => setup.id === active) ?? setups[0];
  if (!current) return null;

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {setups.map((setup) => (
          <button
            key={setup.id}
            type="button"
            className={`h-11 shrink-0 rounded-full px-4 text-sm ${setup.id === current.id ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
            onClick={() => setActive(setup.id)}
          >
            {setup.name}
          </button>
        ))}
      </div>
      <StudioImage swatch="from-amber-500 to-stone-900" src={roomPhoto[current.id] ?? studioPhotos["the-house-setup"]?.[0]?.src} label={current.name} className="h-56 rounded-3xl" />
      <p>{current.summary}</p>
      <p className="text-sm text-muted-foreground">Suits {current.productionTypes.join(", ")}.</p>
    </div>
  );
}
