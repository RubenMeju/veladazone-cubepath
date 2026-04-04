/**
 * PrediccionesJsonLd.tsx
 * ─────────────────────────────────────────────────────────────────
 * Inyecta los scripts JSON-LD de /predicciones en el DOM (SSR).
 * Separado del page.tsx para mantenerlo limpio.
 *
 * Renderiza dos schemas independientes:
 *  - BreadcrumbList → ruta en el resultado de búsqueda
 *  - FAQPage        → preguntas desplegables en Google
 * ─────────────────────────────────────────────────────────────────
 */

import { breadcrumbJsonLd } from "@/app/predicciones/seo/breadcrumbJsonLd";
import { faqJsonLd } from "@/app/predicciones/seo/faq-jsonld";

export function PrediccionesJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
