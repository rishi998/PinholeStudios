export type PinholeAsset = {
  id: string;
  title: string;
  category: "branding" | "studio" | "service" | "portfolio" | "video" | "virtual-tour";
  localPath?: string;
  sourceUrl: string;
  mimeType: string;
  alt: string;
  pageUrl: string;
  studioSlug?: string;
  provider?: string;
  embedUrl?: string;
};

const base = "https://pinholestudio.in/wp-content/uploads";

export const pinholeLogo = "/media/custom/branding/logo.png";
export const pinholeFavicon = "/media/custom/branding/favicon.png";
export const showreel = "/media/custom/homepage/showreel.mp4";
export const aboutPhoto = "/media/custom/homepage/about.jpg";

export const studioPhotos: Record<string, { src: string; alt: string }[]> = {
  "empty-studio": [
    { src: "/media/custom/studios/empty-studio/01.jpg", alt: "Empty studio floor at Pinhole Studio" },
    { src: "/media/custom/studios/empty-studio/02.jpg", alt: "Open production floor" },
    { src: "/media/custom/studios/empty-studio/03.jpg", alt: "Empty studio space" },
    { src: "/media/custom/studios/empty-studio/04.jpg", alt: "Wide view of the empty studio" },
  ],
  "green-screen-studio": [
    { src: "/media/custom/studios/green-screen-studio/01.jpg", alt: "Green screen studio" },
    { src: "/media/custom/studios/green-screen-studio/02.jpg", alt: "Green screen bay" },
    { src: "/media/custom/studios/green-screen-studio/03.jpg", alt: "Chroma setup" },
    { src: "/media/custom/studios/green-screen-studio/04.jpg", alt: "Green cyclorama" },
  ],
  "the-house-setup": [
    { src: "/media/custom/studios/the-house-setup/01.jpg", alt: "House setup at Pinhole Studio" },
    { src: "/media/custom/studios/the-house-setup/02.jpg", alt: "Bedroom set" },
    { src: "/media/custom/studios/the-house-setup/03.jpg", alt: "Kitchen set" },
    { src: "/media/custom/studios/the-house-setup/04.jpg", alt: "House interior" },
  ],
  "white-cyclorama": [
    { src: "/media/custom/studios/white-cyclorama/01.jpg", alt: "White cyclorama" },
    { src: "/media/custom/studios/white-cyclorama/02.jpg", alt: "White cove studio" },
  ],
  "podcast-setup": [
    { src: "/media/custom/studios/podcast-setup/01.png", alt: "Podcast setup" },
    { src: "/media/custom/studios/podcast-setup/02.png", alt: "Podcast room" },
    { src: "/media/custom/studios/podcast-setup/03.png", alt: "Podcast seating" },
  ],
  "garden-area": [
    { src: "/media/custom/studios/garden-area/01.jpg", alt: "Garden area" },
    { src: "/media/custom/studios/garden-area/02.jpg", alt: "Garden set" },
    { src: "/media/custom/studios/garden-area/03.jpg", alt: "Outdoor garden" },
    { src: "/media/custom/studios/garden-area/04.jpg", alt: "Garden seating" },
  ],
  "lawn-area": [
    { src: "/media/custom/studios/lawn-area/01.jpg", alt: "Lawn area" },
    { src: "/media/custom/studios/lawn-area/02.jpg", alt: "Lawn at Pinhole Studio" },
    { src: "/media/custom/studios/lawn-area/03.jpg", alt: "Outdoor lawn" },
    { src: "/media/custom/studios/lawn-area/04.jpg", alt: "Lawn gathering space" },
  ],
};

export const portfolioPhotos = [
  "/media/custom/portfolio/01.jpg",
  "/media/custom/portfolio/02.jpg",
  "/media/custom/portfolio/03.jpg",
  "/media/custom/portfolio/04.jpg",
  "/media/custom/portfolio/05.jpg",
  "/media/custom/portfolio/06.jpg",
];

export const serviceArt: Record<string, { src: string; alt: string }> = {
  "event-corporate-space": { src: "/media/custom/services/event-rate-card.png", alt: "Event and product launch rate card" },
  "education-seminar-workshop": { src: "/media/custom/services/education-rate-card.png", alt: "Education and workshop rate card" },
  "creator-influencer-studio": { src: "/media/custom/services/creator-rate-card.png", alt: "Creator and influencer rate card" },
  "agency-production-support": { src: "/media/custom/services/agency-rate-card.png", alt: "Agency production rate card" },
};

export const pinholeAssets: PinholeAsset[] = [
  {
    id: "logo",
    title: "Pinhole Studio logo",
    category: "branding",
    localPath: pinholeLogo,
    sourceUrl: `${base}/2026/02/Logo-Pinhole.png`,
    mimeType: "image/png",
    alt: "Pinhole Studio",
    pageUrl: "https://pinholestudio.in/",
  },
  {
    id: "favicon",
    title: "Pinhole Studio favicon",
    category: "branding",
    localPath: pinholeFavicon,
    sourceUrl: `${base}/2026/02/Pinhole-Studio-Favicon.png`,
    mimeType: "image/png",
    alt: "Pinhole Studio icon",
    pageUrl: "https://pinholestudio.in/",
  },
  {
    id: "showreel",
    title: "Pinhole Studio showreel",
    category: "video",
    localPath: showreel,
    sourceUrl: `${base}/2026/03/pinhole-studio-video.mp4`,
    mimeType: "video/mp4",
    alt: "Pinhole Studio showreel",
    pageUrl: "https://pinholestudio.in/",
  },
  {
    id: "recce",
    title: "360 recce",
    category: "virtual-tour",
    sourceUrl: "https://app.cloudpano.com/tours/WB5YSd4dWBak?sceneId=hVMu_wGjCM",
    mimeType: "text/html",
    alt: "360 tour of Pinhole Studio",
    pageUrl: "https://pinholestudio.in/",
    provider: "CloudPano",
    embedUrl: "https://app.cloudpano.com/tours/WB5YSd4dWBak?sceneId=hVMu_wGjCM",
  },
];
