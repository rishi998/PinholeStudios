"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

import { readShortlist } from "@/components/features/shortlist-button";
import { Button } from "@/components/ui/button";
import { studios } from "@/data/studios";
import { saveShortlist } from "@/lib/profile";
import { waLink } from "@/lib/whatsapp";

export function ShortlistView({ saved }: { saved: string[] }) {
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("pinhole-shortlist-change", onStoreChange);
      return () => window.removeEventListener("pinhole-shortlist-change", onStoreChange);
    },
    () => localStorage.getItem("pinhole-shortlist") ?? "[]",
    () => "[]",
  );
  const local = raw === "[]" ? [] : readShortlist();
  const slugs = [...new Set([...saved, ...local])];

  useEffect(() => {
    const items = readShortlist();
    if (items.length) void saveShortlist(items);
  }, [raw]);

  const names = studios.filter((studio) => slugs.includes(studio.slug));
  const share = typeof window === "undefined" ? "/studios" : `${window.location.origin}/studios`;

  return (
    <section className="grid gap-4">
      <h1 className="font-display text-3xl">Shortlist</h1>
      {names.length === 0 ? <p className="text-muted-foreground">Heart a studio to keep it here.</p> : null}
      <ul className="grid gap-2">
        {names.map((studio) => (
          <li key={studio.slug}>
            <Link href={`/studios/${studio.slug}`} className="block rounded-2xl border border-border bg-card/80 px-4 py-3">
              {studio.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button nativeButton={false} render={<a href={waLink(`Hi Pinhole Studio, my shortlist: ${names.map((studio) => studio.name).join(", ") || "none yet"}.`)} target="_blank" rel="noreferrer" />}>
          Send my shortlist on WhatsApp
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            void navigator.clipboard.writeText(share);
          }}
        >
          Share link
        </Button>
      </div>
    </section>
  );
}
