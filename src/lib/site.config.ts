export const siteConfig = {
  name: "Pinhole Studio",
  description:
    "A professional studio and production space with ready-to-use locations and production infrastructure for shoots, content creation and events.",
  address: {
    line: "Pinhole Studio Farm 57, Kapashera Estate, New Delhi, Delhi, 110097",
    mapsQuery: "Pinhole Studio Farm 57 Kapashera Estate New Delhi",
  },
  phones: [
    { display: "+91 85069 05757", tel: "+918506905757" },
    { display: "+91 99997 63457", tel: "+919999763457" },
    { display: "+91 98186 37485", tel: "+919818637485" },
  ],
  email: "pinholestudioz@gmail.com",
  social: {
    instagram: "",
    facebook: "",
  },
  visit: [
    { label: "About", href: "/about" },
    { label: "Studios", href: "/studios" },
    { label: "Work", href: "/work" },
    { label: "Pricing", href: "/pricing" },
  ],
  pricing: { mode: "exact" as "exact" | "range" },
  googleReviewsUrl: "",
  policies: [
    { label: "Booking T&C", href: "/policies/booking-terms" },
    { label: "Events T&C", href: "/policies/events-terms" },
    { label: "Shoot / Production P&P", href: "/policies/shoot-production-policy" },
    { label: "Event P&P", href: "/policies/event-policy" },
  ],
} as const;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address.mapsQuery)}`;
