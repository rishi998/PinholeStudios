"use client"

import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import { useShell } from "@/components/layout/shell-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function FloatingWhatsApp() {
  const { menuOpen } = useShell()
  if (menuOpen) return null

  return (
    <div className="fixed right-6 bottom-6 z-40 hidden md:block">
      <Tooltip>
        <TooltipTrigger
          render={
            <WhatsAppLink placement="floating" iconOnly />
          }
        />
        <TooltipContent>Chat on WhatsApp</TooltipContent>
      </Tooltip>
    </div>
  )
}
