export type ShootType =
  | "podcast"
  | "ad-film"
  | "product"
  | "interview"
  | "event"
  | "music-video"
  | "workshop"
  | "reels";

export type MustHave =
  | "ac"
  | "indoor"
  | "outdoor"
  | "green-screen"
  | "cyclorama"
  | "parking"
  | "sound-treated";

export type SampleSpec = { label: string; value: string; isSample: true };

export type Studio = {
  slug: string;
  name: string;
  index: string;
  summary: string;
  description: string;
  suitability: string;
  swatch: string;
  features: MustHave[];
  shootTypes: ShootType[];
  useCases: string[];
  facilities: string[];
  amenities: string[];
  equipment: string[];
  setups?: { id: string; name: string; summary: string; productionTypes: string[] }[];
  specs: SampleSpec[];
  floor: { widthM: number; depthM: number; doorM: number; zones: string[]; isSample: true };
  pricing: {
    hourly: number;
    halfDay: number;
    fullDay: number;
    rangeHourly: [number, number];
    popular?: boolean;
    includes: string[];
    isSample: true;
  };
  relatedServices: string[];
};

const sampleSpecs = (
  size: string,
  height: string,
  power: string,
  door: string,
  floor: string,
  sound: string,
): SampleSpec[] => [
  { label: "Size", value: size, isSample: true },
  { label: "Ceiling height", value: height, isSample: true },
  { label: "Power", value: power, isSample: true },
  { label: "Door / entry width", value: door, isSample: true },
  { label: "Floor type", value: floor, isSample: true },
  { label: "Air conditioning", value: "Available", isSample: true },
  { label: "Parking", value: "On-site parking", isSample: true },
  { label: "Soundproofing", value: sound, isSample: true },
  { label: "Wi-Fi", value: "Studio Wi-Fi", isSample: true },
];

export const studios: Studio[] = [
  {
    slug: "empty-studio",
    name: "Empty Studio Space",
    index: "01",
    summary: "Large blank production floor",
    description:
      "A large blank production floor for builds, commercials and shoots that need an open indoor space.",
    suitability: "Ad films, product shoots, corporate production and set builds.",
    swatch: "from-zinc-500 to-stone-800",
    features: ["ac", "indoor", "parking"],
    shootTypes: ["ad-film", "product", "event", "music-video", "reels", "workshop"],
    useCases: ["Ad films", "Product shoots", "Corporate production", "Music videos", "Brand campaigns"],
    facilities: ["Open floor", "Power access", "Air conditioning", "Parking"],
    amenities: ["Air conditioning", "Parking", "Production access", "Hygiene"],
    equipment: ["Lighting and grip", "Camera and lens rental", "On-ground coordination"],
    specs: sampleSpecs("2,400 sq ft", "18 ft", "63A", "8 ft", "Sealed concrete", "Basic isolation"),
    floor: { widthM: 24, depthM: 16, doorM: 2.4, zones: ["Open floor", "Entry"], isSample: true },
    pricing: {
      hourly: 4500,
      halfDay: 18000,
      fullDay: 32000,
      rangeHourly: [4000, 6000],
      includes: ["AC", "Power", "Parking", "Wi-Fi"],
      isSample: true,
    },
    relatedServices: ["film-commercial-production", "agency-production-support"],
  },
  {
    slug: "green-screen-studio",
    name: "Green Screen Studio",
    index: "02",
    summary: "Chroma key",
    description: "A chroma key studio for composites, explainers and commercial plates.",
    suitability: "Ad films, training videos, news shows and product shoots that need a keyed background.",
    swatch: "from-emerald-500 to-green-900",
    features: ["ac", "indoor", "green-screen", "parking"],
    shootTypes: ["ad-film", "product", "interview", "reels", "workshop"],
    useCases: ["Ad films", "Training videos", "News shows", "Product shoots"],
    facilities: ["Green screen", "Even lighting grid", "Air conditioning"],
    amenities: ["Air conditioning", "Parking", "Wi-Fi"],
    equipment: ["Lighting and grip", "Camera and lens rental"],
    specs: sampleSpecs("1,200 sq ft", "14 ft", "32A", "6 ft", "Painted cyc floor", "Treated walls"),
    floor: { widthM: 14, depthM: 10, doorM: 1.8, zones: ["Green wall", "Entry"], isSample: true },
    pricing: {
      hourly: 5500,
      halfDay: 22000,
      fullDay: 38000,
      rangeHourly: [5000, 7000],
      popular: true,
      includes: ["AC", "Power", "Parking", "Wi-Fi"],
      isSample: true,
    },
    relatedServices: ["film-commercial-production", "creator-influencer-studio"],
  },
  {
    slug: "the-house-setup",
    name: "The House Setup",
    index: "03",
    summary: "Bedroom, living room, kitchen and dining environments",
    description:
      "Ready house environments: bedroom, living room, kitchen and dining area for narrative and lifestyle shoots.",
    suitability: "Short films, ads, interviews and lifestyle content that need a home setting.",
    swatch: "from-amber-400 to-orange-900",
    features: ["ac", "indoor", "parking"],
    shootTypes: ["ad-film", "interview", "music-video", "reels", "product"],
    useCases: ["Ad films", "Short films", "Interviews", "YouTube", "Reels"],
    facilities: ["Bedroom", "Living room", "Kitchen", "Dining area"],
    amenities: ["Air conditioning", "Parking", "Set customisation"],
    equipment: ["Art direction", "Set customisation", "Lighting and grip"],
    setups: [
      { id: "bedroom", name: "Bedroom", summary: "A dressed bedroom environment.", productionTypes: ["Ad films", "Short films", "Reels"] },
      { id: "living-room", name: "Living room", summary: "A living room for interviews and lifestyle scenes.", productionTypes: ["Interviews", "Ad films", "YouTube"] },
      { id: "kitchen", name: "Kitchen", summary: "A kitchen for product and lifestyle shoots.", productionTypes: ["Product shoots", "Ad films", "Reels"] },
      { id: "dining", name: "Dining area", summary: "A dining setup for conversation and food scenes.", productionTypes: ["Interviews", "Brand campaigns"] },
    ],
    specs: sampleSpecs("1,800 sq ft", "12 ft", "32A", "6 ft", "Timber and tile", "Room treatment"),
    floor: { widthM: 18, depthM: 12, doorM: 1.6, zones: ["Bedroom", "Living", "Kitchen", "Dining"], isSample: true },
    pricing: {
      hourly: 6000,
      halfDay: 24000,
      fullDay: 42000,
      rangeHourly: [5500, 8000],
      includes: ["AC", "Power", "Parking", "Wi-Fi"],
      isSample: true,
    },
    relatedServices: ["film-commercial-production", "creator-influencer-studio"],
  },
  {
    slug: "white-cyclorama",
    name: "White Cyclorama Setup",
    index: "04",
    summary: "Seamless white cyc",
    description: "A seamless white cyclorama for product, fashion and commercial plates.",
    suitability: "Product shoots, ad films and brand campaigns that need a clean white background.",
    swatch: "from-zinc-100 to-zinc-400",
    features: ["ac", "indoor", "cyclorama", "parking"],
    shootTypes: ["product", "ad-film", "reels", "music-video"],
    useCases: ["Product shoots", "Ad films", "Brand campaigns", "TVC/DVC"],
    facilities: ["Seamless white cyc", "Cove", "Lighting grid"],
    amenities: ["Air conditioning", "Parking", "Hygiene"],
    equipment: ["Lighting and grip", "Camera and lens rental"],
    specs: sampleSpecs("1,600 sq ft", "16 ft", "63A", "8 ft", "White cove", "Treated"),
    floor: { widthM: 16, depthM: 12, doorM: 2.4, zones: ["Cyc curve", "Entry"], isSample: true },
    pricing: {
      hourly: 7000,
      halfDay: 28000,
      fullDay: 48000,
      rangeHourly: [6000, 9000],
      includes: ["AC", "Power", "Parking", "Wi-Fi"],
      isSample: true,
    },
    relatedServices: ["film-commercial-production", "agency-production-support"],
  },
  {
    slug: "podcast-setup",
    name: "Podcast Setup",
    index: "05",
    summary: "Podcast and interview space",
    description: "A podcast and interview setup for conversations, YouTube and audio-led shows.",
    suitability: "Podcasts, interviews and talk-format content.",
    swatch: "from-violet-500 to-zinc-900",
    features: ["ac", "indoor", "parking", "sound-treated"],
    shootTypes: ["podcast", "interview", "reels", "workshop"],
    useCases: ["Podcasts", "Interviews", "YouTube", "Training videos"],
    facilities: ["Seating", "Acoustic treatment", "Recording support"],
    amenities: ["Air conditioning", "Parking", "Sound equipment"],
    equipment: ["Sound equipment", "Recording", "Lighting and grip"],
    specs: sampleSpecs("600 sq ft", "10 ft", "16A", "4 ft", "Carpet", "Sound-treated"),
    floor: { widthM: 8, depthM: 7, doorM: 1.2, zones: ["Desk", "Entry"], isSample: true },
    pricing: {
      hourly: 3500,
      halfDay: 14000,
      fullDay: 24000,
      rangeHourly: [3000, 4500],
      includes: ["AC", "Power", "Parking", "Wi-Fi"],
      isSample: true,
    },
    relatedServices: ["creator-influencer-studio", "education-seminar-workshop"],
  },
  {
    slug: "garden-area",
    name: "Garden Area",
    index: "06",
    summary: "Outdoor",
    description: "An outdoor garden area for cultural shoots, songs, events and natural-light scenes.",
    suitability: "Songs, cultural shoots, events and outdoor interviews.",
    swatch: "from-lime-500 to-emerald-900",
    features: ["outdoor", "parking"],
    shootTypes: ["music-video", "event", "interview", "reels", "ad-film"],
    useCases: ["Songs", "Cultural shoots", "Events", "Music videos"],
    facilities: ["Garden paths", "Natural light", "Outdoor power access"],
    amenities: ["Parking", "Production access"],
    equipment: ["Lighting and grip", "On-ground coordination"],
    specs: sampleSpecs("3,000 sq ft", "Open sky", "16A outdoor", "Open entry", "Garden ground", "Open air"),
    floor: { widthM: 28, depthM: 18, doorM: 3, zones: ["Garden", "Entry"], isSample: true },
    pricing: {
      hourly: 4000,
      halfDay: 16000,
      fullDay: 28000,
      rangeHourly: [3500, 5500],
      includes: ["Power", "Parking"],
      isSample: true,
    },
    relatedServices: ["event-corporate-space", "film-commercial-production"],
  },
  {
    slug: "lawn-area",
    name: "Lawn Area",
    index: "07",
    summary: "Outdoor",
    description: "An outdoor lawn for events, workshops and wide production setups.",
    suitability: "Events, workshops, brand campaigns and outdoor production.",
    swatch: "from-green-400 to-teal-900",
    features: ["outdoor", "parking"],
    shootTypes: ["event", "workshop", "ad-film", "music-video", "reels"],
    useCases: ["Events", "Workshops", "Brand campaigns", "Corporate production"],
    facilities: ["Open lawn", "Event layout", "Parking nearby"],
    amenities: ["Parking", "Professional management"],
    equipment: ["Logistics", "On-ground coordination", "Lighting and grip"],
    specs: sampleSpecs("8,000 sq ft", "Open sky", "32A outdoor", "Vehicle access", "Lawn", "Open air"),
    floor: { widthM: 40, depthM: 24, doorM: 4, zones: ["Lawn", "Entry"], isSample: true },
    pricing: {
      hourly: 8000,
      halfDay: 32000,
      fullDay: 55000,
      rangeHourly: [7000, 10000],
      includes: ["Power", "Parking"],
      isSample: true,
    },
    relatedServices: ["event-corporate-space", "education-seminar-workshop"],
  },
];

export function getStudio(slug: string) {
  return studios.find((studio) => studio.slug === slug);
}

export const shootOptions: { id: ShootType; label: string }[] = [
  { id: "podcast", label: "Podcast" },
  { id: "ad-film", label: "Ad film" },
  { id: "product", label: "Product" },
  { id: "interview", label: "Interview" },
  { id: "event", label: "Event" },
  { id: "music-video", label: "Music video" },
  { id: "workshop", label: "Workshop" },
  { id: "reels", label: "Reels" },
];

export const mustOptions: { id: MustHave; label: string }[] = [
  { id: "ac", label: "AC" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "green-screen", label: "Green screen" },
  { id: "cyclorama", label: "Cyclorama" },
  { id: "parking", label: "Parking" },
  { id: "sound-treated", label: "Sound-treated" },
];
