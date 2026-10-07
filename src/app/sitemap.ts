import type { MetadataRoute } from "next";

import { policies } from "@/data/site-content";
import { services } from "@/data/services";
import { studios } from "@/data/studios";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "",
    "/about",
    "/studios",
    "/services",
    "/work",
    "/recce",
    "/pricing",
    "/availability",
    "/plan-my-shoot",
    "/contact",
    ...studios.map((studio) => `/studios/${studio.slug}`),
    ...services.map((service) => `/services/${service.slug}`),
    ...policies.map((policy) => `/policies/${policy.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
