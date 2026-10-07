import { QuoteDrawer } from "@/components/features/quote-drawer";
import { PageIntro } from "@/components/layout/page-intro";
import { SampleBadge } from "@/components/ui/sample-badge";
import { studios } from "@/data/studios";
import { formatInr } from "@/lib/quote";
import { siteConfig } from "@/lib/site.config";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <PageIntro title="Pricing" lede="Sample rates until the studio confirms official numbers. The final quote is confirmed on WhatsApp." />
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16">
        <QuoteDrawer />
        <div className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-card">
              <tr>
                <th className="p-3">Studio</th>
                <th className="p-3">Hourly</th>
                <th className="p-3">Half day</th>
                <th className="p-3">Full day</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((studio) => (
                <tr key={studio.slug} className="border-t border-border">
                  <td className="p-3">{studio.name}</td>
                  <td className="p-3">{siteConfig.pricing.mode === "range" ? `${formatInr(studio.pricing.rangeHourly[0])}–${formatInr(studio.pricing.rangeHourly[1])}` : formatInr(studio.pricing.hourly)}</td>
                  <td className="p-3">{formatInr(studio.pricing.halfDay)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2">
                      {formatInr(studio.pricing.fullDay)}
                      <SampleBadge />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
