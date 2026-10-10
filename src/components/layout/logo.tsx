import Image from "next/image"
import Link from "next/link"

import { pinholeLogo } from "@/data/pinhole-media"

export function Logo() {
  return (
    <Link href="/" className="flex items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
      <Image src={pinholeLogo} alt="Pinhole Studio" width={168} height={90} className="h-14 w-auto" priority />
    </Link>
  )
}
