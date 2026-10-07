"use client";

import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const KEY = "pinhole-shortlist";
const EVENT = "pinhole-shortlist-change";

export function readShortlist() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(EVENT, onStoreChange);
  return () => window.removeEventListener(EVENT, onStoreChange);
}

export function ShortlistButton({ slug }: { slug: string }) {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(KEY) ?? "[]", () => "[]");
  const on = raw.includes(`"${slug}"`);

  return (
    <Button
      type="button"
      variant={on ? "default" : "secondary"}
      size="sm"
      aria-pressed={on}
      onClick={() => {
        const current = readShortlist();
        const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
        localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      }}
    >
      <Heart />
      {on ? "Shortlisted" : "Shortlist"}
    </Button>
  );
}
