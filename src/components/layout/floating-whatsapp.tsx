"use client"

import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import { useShell } from "@/components/layout/shell-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function FloatingWhatsApp() {
  const { menuOpen } = useShell()
  if (menuOpen) return null

  return (
    <div className="fixed right-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 md:right-6 md:bottom-6 md:z-40">
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="relative inline-flex">
              <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 motion-reduce:hidden" />
              <WhatsAppLink placement="floating" iconOnly className="relative" />
            </span>
          }
        />
        <TooltipContent>Chat on WhatsApp</TooltipContent>
      </Tooltip>
    </div>
  )
}
