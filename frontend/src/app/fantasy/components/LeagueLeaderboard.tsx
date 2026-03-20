"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LeagueMember } from "@/types";

const medals = ["🥇", "🥈", "🥉"];

export function LeagueLeaderboard({ leagueId }: { leagueId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["league-leaderboard", leagueId],
    queryFn: () =>
      api.get<LeagueMember[]>(`/fantasy/leagues/${leagueId}/leaderboard/`),
  });

  if (isLoading) {
    return (
      <div className="text-gray-500 text-center py-8">Cargando ranking...</div>
    );
  }

  return (
    <div>
      <h3 className="font-bebas text-2xl text-white tracking-wider mb-4">
        RANKING DE LA LIGA
      </h3>
      {!data?.length ? (
        <p className="text-gray-500 text-sm text-center py-8">
          Aún no hay puntos. ¡Los resultados se actualizan el 25 de julio!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((member) => (
            <div
              key={member.rank}
              className={`flex items-center gap-4 bg-[#1a1a1a] border rounded-xl p-4 ${
                member.rank <= 3 ? "border-[#f4a261]/30" : "border-[#2a2a2a]"
              }`}
            >
              <span className="text-2xl w-8">
                {medals[member.rank - 1] || `#${member.rank}`}
              </span>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-500">
                  👤
                </div>
              )}
              <div className="flex-1">
                <div className="text-white font-medium">{member.username}</div>
              </div>
              <div className="text-right">
                <div className="font-bebas text-2xl text-[#f4a261]">
                  {member.points}
                </div>
                <div className="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
