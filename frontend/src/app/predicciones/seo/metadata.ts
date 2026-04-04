/**
 * metadata.ts
 * ─────────────────────────────────────────────────────────────────
 * Metadata y constantes SEO de la página /predicciones.
 * ─────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";

export const PAGE_URL = "https://laveladazone.com/predicciones";
export const OG_IMAGE = "https://laveladazone.com/og-image.png";

export const TITLE = "Predicciones La Velada del Año 6 — Elige tus ganadores";

export const DESCRIPTION =
  "Haz tus predicciones para La Velada del Año 6: elige el ganador de cada combate, compite con miles de usuarios y sube en el ranking global. IlloJuan vs TheGrefg, Fernanfloo vs YoSoyPlex y más.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,

    alternates: {
      canonical: PAGE_URL,
    },

    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: PAGE_URL,
      siteName: "VeladaZone",
      locale: "es_ES",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Predicciones La Velada del Año 6 — VeladaZone",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}
