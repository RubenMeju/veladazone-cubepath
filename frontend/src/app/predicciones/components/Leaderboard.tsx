"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LeaderboardEntry } from "@/types";

const medals = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.get<LeaderboardEntry[]>("/predictions/leaderboard/"),
  });

  if (isLoading) return null;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
      <h3 className="font-bebas text-2xl text-white tracking-wider mb-4">
        🏆 TOP PREDICTORES
      </h3>
      {!data?.length ? (
        <p className="text-gray-500 text-sm text-center py-4">
          Sé el primero en hacer predicciones
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-3">
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
                <div className="text-white text-sm font-medium">
                  {entry.username}
                </div>
                <div className="text-gray-500 text-xs">
                  {entry.correct}/{entry.total} correctas
                </div>
              </div>
              <div className="font-bebas text-xl text-[#f4a261]">
                {entry.accuracy}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
