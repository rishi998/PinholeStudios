import { services as serviceData } from "@/data/services";
import { studios as studioData } from "@/data/studios";

export const studios = studioData.map((studio) => ({
  name: studio.name,
  slug: studio.slug,
  summary: studio.summary,
  swatch: studio.swatch,
}));

export const services = serviceData.map((service) => ({
  name: service.name,
  slug: service.slug,
  summary: service.summary,
}));

export function enquiryMessageForPath(pathname: string) {
  const studio = studios.find((item) => pathname === `/studios/${item.slug}`);
  if (studio) {
    return `Hi Pinhole Studio, I'm interested in the ${studio.name}. Please share availability and rates.`;
  }
  const service = services.find((item) => pathname === `/services/${item.slug}`);
  if (service) {
    return `Hi, I'm looking for ${service.name}. Please share how Pinhole Studio can help.`;
  }
  return "Hi Pinhole Studio, I'd like to know more about your studios.";
}
