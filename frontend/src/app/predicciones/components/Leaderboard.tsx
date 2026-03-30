"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LeaderboardEntry } from "@/types";

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { data, isLoading, isError } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // api.get devuelve { data: T }
      const res = await api.get<LeaderboardEntry[]>(
        "/predictions/top_leaderboard/",
      );
      return res; // ✅ devuelve LeaderboardEntry[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  if (isLoading)
    return <p className="text-gray-500 text-center py-4">Cargando...</p>;
  if (isError)
    return (
      <p className="text-red-500 text-center py-4">
        Error cargando el leaderboard
      </p>
    );

  const top10 = data ?? []; // ✅ fallback seguro

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
      <h3 className="font-bebas text-2xl text-white tracking-wider mb-4">
        🏆 TOP PREDICTORES
      </h3>

      {!top10.length ? (
        <p className="text-gray-500 text-sm text-center py-4">
          Sé el primero en hacer predicciones
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {top10.map((entry) => (
            <Link
              key={entry.rank}
              href={`/perfil/${entry.username}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="text-xl w-8">
                {medals[entry.rank - 1] || `#${entry.rank}`}
              </span>
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a]" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {entry.username}
                  </span>
                  {entry.badge && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        color: entry.badge.color,
                        backgroundColor: `${entry.badge.color}20`,
                      }}
                    >
                      {entry.badge.emoji} {entry.badge.label}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {entry.correct}/{entry.total} correctas
                </div>
              </div>
              <div className="font-bebas text-xl text-[#f4a261]">
                {entry.accuracy}%
              </div>
            </Link>
          ))}

          <div className="mt-4 text-center">
            <Link
              href="/predicciones/ranking"
              className="text-sm font-medium text-[#f4a261] hover:underline"
            >
              Ver ranking completo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
