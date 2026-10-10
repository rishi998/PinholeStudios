"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { WhatsAppIcon } from "@/components/layout/whatsapp-icon"
import { buttonVariants } from "@/components/ui/button"
import { enquiryMessageForPath } from "@/data/navigation"
import { track } from "@/lib/analytics"
import { waLink } from "@/lib/whatsapp"
import { cn } from "cn"

export function WhatsAppLink({
  placement,
  className,
  children,
  iconOnly = false,
  size = "default",
  message,
  variant = "whatsapp",
}: {
  placement: string
  className?: string
  children?: ReactNode
  iconOnly?: boolean
  size?: "default" | "lg" | "icon" | "sm"
  message?: string
  variant?: "whatsapp" | "outline"
}) {
  const pathname = usePathname()
  const studio = pathname.startsWith("/studios/")
    ? pathname.split("/")[2]
    : undefined
  const href = waLink(message ?? enquiryMessageForPath(pathname))

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size: iconOnly ? "icon" : size }), className)}
      aria-label="Chat on WhatsApp"
      onClick={() => track("whatsapp_click", { page: pathname, studio, placement })}
    >
      <WhatsAppIcon className="size-5" />
      {iconOnly ? null : (children ?? "Chat on WhatsApp")}
    </a>
  )
}
