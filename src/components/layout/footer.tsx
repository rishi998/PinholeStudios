import Link from "next/link"

import { Logo } from "@/components/layout/logo"
import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import { directionsUrl, siteConfig } from "@/lib/site.config"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-[var(--page-width)] gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo />
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
          <p className="text-sm font-medium">Visit</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {siteConfig.visit.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[var(--page-width)] flex-col gap-4 border-t border-border px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8">
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
        <p className="mx-auto w-full max-w-[var(--page-width)] px-5 pb-8 text-xs text-muted-foreground md:px-8">Photos are from Pinhole Studio. Rates and some stories stay marked sample until the studio confirms them.</p>
      ) : null}
    </footer>
  )
}
