"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

type ShellContextValue = {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

export function ShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [seenPath, setSeenPath] = useState(pathname)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setMenuOpen(false)
  }
  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen])
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export function useShell() {
  const value = useContext(ShellContext)
  if (!value) throw new Error("useShell must be used within ShellProvider")
  return value
}
