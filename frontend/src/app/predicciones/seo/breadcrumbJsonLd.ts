/**
 * breadcrumb-jsonld.ts
 * ─────────────────────────────────────────────────────────────────
 * Schema BreadcrumbList para /predicciones.
 * Google muestra "VeladaZone > Predicciones" en el resultado
 * de búsqueda, mejorando el CTR.
 * ─────────────────────────────────────────────────────────────────
 */

import { PAGE_URL } from "./metadata";

export const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "VeladaZone",
      item: "https://laveladazone.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Predicciones",
      item: PAGE_URL,
    },
  ],
} as const;
