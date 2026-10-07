"use client"

import { useEffect, useState } from "react"

import { Toaster } from "@/components/ui/sonner"

export function AppToaster() {
  const [position, setPosition] = useState<"top-right" | "bottom-center">("top-right")

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)")
    const update = () => setPosition(query.matches ? "bottom-center" : "top-right")
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return <Toaster position={position} />
}
