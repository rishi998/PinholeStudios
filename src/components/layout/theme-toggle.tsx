"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

const themes = ["light", "dark", "system"] as const

function subscribe() {
  return () => {}
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const resolved = themes.includes(theme as (typeof themes)[number])
    ? (theme as (typeof themes)[number])
    : "dark"
  const current = mounted ? resolved : "dark"
  const next = themes[(themes.indexOf(current) + 1) % themes.length]
  const Icon = current === "light" ? Sun : current === "system" ? Monitor : Moon

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${current}. Switch to ${next}`}
      onClick={() => setTheme(next)}
    >
      <Icon />
    </Button>
  )
}
