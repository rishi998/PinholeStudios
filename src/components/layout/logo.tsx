import Link from "next/link"

import { ApertureMark } from "@/components/layout/aperture-mark"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
      <span className="relative grid size-10 place-items-center text-primary" aria-hidden="true">
        <ApertureMark className="size-10" />
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--ember)] motion-safe:animate-[rec_1.4s_steps(2)_infinite]" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-sm font-bold tracking-[0.18em]">PINHOLE</span>
        <span className="block text-[11px] tracking-[0.28em] text-muted-foreground uppercase">studio</span>
      </span>
    </Link>
  )
}
