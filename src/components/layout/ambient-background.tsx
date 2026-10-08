"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { toneFor } from "@/lib/page-tones";

export function AmbientBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const tone = toneFor(pathname, resolvedTheme === "dark");

  useLayoutEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tone)) {
      root.style.setProperty(key, value);
    }
  }, [tone]);

  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: tone["--background"] }} />;
}
