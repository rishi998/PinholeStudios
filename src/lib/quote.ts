import { addons } from "@/data/site-content";
import { getStudio } from "@/data/studios";

export function estimateQuote(input: {
  studioSlug: string;
  mode: "hourly" | "half" | "full";
  hours: number;
  addonIds: string[];
}) {
  const studio = getStudio(input.studioSlug);
  if (!studio) return null;
  const base =
    input.mode === "hourly"
      ? studio.pricing.hourly * input.hours
      : input.mode === "half"
        ? studio.pricing.halfDay
        : studio.pricing.fullDay;
  const extra = addons.filter((item) => input.addonIds.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
  return { studio, base, extra, total: base + extra, isSample: true as const };
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
