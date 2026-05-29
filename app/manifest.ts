import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PTK Songbook",
    short_name: "Songbook",
    description: "Lagu pujian dan penyembahan gereja",
    start_url: "/",
    display: "standalone",
    background_color: "#ecfdf5",
    theme_color: "#0d9488",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
