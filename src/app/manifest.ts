import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pinhole Studio",
    short_name: "Pinhole",
    description: "Studio and production space in Kapashera Estate, New Delhi.",
    start_url: "/",
    display: "standalone",
    background_color: "#14110c",
    theme_color: "#1c1c1c",
  };
}
