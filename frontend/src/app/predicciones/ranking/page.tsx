import { getLeaderboard } from "@/lib/api.server";
import { RankingClient } from "./RankingClient";
import { LeaderboardEntry } from "@/types";
import type { Metadata } from "next";

const BASE_URL = "https://laveladazone.com/predicciones/ranking";

// ---------------------------------------------------------------------------
// Metadata dinámico y JSON-LD para SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  let initial: { results: LeaderboardEntry[]; nextOffset: number } = {
    results: [],
    nextOffset: 0,
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
  let initial: { results: LeaderboardEntry[]; nextOffset: number } = {
    results: [],
    nextOffset: 0,
  };

  try {
    const data = await getLeaderboard({ limit: 50, offset: 0 });
    initial = {
      results: data.results ?? [],
      nextOffset: data.nextOffset ?? 0,
    };
  } catch (err) {
    console.warn("No se pudo obtener el leaderboard en SSR:", err);
  }

  // Generar JSON-LD de tipo Leaderboard
  const jsonLd = {
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

  return (
    <>
      {/* JSON-LD para rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
