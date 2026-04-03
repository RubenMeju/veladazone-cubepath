import type { Metadata } from "next";
import { FantasyPageClient } from "./FantasyPageClient";

export const metadata: Metadata = {
  title: "Fantasy League · La Velada del Año 6",
  description:
    "Crea o únete a una liga privada, compite con tus amigos prediciendo los ganadores de La Velada del Año 6.",
  alternates: {
    canonical: "https://laveladazone.com/fantasy",
  },
  openGraph: {
    title: "Fantasy League · La Velada del Año 6",
    description:
      "Crea o únete a una liga privada y compite con tus amigos en La Velada del Año 6.",
    url: "https://laveladazone.com/fantasy",
    siteName: "VeladaZone",
    type: "website",
    images: [
      {
        url: "https://laveladazone.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fantasy League · VeladaZone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantasy League · La Velada del Año 6",
    description:
      "Crea o únete a una liga privada y compite con tus amigos en La Velada del Año 6.",
    images: ["https://laveladazone.com/og-image.png"],
  },
};

export default function FantasyPage() {
  return <FantasyPageClient />;
}
