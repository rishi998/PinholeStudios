export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || "";
  const local = !configured || configured.includes("localhost");

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (!local) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return configured || "http://localhost:3010";
}
