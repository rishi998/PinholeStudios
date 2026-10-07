export const services = [
  {
    slug: "film-commercial-production",
    name: "Film & Commercial Production",
    summary: "Space for film and commercial production",
    audience: "A production house",
    description: "Studios and indoor/outdoor locations for ad films, documentaries, short films, TVC/DVC and OTT production.",
    useCases: ["Ad films", "Documentaries", "Short films", "TVC/DVC", "OTT production", "Music videos"],
    studios: ["empty-studio", "green-screen-studio", "the-house-setup", "white-cyclorama", "garden-area"],
  },
  {
    slug: "event-corporate-space",
    name: "Event & Corporate Production Space",
    summary: "Event-ready and corporate production space",
    audience: "Planning an event",
    description: "Event-ready indoor floors and outdoor lawn and garden areas for corporate production and gatherings.",
    useCases: ["Events", "Corporate production", "Brand campaigns"],
    studios: ["lawn-area", "garden-area", "empty-studio"],
  },
  {
    slug: "education-seminar-workshop",
    name: "Education, Seminar & Workshop Space",
    summary: "Space for education, seminars and workshops",
    audience: "Running a workshop",
    description: "Spaces for seminars, workshops and training videos, with indoor rooms and the outdoor lawn.",
    useCases: ["Workshops", "Seminars", "Training videos"],
    studios: ["podcast-setup", "empty-studio", "lawn-area"],
  },
  {
    slug: "creator-influencer-studio",
    name: "Content Creator & Influencer Studio",
    summary: "Studio space for creators and influencers",
    audience: "A creator",
    description: "Podcast, house and chroma setups for YouTube, Reels and influencer content.",
    useCases: ["YouTube", "Reels", "Influencer content", "Podcasts"],
    studios: ["podcast-setup", "the-house-setup", "green-screen-studio"],
  },
  {
    slug: "agency-production-support",
    name: "Agency & Production House Support",
    summary: "Support space for agencies and production houses",
    audience: "An agency",
    description: "Floor space, cyclorama and crew support for agencies and production houses.",
    useCases: ["Brand campaigns", "Ad films", "Product shoots"],
    studios: ["empty-studio", "white-cyclorama", "green-screen-studio"],
  },
] as const;

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const equipmentSupport = [
  "Camera and lens rental",
  "Lighting and grip",
  "Sound equipment",
  "Recording",
  "Professional crew",
  "Technicians",
  "Art direction",
  "Set customisation",
  "On-ground coordination",
  "Logistics",
] as const;

export const advantages = [
  "Large studio floors",
  "Event-ready spaces",
  "House setups",
  "Indoor and outdoor sets",
  "Podcast and content spaces",
  "Camera, lighting and sound availability",
  "Air conditioning",
  "Parking",
  "Production access",
  "Hygiene",
  "Professional management",
] as const;

export const useCases = [
  "Ad films",
  "Documentaries",
  "Short films",
  "News shows",
  "Training videos",
  "Product shoots",
  "Songs",
  "Interviews",
  "Cultural shoots",
  "TVC/DVC",
  "OTT production",
  "Music videos",
  "Corporate production",
  "Podcasts",
  "Influencer content",
  "YouTube",
  "Reels",
  "Events",
  "Workshops",
  "Seminars",
  "Brand campaigns",
] as const;
