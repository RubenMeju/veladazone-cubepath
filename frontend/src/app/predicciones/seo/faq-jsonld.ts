/**
 * faq-jsonld.ts
 * ─────────────────────────────────────────────────────────────────
 * Schema FAQPage para /predicciones.
 * Genera rich snippets con preguntas desplegables en Google,
 * aumentando visibilidad y CTR.
 * Spec: https://schema.org/FAQPage
 * ─────────────────────────────────────────────────────────────────
 */

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuándo es La Velada del Año 6?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Velada del Año 6 se celebra el 25 de julio de 2026 en el Estadio de La Cartuja, Sevilla. El evento comienza aproximadamente a las 21:00 (hora española).",
      },
    },
    {
      "@type": "Question",
      name: "¿Quién pelea en La Velada del Año 6?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Velada del Año 6 cuenta con 10 combates: IlloJuan vs TheGrefg (main event), YoSoyPlex vs Fernanfloo, Samy Rivers vs RoRo (main event femenino), Gero Arias vs ByViruzz, Marta Díaz vs Tatiana Kaer, Alondrissa vs Angie Velasco, Lit Killah vs Kidd Keo, Clersss vs Natalia MX, Fabiana Sevillano vs La Parce, y Edu Aguirre vs Gastón Edul.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funcionan las predicciones de VeladaZone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En VeladaZone puedes elegir el ganador de cada combate de La Velada del Año 6 antes de que empiece el evento. Tus predicciones se comparan con las de toda la comunidad y acumulas puntos según los resultados reales. Puedes ver tu posición en el ranking global.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde ver La Velada del Año 6?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Velada del Año 6 se emite gratis en directo en los canales de Twitch, YouTube y TikTok de Ibai Llanos el 25 de julio de 2026.",
      },
    },
  ],
} as const;
