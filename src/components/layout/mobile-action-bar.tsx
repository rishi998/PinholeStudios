"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { useShell } from "@/components/layout/shell-context"
import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import { siteConfig } from "@/lib/site.config"
import { cn } from "cn"

export function MobileActionBar() {
  const { menuOpen } = useShell()
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const onResize = () => {
      setKeyboardOpen(window.innerHeight - viewport.height > 150)
    }
    viewport.addEventListener("resize", onResize)
    return () => viewport.removeEventListener("resize", onResize)
  }, [])

  if (menuOpen || keyboardOpen) return null

  const phone = siteConfig.phones[0]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[var(--glass-bg)] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${phone.tel}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "px-2")}
          onClick={() => track("phone_click", { page: window.location.pathname, placement: "mobile-bar" })}
        >
          Call
        </a>
        <WhatsAppLink placement="mobile-bar" size="sm">
          WhatsApp
        </WhatsAppLink>
        <Link href="/plan-my-shoot" className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}>
          Enquire
        </Link>
      </div>
    </div>
  )
}
