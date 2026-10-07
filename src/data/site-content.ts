// SAMPLE values below are placeholders until the client supplies official numbers, copy and assets.

export const siteStats = [
  { label: "Hours booked", value: 12400, suffix: "", isSample: true as const },
  { label: "Customer satisfaction", value: 96, suffix: "%", isSample: true as const },
  { label: "Awards & recognition", value: 12, suffix: "", isSample: true as const },
  { label: "Clients served", value: 340, suffix: "", isSample: true as const },
];

export const googleRating = { score: "4.8", count: "120", isSample: true as const, url: "" };

export const namedReviewers = ["Laksh Sharma", "Yashasvi Sharan", "Sachin Goel", "Anil Sansanwal", "Rohit Rawat"];

export const sampleReviews = [
  { id: "r1", author: "Sample reviewer", text: "Sample review. Replace with the client's approved testimonial.", studio: "podcast-setup", isSample: true as const },
  { id: "r2", author: "Sample reviewer", text: "Sample review about a smooth shoot day. Not a real client quote.", studio: "green-screen-studio", isSample: true as const },
  { id: "r3", author: "Sample reviewer", text: "Sample review about the house setups. Pending official text.", studio: "the-house-setup", isSample: true as const },
  { id: "r4", author: "Sample reviewer", text: "Sample review about the cyclorama. Pending official text.", studio: "white-cyclorama", isSample: true as const },
  { id: "r5", author: "Sample reviewer", text: "Sample review about an outdoor event. Pending official text.", studio: "lawn-area", isSample: true as const },
  { id: "r6", author: "Sample reviewer", text: "Sample review about the empty floor. Pending official text.", studio: "empty-studio", isSample: true as const },
];

export const partners = ["Northwind", "Lumen", "Atelier", "Fieldnote", "Kinetic", "Harbor"].map((name) => ({
  name,
  isSample: true as const,
}));

export const faqs = [
  { q: "How do I enquire?", a: "Use Plan my shoot, the contact form, or Chat on WhatsApp. Every enquiry opens a WhatsApp chat with the studio team." },
  { q: "Do I pay online?", a: "No online payment is taken on this site. Booking confirmation happens on WhatsApp." },
  { q: "Which studio should I pick?", a: "Use the studio finder on the Studios page, or ask on WhatsApp and the team will suggest a space." },
];

export const policyTopics = [
  "Shoot duration",
  "Overtime",
  "Payment",
  "Cancellation",
  "Equipment",
  "Property damage",
  "Events",
  "Licensing",
  "Special effects",
  "Technical requirements",
] as const;

export const policies = [
  { slug: "booking-terms", title: "Booking T&C" },
  { slug: "events-terms", title: "Events T&C" },
  { slug: "shoot-production-policy", title: "Shoot / Production P&P" },
  { slug: "event-policy", title: "Event P&P" },
] as const;

export const workCategories = [
  "All",
  "Events",
  "Empty Studio",
  "Green Screen",
  "House Setup",
  "Cyclorama",
  "Podcast",
  "Garden",
  "Lawn",
] as const;

export const workItems = [
  { id: "w1", title: "Sample event film", category: "Events", kind: "video" as const, vimeoId: "76979871", isSample: true as const },
  { id: "w2", title: "Sample empty floor", category: "Empty Studio", kind: "photo" as const, isSample: true as const },
  { id: "w3", title: "Sample chroma spot", category: "Green Screen", kind: "video" as const, vimeoId: "76979871", isSample: true as const },
  { id: "w4", title: "Sample house scene", category: "House Setup", kind: "instagram" as const, isSample: true as const },
  { id: "w5", title: "Sample cyc still", category: "Cyclorama", kind: "photo" as const, isSample: true as const },
  { id: "w6", title: "Sample podcast", category: "Podcast", kind: "video" as const, vimeoId: "76979871", isSample: true as const },
  { id: "w7", title: "Sample garden", category: "Garden", kind: "instagram" as const, isSample: true as const },
  { id: "w8", title: "Sample lawn event", category: "Lawn", kind: "photo" as const, isSample: true as const },
  { id: "w9", title: "Sample podcast still", category: "Podcast", kind: "photo" as const, isSample: true as const },
];

export const addons = [
  { id: "camera", label: "Camera & lens", price: 2500 },
  { id: "lights", label: "Lighting & grip", price: 3500 },
  { id: "sound", label: "Sound", price: 2000 },
  { id: "crew", label: "Crew", price: 4000 },
  { id: "art", label: "Art direction", price: 5000 },
  { id: "set", label: "Set customisation", price: 4500 },
] as const;

export const pricingMode = "exact" as "exact" | "range";

export function showSampleBadge() {
  return process.env.NEXT_PUBLIC_SAMPLE_DATA_BADGE !== "false";
}
