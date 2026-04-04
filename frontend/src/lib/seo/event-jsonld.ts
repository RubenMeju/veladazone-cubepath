/**
 * event-jsonld.ts
 * ─────────────────────────────────────────────────────────────────
 * Datos estructurados JSON-LD para La Velada del Año 6.
 * Separados del layout para mantenerlo limpio.
 *
 * Tipo: SportsEvent (más específico que Event para Google)
 * Spec: https://schema.org/SportsEvent
 * ─────────────────────────────────────────────────────────────────
 */

export const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "La Velada del Año 6",
  "url": "https://laveladazone.com",
  "startDate": "2026-07-25T21:00:00+02:00",
  "endDate": "2026-07-26T01:00:00+02:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "image": "https://laveladazone.com/og-image.png",
  "description": "La Velada del Año 6: torneo de boxeo entre creadores de contenido organizado por Ibai Llanos en el Estadio de La Cartuja, Sevilla.",
  "performer": [
    { "@type": "Person", "name": "IlloJuan" },
    { "@type": "Person", "name": "TheGrefg" },
    { "@type": "Person", "name": "YoSoyPlex" },
    { "@type": "Person", "name": "Fernanfloo" },
    { "@type": "Person", "name": "Marta Díaz" },
    { "@type": "Person", "name": "Tatiana Kaer" },
    { "@type": "Person", "name": "Samy Rivers" },
    { "@type": "Person", "name": "RoRo" },
    { "@type": "Person", "name": "Gero Arias" },
    { "@type": "Person", "name": "ByViruzz" },
    { "@type": "Person", "name": "Alondrissa" },
    { "@type": "Person", "name": "Angie Velasco" },
    { "@type": "Person", "name": "Lit Killah" },
    { "@type": "Person", "name": "Kidd Keo" },
    { "@type": "Person", "name": "Clersss" },
    { "@type": "Person", "name": "Natalia MX" },
    { "@type": "Person", "name": "Fabiana Sevillano" },
    { "@type": "Person", "name": "La Parce" },
    { "@type": "Person", "name": "Edu Aguirre" },
    { "@type": "Person", "name": "Gastón Edul" }
  ],
  "location": {
    "@type": "Place",
    "name": "Estadio de La Cartuja",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Isla de La Cartuja",
      "addressLocality": "Sevilla",
      "postalCode": "41092",
      "addressCountry": "ES"
    }
  },
  "organizer": {
    "@type": "Person",
    "name": "Ibai Llanos",
    "url": "https://www.twitch.tv/ibai"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://laveladazone.com/entradas",
    "availability": "https://schema.org/SoldOut",
    "price": "10",
    "priceCurrency": "EUR",
    "validFrom": "2026-06-01T12:00:00+02:00"
  },
  "subEvent": [
    {
      "@type": "SportsEvent",
      "name": "Edu Aguirre vs Gastón Edul",
      "startDate": "2026-07-25T21:00:00+02:00",
      "endDate": "2026-07-25T21:45:00+02:00",
      "description": "Primer combate entre periodistas deportivos. España vs Argentina.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Edu Aguirre" },
        { "@type": "Person", "name": "Gastón Edul" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Edu Aguirre" },
        { "@type": "Person", "name": "Gastón Edul" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Fabiana Sevillano vs La Parce",
      "startDate": "2026-07-25T21:45:00+02:00",
      "endDate": "2026-07-25T22:30:00+02:00",
      "description": "Combate femenino. TikToker española contra streamer colombiana.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Fabiana Sevillano" },
        { "@type": "Person", "name": "La Parce" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Fabiana Sevillano" },
        { "@type": "Person", "name": "La Parce" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Clersss vs Natalia MX",
      "startDate": "2026-07-25T22:30:00+02:00",
      "endDate": "2026-07-25T23:00:00+02:00",
      "description": "Combate femenino entre creadoras de contenido.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Clersss" },
        { "@type": "Person", "name": "Natalia MX" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Clersss" },
        { "@type": "Person", "name": "Natalia MX" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Lit Killah vs Kidd Keo",
      "startDate": "2026-07-25T23:00:00+02:00",
      "endDate": "2026-07-25T23:45:00+02:00",
      "description": "Primer combate entre músicos de La Velada. Rapero argentino vs rapero español.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Lit Killah" },
        { "@type": "Person", "name": "Kidd Keo" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Lit Killah" },
        { "@type": "Person", "name": "Kidd Keo" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Alondrissa vs Angie Velasco",
      "startDate": "2026-07-25T23:45:00+02:00",
      "endDate": "2026-07-26T00:15:00+02:00",
      "description": "Combate femenino. Puerto Rico vs Argentina.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Alondrissa" },
        { "@type": "Person", "name": "Angie Velasco" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Alondrissa" },
        { "@type": "Person", "name": "Angie Velasco" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Gero Arias vs ByViruzz",
      "startDate": "2026-07-26T00:15:00+02:00",
      "endDate": "2026-07-26T00:45:00+02:00",
      "description": "Combate masculino. Campeón de Párense de Manos vs veterano de La Velada.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Gero Arias" },
        { "@type": "Person", "name": "ByViruzz" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Gero Arias" },
        { "@type": "Person", "name": "ByViruzz" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Marta Díaz vs Tatiana Kaer",
      "startDate": "2026-07-26T00:45:00+02:00",
      "endDate": "2026-07-26T01:15:00+02:00",
      "description": "Combate femenino entre dos de las influencers españolas más populares.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Marta Díaz" },
        { "@type": "Person", "name": "Tatiana Kaer" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Marta Díaz" },
        { "@type": "Person", "name": "Tatiana Kaer" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "Samy Rivers vs RoRo",
      "startDate": "2026-07-26T01:15:00+02:00",
      "endDate": "2026-07-26T01:45:00+02:00",
      "description": "Main event femenino. México vs España.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "Samy Rivers" },
        { "@type": "Person", "name": "RoRo" }
      ],
      "competitor": [
        { "@type": "Person", "name": "Samy Rivers" },
        { "@type": "Person", "name": "RoRo" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "YoSoyPlex vs Fernanfloo",
      "startDate": "2026-07-26T01:45:00+02:00",
      "endDate": "2026-07-26T02:15:00+02:00",
      "description": "Combate masculino. Dos youtubers invictos se enfrentan por primera vez.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "YoSoyPlex" },
        { "@type": "Person", "name": "Fernanfloo" }
      ],
      "competitor": [
        { "@type": "Person", "name": "YoSoyPlex" },
        { "@type": "Person", "name": "Fernanfloo" }
      ]
    },
    {
      "@type": "SportsEvent",
      "name": "IlloJuan vs TheGrefg",
      "startDate": "2026-07-26T02:15:00+02:00",
      "endDate": "2026-07-26T03:00:00+02:00",
      "description": "Main event masculino. Peso: 67 kg.",
      "eventStatus": "https://schema.org/EventScheduled",
      "image": "https://laveladazone.com/og-image.png",
      "organizer": { "@type": "Person", "name": "Ibai Llanos", "url": "https://www.twitch.tv/ibai" },
      "offers": {
        "@type": "Offer",
        "url": "https://laveladazone.com/entradas",
        "availability": "https://schema.org/SoldOut",
        "price": "10",
        "priceCurrency": "EUR",
        "validFrom": "2026-06-01T12:00:00+02:00"
      },
      "location": {
        "@type": "Place",
        "name": "Estadio de La Cartuja",
        "address": { "@type": "PostalAddress", "addressLocality": "Sevilla", "addressCountry": "ES" }
      },
      "performer": [
        { "@type": "Person", "name": "IlloJuan" },
        { "@type": "Person", "name": "TheGrefg" }
      ],
      "competitor": [
        { "@type": "Person", "name": "IlloJuan" },
        { "@type": "Person", "name": "TheGrefg" }
      ]
    }
  ]
} as const;
