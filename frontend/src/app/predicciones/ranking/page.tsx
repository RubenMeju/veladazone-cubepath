export const dynamic = "force-dynamic";

import { getLeaderboard } from "@/lib/api.server";
import { RankingClient } from "./RankingClient";
import { LeaderboardEntry } from "@/types";
import type { Metadata } from "next";

const BASE_URL = "https://laveladazone.com/predicciones/ranking";

// ---------------------------------------------------------------------------
// Metadata dinámico y JSON-LD para SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  let initial: { results: LeaderboardEntry[]; nextOffset?: number } = {
    results: [],
    nextOffset: undefined,
  };

  try {
    const data = await getLeaderboard({ limit: 50, offset: 0 });
    initial = {
      results: data.results ?? [],
      nextOffset: data.nextOffset ?? 0,
    };
  } catch {
    initial.results = [];
  }

  const topUser = initial.results[0]?.username ?? "VeladaZone";

  return {
    title: `Ranking Global · VeladaZone`,
    description: `Consulta el ranking global de predicciones de La Velada del Año 6. ${topUser} lidera actualmente la clasificación.`,
    openGraph: {
      title: `Ranking Global · VeladaZone`,
      description: `Consulta el ranking global de predicciones de La Velada del Año 6. ${topUser} lidera actualmente la clasificación.`,
      type: "website",
      url: BASE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: `Ranking Global · VeladaZone`,
      description: `Consulta el ranking global de predicciones de La Velada del Año 6.`,
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

// ---------------------------------------------------------------------------
// Server Component
// ---------------------------------------------------------------------------
export default async function RankingPage() {
  let initial: { results: LeaderboardEntry[]; nextOffset?: number } = {
    results: [],
    nextOffset: undefined,
  };

  try {
    const data = await getLeaderboard({ limit: 50, offset: 0 });
    initial = {
      results: data.results ?? [],
      nextOffset: data.nextOffset, // puede ser undefined — está bien
    };
  } catch (err) {
    console.warn("No se pudo obtener el leaderboard en SSR:", err);
  }

  // JSON-LD para el ranking
  const rankingJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ranking Global · VeladaZone",
    description: `Ranking de predicciones de La Velada del Año 6.`,
    url: BASE_URL,
    numberOfItems: initial.results.length,
    itemListElement: initial.results.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.username,
      url: `${BASE_URL}#${entry.username}`,
    })),
  };

  // JSON-LD para el evento
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Predicciones La Velada del Año 6",
    startDate: "2026-07-25T20:00:00+02:00",
    endDate: "2026-07-25T23:00:00+02:00",
    location: {
      "@type": "Place",
      name: "VeladaZone",
      address: "España",
    },
    description:
      "Haz tus predicciones de los combates de La Velada del Año 6 y compite con la comunidad.",
    url: "https://laveladazone.com/predicciones",
    performer: [
      { "@type": "Person", name: "Luchador 1" },
      { "@type": "Person", name: "Luchador 2" },
    ],
    organizer: {
      "@type": "Organization",
      name: "VeladaZone",
      url: "https://laveladazone.com",
    },
    offers: {
      "@type": "Offer",
      url: "https://laveladazone.com/entradas",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    eventStatus: "https://schema.org/EventScheduled",
  };

  return (
    <>
      {/* JSON-LD para el evento */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* JSON-LD para el ranking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingJsonLd) }}
      />

      <div className="page-container">
        <h1 className="text-3xl font-bebas text-white mb-6">
          🏆 Ranking global
        </h1>
        <RankingClient
          initialEntries={initial.results}
          initialNextOffset={initial.nextOffset}
        />
      </div>
    </>
  );
}
