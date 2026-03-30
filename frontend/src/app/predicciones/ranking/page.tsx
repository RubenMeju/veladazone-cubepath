import { getLeaderboard } from "@/lib/api.server";
import { RankingClient } from "./RankingClient";

export default async function RankingPage() {
  const initial = await getLeaderboard({ limit: 50, offset: 0 });

  const results = initial?.results ?? []; // fallback a array vacío
  const nextOffset = initial?.nextOffset ?? null;

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bebas text-white mb-6">🏆 Ranking global</h1>
      <RankingClient initialEntries={results} initialNextOffset={nextOffset} />
    </div>
  );
}
