"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { EnquirySuccess } from "@/components/enquiry/enquiry-success";
import { clearReceipt, useReceipt, writeReceipt } from "@/lib/enquiry-receipt";
import { SampleBadge } from "@/components/ui/sample-badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { addons } from "@/data/site-content";
import { studios } from "@/data/studios";
import { track } from "@/lib/analytics";
import { submitEnquiry } from "@/lib/enquiries";
import { estimateQuote, formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

export function QuoteDrawer({ studioSlug, triggerVariant = "secondary" }: { studioSlug?: string; triggerVariant?: "default" | "secondary" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(studioSlug ?? studios[0]?.slug ?? "");
  const [mode, setMode] = useState<"hourly" | "half" | "full">("half");
  const [hours, setHours] = useState(4);
  const [picked, setPicked] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const quote = useMemo(() => estimateQuote({ studioSlug: slug, mode, hours, addonIds: picked }), [slug, mode, hours, picked]);
  const receiptKey = `quote:${pathname}`;
  const saved = useReceipt(receiptKey);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant={triggerVariant} />}
        onClick={() => track("quote_click", { page: pathname, studio: slug })}
      >
        Get my quote
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Quote builder</SheetTitle>
        </SheetHeader>
        {saved ? (
          <EnquirySuccess
            href={saved.href}
            reference={saved.reference}
            onDismiss={() => {
              clearReceipt(receiptKey);
            }}
          />
        ) : (
          <form
            method="post"
            className="grid gap-4 px-4 pb-6"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!quote || pending) return;
              setPending(true);
              const data = new FormData(event.currentTarget);
              const message = [
                `Hi Pinhole Studio, please share a quote for ${quote.studio.name}.`,
                `Duration: ${mode}${mode === "hourly" ? `, ${hours} hours` : ""}`,
                `Add-ons: ${picked.join(", ") || "none"}`,
                `Estimate: ${formatInr(quote.total)} (sample, final quote on WhatsApp)`,
                `Name: ${String(data.get("name") ?? "")}`,
                `Phone: ${String(data.get("phone") ?? "")}`,
              ].join("\n");
              let result: Awaited<ReturnType<typeof submitEnquiry>>;
              try {
                result = await submitEnquiry({
                  type: "quote",
                  name: String(data.get("name") ?? ""),
                  phone: String(data.get("phone") ?? ""),
                  email: String(data.get("email") ?? ""),
                  message,
                  sourcePage: pathname,
                  company: String(data.get("company") ?? ""),
                });
              } catch {
                setError("Could not save that quote. You can still write on WhatsApp.");
                setPending(false);
                return;
              }
              if (!result.ok) {
                setError(result.error);
                setPending(false);
                return;
              }
              track("quote_submit", { page: pathname, studio: slug });
              writeReceipt(receiptKey, { href: result.href, reference: result.id });
              setPending(false);
            }}
          >
            <label className="grid gap-2 text-sm">
              Studio
              <select className="h-12 rounded-xl bg-muted/50 px-3" value={slug} onChange={(event) => setSlug(event.target.value)}>
                {studios.map((studio) => (
                  <option key={studio.slug} value={studio.slug}>
                    {studio.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {(["hourly", "half", "full"] as const).map((item) => (
                <Button key={item} type="button" variant={mode === item ? "default" : "outline"} size="sm" onClick={() => setMode(item)}>
                  {item === "half" ? "Half day" : item === "full" ? "Full day" : "Hourly"}
                </Button>
              ))}
            </div>
            {mode === "hourly" ? (
              <label className="grid gap-2 text-sm">
                Hours
                <input type="range" min={2} max={12} value={hours} onChange={(event) => setHours(Number(event.target.value))} />
                <span>{hours} hours</span>
              </label>
            ) : null}
            <ul className="grid gap-2">
              {addons.map((addon) => (
                <li key={addon.id}>
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-border px-3 py-2">
                    <span>{addon.label}</span>
                    <input
                      type="checkbox"
                      checked={picked.includes(addon.id)}
                      onChange={() => setPicked((current) => (current.includes(addon.id) ? current.filter((id) => id !== addon.id) : [...current, addon.id]))}
                    />
                  </label>
                </li>
              ))}
            </ul>
            {quote ? (
              <p className="flex items-center gap-2 text-lg">
                {siteConfig.pricing.mode === "range"
                  ? `Typically ${formatInr(quote.studio.pricing.rangeHourly[0])} to ${formatInr(quote.studio.pricing.rangeHourly[1])}`
                  : formatInr(quote.total)}
                <SampleBadge />
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground">Estimate only. The final quote is confirmed on WhatsApp.</p>
            <Field label="Name" htmlFor="quote-name">
              <Input id="quote-name" name="name" required autoComplete="name" />
            </Field>
            <Field label="Phone" htmlFor="quote-phone">
              <Input id="quote-phone" name="phone" required type="tel" autoComplete="tel" />
            </Field>
            <Field label="Email" htmlFor="quote-email">
              <Input id="quote-email" name="email" type="email" autoComplete="email" />
            </Field>
            <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" loading={pending}>Send quote request on WhatsApp</Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
