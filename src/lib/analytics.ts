type TrackParams = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
};

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push({ event, ...params });

  if (process.env.NEXT_PUBLIC_META_PIXEL_ID && analyticsWindow.fbq) {
    analyticsWindow.fbq("trackCustom", event, params);
  }
}
