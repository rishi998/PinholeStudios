"use client";

import { useEffect, useRef } from "react";

import { SampleBadge } from "@/components/ui/sample-badge";
import { siteStats } from "@/data/site-content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.textContent = `0${suffix}`;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 900);
        node.textContent = `${Math.round(value * progress).toLocaleString("en-IN")}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [suffix, value]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function TrustBand() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {siteStats.map((stat) => (
        <li key={stat.label} className="rounded-3xl border border-border bg-card/80 p-5">
          <p className="font-display text-3xl">
            <Counter value={stat.value} suffix={stat.suffix} />
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {stat.label}
            <SampleBadge />
          </p>
        </li>
      ))}
    </ul>
  );
}
