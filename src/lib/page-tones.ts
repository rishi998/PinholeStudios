export type PageTone = Record<string, string>;

const pages = {
  home: 85,
  about: 155,
  studios: 250,
  services: 15,
  work: 310,
  pricing: 75,
  availability: 195,
  contact: 50,
  demo: 265,
  plan: 130,
  recce: 40,
  auth: 220,
  account: 230,
  admin: 280,
  policies: 60,
} as const;

type PageKey = keyof typeof pages;

function lightTone(hue: number): PageTone {
  return {
    "--background": `oklch(0.95 0.034 ${hue})`,
    "--foreground": `oklch(0.27 0.04 ${hue})`,
    "--card": `oklch(0.985 0.012 ${hue})`,
    "--card-foreground": `oklch(0.27 0.04 ${hue})`,
    "--popover": `oklch(0.99 0.01 ${hue})`,
    "--popover-foreground": `oklch(0.27 0.04 ${hue})`,
    "--muted": `oklch(0.92 0.022 ${hue})`,
    "--muted-foreground": `oklch(0.42 0.03 ${hue})`,
    "--secondary": `oklch(0.92 0.022 ${hue})`,
    "--secondary-foreground": `oklch(0.27 0.04 ${hue})`,
    "--accent": `oklch(0.9 0.03 ${hue})`,
    "--accent-foreground": `oklch(0.27 0.04 ${hue})`,
    "--border": `oklch(0.27 0.04 ${hue} / 14%)`,
    "--glass-bg": `oklch(0.97 0.02 ${hue} / 84%)`,
    "--glass-border": `oklch(0.27 0.04 ${hue} / 14%)`,
    "--text-soft": `oklch(0.38 0.03 ${hue})`,
    "--text-muted": `oklch(0.45 0.03 ${hue})`,
    "--bg-0": `oklch(0.95 0.034 ${hue})`,
  };
}

function darkTone(hue: number): PageTone {
  return {
    "--background": `oklch(0.24 0.045 ${hue})`,
    "--foreground": `oklch(0.96 0.015 ${hue})`,
    "--card": `oklch(0.3 0.04 ${hue})`,
    "--card-foreground": `oklch(0.96 0.015 ${hue})`,
    "--popover": `oklch(0.32 0.04 ${hue})`,
    "--popover-foreground": `oklch(0.96 0.015 ${hue})`,
    "--muted": `oklch(0.33 0.035 ${hue})`,
    "--muted-foreground": `oklch(0.82 0.02 ${hue})`,
    "--secondary": `oklch(0.33 0.035 ${hue})`,
    "--secondary-foreground": `oklch(0.96 0.015 ${hue})`,
    "--accent": `oklch(0.36 0.04 ${hue})`,
    "--accent-foreground": `oklch(0.96 0.015 ${hue})`,
    "--border": `oklch(0.96 0.02 ${hue} / 14%)`,
    "--glass-bg": `oklch(0.26 0.04 ${hue} / 84%)`,
    "--glass-border": `oklch(0.96 0.02 ${hue} / 14%)`,
    "--text-soft": `oklch(0.86 0.02 ${hue})`,
    "--text-muted": `oklch(0.76 0.02 ${hue})`,
    "--bg-0": `oklch(0.24 0.045 ${hue})`,
  };
}

const light = Object.fromEntries(Object.entries(pages).map(([key, hue]) => [key, lightTone(hue)])) as Record<PageKey, PageTone>;
const dark = Object.fromEntries(Object.entries(pages).map(([key, hue]) => [key, darkTone(hue)])) as Record<PageKey, PageTone>;

function pageKey(pathname: string): PageKey {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/account")) return "account";
  if (pathname.startsWith("/studios")) return "studios";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/stories") || pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/policies")) return "policies";
  if (pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) return "auth";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/pricing")) return "pricing";
  if (pathname.startsWith("/availability")) return "availability";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/demo")) return "demo";
  if (pathname.startsWith("/plan-my-shoot")) return "plan";
  if (pathname.startsWith("/recce")) return "recce";
  return "home";
}

export function toneFor(pathname: string, darkMode: boolean) {
  const key = pageKey(pathname);
  return darkMode ? dark[key] : light[key];
}
