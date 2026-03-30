// app/predicciones/ranking/page.tsx
import { getLeaderboard } from "@/lib/api.server";
import { RankingClient } from "./RankingClient";

export default async function RankingPage() {
  let initial = { results: [], nextOffset: 0 };

  try {
    const data = await getLeaderboard({ limit: 50, offset: 0 });
    initial = {
      results: data.results ?? [],
      nextOffset: data.nextOffset ?? 0,
    };
  } catch (err) {
    console.warn("No se pudo obtener el leaderboard en SSR:", err);
    initial = { results: [], nextOffset: 0 };
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bebas text-white mb-6">🏆 Ranking global</h1>
      {/* Pasamos datos iniciales al cliente */}
      <RankingClient
        initialEntries={initial.results}
        initialNextOffset={initial.nextOffset}
      />
    </div>
  );
}
