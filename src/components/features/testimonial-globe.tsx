"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import type { Group } from "three";

import { SampleBadge } from "@/components/ui/sample-badge";
import { testimonials } from "@/data/testimonials";

function fibonacci(index: number, count: number) {
  const y = 1 - (index / (count - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = Math.PI * (3 - Math.sqrt(5)) * index;
  return [Math.cos(theta) * radius * 2.4, y * 2.4, Math.sin(theta) * radius * 2.4] as const;
}

function GlobeMesh() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group}>
      {testimonials.map((item, index) => {
        const [x, y, z] = fibonacci(index, testimonials.length);
        return (
          <mesh key={item.slug} position={[x, y, z]}>
            <planeGeometry args={[0.7, 0.9]} />
            <meshStandardMaterial color={index % 2 ? "#ffb020" : "#f6f1e7"} />
          </mesh>
        );
      })}
    </group>
  );
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function TestimonialGlobe() {
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 768px)").matches, () => false);

  return (
    <div className="grid gap-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        4.9 · {testimonials.length} sample stories
        <SampleBadge />
      </p>
      {desktop ? (
        <div className="h-[520px] overflow-hidden rounded-3xl border border-border bg-card" data-cursor="VIEW">
          <Canvas camera={{ position: [0, 0, 7], fov: 42 }}>
            <color attach="background" args={["oklch(0.9 0.03 85)"]} />
            <ambientLight intensity={0.8} />
            <pointLight position={[3, 3, 4]} intensity={12} color="oklch(0.79 0.16 76)" />
            <GlobeMesh />
          </Canvas>
        </div>
      ) : (
        <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
          {testimonials.map((item) => (
            <li key={item.slug} className="w-64 shrink-0 snap-start">
              <StoryCard item={item} />
            </li>
          ))}
        </ul>
      )}
      <ul className="sr-only">
        {testimonials.map((item) => (
          <li key={item.slug}>
            <Link href={`/stories/${item.slug}`}>{item.role}</Link>
          </li>
        ))}
      </ul>
      {desktop ? (
        <ul className="flex gap-3 overflow-x-auto">
          {testimonials.map((item) => (
            <li key={item.slug}>
              <Link href={`/stories/${item.slug}`} className="block w-56 rounded-2xl border border-border bg-card p-3 text-sm">
                {item.role}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StoryCard({ item }: { item: (typeof testimonials)[number] }) {
  return (
    <Link href={`/stories/${item.slug}`} className="grid h-72 content-end rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#3a2414,#15121a)] p-4">
      <span className="text-sm text-primary">{"★".repeat(item.rating)}</span>
      <span className="mt-2 font-display text-xl">{item.role}</span>
      <span className="text-sm text-muted-foreground">{item.clientName}</span>
    </Link>
  );
}
