"use client"

import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"

import { ShellProvider } from "@/components/layout/shell-context"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: ReactNode }) {
  return (
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <ShellProvider>{children}</ShellProvider>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
