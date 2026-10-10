import { QuoteDrawer } from "@/components/features/quote-drawer";
import { PageIntro } from "@/components/layout/page-intro";
import { SampleBadge } from "@/components/ui/sample-badge";
import { studios } from "@/data/studios";
import { formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

export const metadata = { title: "Pricing" };

function hourly(studio: (typeof studios)[number]) {
  return siteConfig.pricing.mode === "range"
    ? `${formatInr(studio.pricing.rangeHourly[0])}–${formatInr(studio.pricing.rangeHourly[1])}`
    : formatInr(studio.pricing.hourly);
}

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Rates"
        title="Pricing"
        lede="These amounts are sample figures for each room. They are not a confirmed price, and they are not guaranteed for every studio. The quote the studio sends is the one that holds."
      />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-5 pt-8 pb-[var(--space-section)] md:px-8">
        <p className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.18em] text-muted-foreground uppercase">
          Illustrative rate card
          <SampleBadge />
        </p>
        <ul className="mt-6 border-t border-border md:hidden">
          {studios.map((studio) => (
            <li key={studio.slug} className="border-b border-border py-5">
              <p className="font-display text-2xl tracking-[-0.03em]">{studio.name}</p>
              <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Hourly</dt>
                  <dd className="mt-1 font-mono tabular-nums">{hourly(studio)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Half day</dt>
                  <dd className="mt-1 font-mono tabular-nums">{formatInr(studio.pricing.halfDay)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Full day</dt>
                  <dd className="mt-1 font-mono tabular-nums">{formatInr(studio.pricing.fullDay)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <table className="mt-8 hidden w-full text-left text-sm md:table">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3 font-medium">Studio</th>
              <th className="py-3 font-medium">Hourly</th>
              <th className="py-3 font-medium">Half day</th>
              <th className="py-3 font-medium">Full day</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio.slug} className="border-b border-border">
                <td className="py-4 font-display text-xl tracking-[-0.03em]">{studio.name}</td>
                <td className="py-4 font-mono tabular-nums">{hourly(studio)}</td>
                <td className="py-4 font-mono tabular-nums">{formatInr(studio.pricing.halfDay)}</td>
                <td className="py-4 font-mono tabular-nums">{formatInr(studio.pricing.fullDay)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8">
          <QuoteDrawer triggerVariant="default" />
        </div>
      </div>
    </>
  );
}
