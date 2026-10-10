"use client"

import { UserRound, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import { createPortal } from "react-dom"

import { Logo } from "@/components/layout/logo"
import { authClient } from "@/lib/auth-client"
import { useShell } from "@/components/layout/shell-context"
import { WhatsAppLink } from "@/components/layout/whatsapp-link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { services, studios } from "@/data/navigation"
import { siteConfig } from "@/lib/site.config"
import { cn } from "cn"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/recce", label: "360° Recce" },
]

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const { menuOpen, setMenuOpen } = useShell()
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<"studios" | "services" | null>(null)
  const [seenPath, setSeenPath] = useState(pathname)
  const menuId = useId()
  const portalReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const closeTimer = useRef<number | null>(null)

  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setOpenMenu(null)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null)
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setMenuOpen])

  function armClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160)
  }

  function armOpen(menu: "studios" | "services") {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenMenu(menu), 80)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#14110E] text-[var(--cream)]">
      <div>
        <div
          className={cn(
            "flex w-full items-center gap-4 px-4 transition-[height] duration-300 md:px-8",
            scrolled ? "h-20" : "h-24"
          )}
        >
          <div className="shrink-0">
            <Logo />
          </div>
          <nav className="hidden min-w-0 flex-1 items-center justify-evenly lg:flex" aria-label="Primary">
            <NavLink href="/" current={isCurrent(pathname, "/")}>
              Home
            </NavLink>
            <NavLink href="/about" current={isCurrent(pathname, "/about")}>
              About
            </NavLink>
            <MegaMenu
              label="Studios"
              open={openMenu === "studios"}
              current={pathname.startsWith("/studios")}
              menuId={`${menuId}-studios`}
              onOpen={() => armOpen("studios")}
              onClose={armClose}
              onToggle={() => setOpenMenu((value) => (value === "studios" ? null : "studios"))}
            >
              <div className="grid grid-cols-2 gap-2">
                {studios.map((studio) => (
                  <Link
                    key={studio.slug}
                    href={`/studios/${studio.slug}`}
                    className="flex items-center gap-3 rounded-2xl p-2 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className={cn("size-12 shrink-0 rounded-xl bg-linear-to-br", studio.swatch)} />
                    <span>
                      <span className="block text-sm font-medium">{studio.name}</span>
                      <span className="block text-xs text-muted-foreground">{studio.summary}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </MegaMenu>
            <MegaMenu
              label="Services"
              open={openMenu === "services"}
              current={pathname.startsWith("/services")}
              menuId={`${menuId}-services`}
              onOpen={() => armOpen("services")}
              onClose={armClose}
              onToggle={() => setOpenMenu((value) => (value === "services" ? null : "services"))}
            >
              <ul className="grid gap-1">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="block rounded-2xl px-3 py-2 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="block text-sm font-medium">{service.name}</span>
                      <span className="block text-xs text-muted-foreground">{service.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </MegaMenu>
            {links.slice(2).map((link) => (
              <NavLink key={link.href} href={link.href} current={isCurrent(pathname, link.href)}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              <Button nativeButton={false} render={<Link href="/plan-my-shoot" />} size="lg" className="font-bold">
                Plan my shoot
              </Button>
              <WhatsAppLink placement="header" iconOnly />
            </div>
            <AccountMenu />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-[var(--cream)] hover:bg-white/10 hover:text-[var(--cream)] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-hidden={menuOpen || undefined}
              tabIndex={menuOpen ? -1 : 0}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="relative block size-5">
                <motion.span
                  className="absolute left-0 h-0.5 w-5 bg-current"
                  animate={menuOpen ? { top: 9, rotate: 45 } : { top: 3, rotate: 0 }}
                />
                <motion.span
                  className="absolute top-2.5 left-0 h-0.5 w-5 bg-current"
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="absolute left-0 h-0.5 w-5 bg-current"
                  animate={menuOpen ? { top: 9, rotate: -45 } : { top: 17, rotate: 0 }}
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
      {portalReady
        ? createPortal(
            <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-50 flex flex-col bg-[#14110E] text-[var(--cream)] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={(event) => {
              const start = event.changedTouches[0]?.clientY ?? 0
              event.currentTarget.dataset.startY = String(start)
            }}
            onTouchEnd={(event) => {
              const start = Number(event.currentTarget.dataset.startY ?? 0)
              const end = event.changedTouches[0]?.clientY ?? start
              if (end - start > 80) setMenuOpen(false)
            }}
          >
            <div className="flex h-20 items-center justify-between px-4">
              <Logo />
              <Button type="button" variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X />
              </Button>
            </div>
            <nav className="min-h-0 flex-1 overflow-y-auto px-4" aria-label="Mobile">
              {links.slice(0, 2).map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                    className="flex h-14 items-center font-display text-2xl font-bold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Accordion>
                <AccordionItem value="studios">
                  <AccordionTrigger className="h-14 text-2xl font-bold font-display no-underline hover:no-underline">
                    Studios
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-1 pb-3">
                      {studios.map((studio) => (
                        <li key={studio.slug}>
                          <Link href={`/studios/${studio.slug}`} className="flex h-14 items-center rounded-2xl px-2 text-base">
                            {studio.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="services">
                  <AccordionTrigger className="h-14 text-2xl font-bold font-display no-underline hover:no-underline">
                    Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-1 pb-3">
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link href={`/services/${service.slug}`} className="flex h-14 items-center rounded-2xl px-2 text-base">
                            {service.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {links.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                  className="flex h-14 items-center font-display text-2xl font-bold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-[var(--glass-border)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Button nativeButton={false} variant="outline" render={<a href={`tel:${siteConfig.phones[0].tel}`} />}>
                Call
              </Button>
              <WhatsAppLink placement="mobile-menu">WhatsApp</WhatsAppLink>
            </div>
          </motion.div>
        ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </header>
  )
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string
  current: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-full px-4 py-3 text-base font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        current ? "text-[var(--cream)]" : "text-[var(--cream)]/75 hover:text-[var(--cream)]"
      )}
    >
      {children}
    </Link>
  )
}

function MegaMenu({
  label,
  open,
  current,
  menuId,
  onOpen,
  onClose,
  onToggle,
  children,
}: {
  label: string
  open: boolean
  current: boolean
  menuId: string
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className={cn(
          "rounded-full px-4 py-3 text-base font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          current || open ? "text-[var(--cream)]" : "text-[var(--cream)]/75 hover:text-[var(--cream)]"
        )}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
        onFocus={onOpen}
      >
        {label}
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute top-full left-0 z-50 mt-3 w-[28rem] rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 shadow-2xl backdrop-blur-xl"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

function AccountMenu() {
  const { data } = authClient.useSession()
  const user = data?.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Account" className="text-[var(--cream)] hover:bg-white/10 hover:text-[var(--cream)]" />}
      >
        <UserRound />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 rounded-2xl">
        {user ? (
          <>
            <DropdownMenuItem render={<Link href="/account" />}>Account</DropdownMenuItem>
            {user.role === "admin" ? <DropdownMenuItem render={<Link href="/admin" />}>Admin</DropdownMenuItem> : null}
            <DropdownMenuItem
              onClick={() => {
                void authClient.signOut()
              }}
            >
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/login" />}>Sign in</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/signup" />}>Create account</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
