import Link from "next/link"

import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import { directionsUrl, siteConfig } from "@/lib/site.config"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold tracking-[0.16em]">PINHOLE</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{siteConfig.address.line}</p>
          <a className="mt-3 inline-flex text-sm underline-offset-4 hover:underline" href={directionsUrl}>
            Get directions
          </a>
        </div>
        <div>
          <p className="text-sm font-medium">Contact</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {siteConfig.phones.map((phone) => (
              <li key={phone.tel}>
                <a className="hover:text-primary" href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a className="hover:text-primary" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Brand</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {siteConfig.ecosystem.map((item) => (
              <li key={item.label}>
                <Link className="hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-border px-4 py-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {siteConfig.policies.map((policy) => (
            <li key={policy.href}>
              <Link className="hover:text-foreground" href={policy.href}>
                {policy.label}
              </Link>
            </li>
          ))}
        </ul>
        <WhatsAppLink placement="footer" size="sm" />
      </div>
      {process.env.NEXT_PUBLIC_SAMPLE_DATA_BADGE !== "false" ? (
        <p className="mx-auto w-full max-w-7xl px-4 pb-8 text-xs text-muted-foreground">Stock imagery is sample content until replaced with Pinhole&apos;s own photos.</p>
      ) : null}
    </footer>
  )
}
