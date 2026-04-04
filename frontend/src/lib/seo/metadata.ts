/**
 * metadata.ts
 * ─────────────────────────────────────────────────────────────────
 * Configuración de metadata y viewport de Next.js separados
 * del layout principal para mantenerlo limpio y legible.
 * ─────────────────────────────────────────────────────────────────
 */

import type { Metadata, Viewport } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://laveladazone.com"),

  title: {
    default: "VeladaZone — La Velada del Año 6",
    template: "%s | VeladaZone",
  },
  description:
    "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel. Login con Twitch.",

  alternates: {
    canonical: "https://laveladazone.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://laveladazone.com",
    siteName: "VeladaZone",
    locale: "es_ES",
    title: "VeladaZone — La Velada del Año 6",
    description:
      "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel.",
    images: [
      {
        url: "https://laveladazone.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "VeladaZone — La Velada del Año 6",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@VeladaZone",
    title: "VeladaZone — La Velada del Año 6",
    description:
      "Predice los ganadores de La Velada del Año 6, compite en el ranking global y comparte tu cartel.",
    images: ["https://laveladazone.com/og-image.png"],
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VeladaZone",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const siteViewport: Viewport = {
  themeColor: "#e63946",
  width: "device-width",
  initialScale: 1,
  // maximumScale eliminado: bloquear zoom penaliza accesibilidad en Lighthouse
};