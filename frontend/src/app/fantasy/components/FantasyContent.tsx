"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FantasyLeague } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { LeagueCard } from "./LeagueCard";
import { LeagueLeaderboard } from "./LeagueLeaderboard";
import { CreateJoinLeague } from "./CreateJoinLeague";
import { twitchLoginUrl } from "@/lib/api";

function LoginPrompt() {
  return (
    <div className="max-w-md mx-auto bg-[#1a1a1a] border border-[#9146FF]/30 rounded-2xl p-8 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h2 className="font-bebas text-2xl text-white mb-2">
        Inicia sesión para jugar
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Necesitas una cuenta de Twitch para crear o unirte a una liga fantasy
      </p>
      <a
        href={twitchLoginUrl}
        className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-3 rounded transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
        Entrar con Twitch
      </a>
    </div>
  );
}

export function FantasyContent() {
  const { user } = useAuthStore();
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const { data: leagues } = useQuery({
    queryKey: ["my-leagues"],
    queryFn: () => api.get<FantasyLeague[]>("/fantasy/leagues/"),
    enabled: !!user,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          FANTASY <span className="text-[#e63946]">LEAGUE</span>
        </h1>
        {user && (
          <p className="text-gray-400">
            Compite con tus amigos y demuestra quién sabe más de La Velada
          </p>
        )}
      </div>

      {!user ? (
        <LoginPrompt />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — create/join + my leagues */}
          <div className="flex flex-col gap-6">
            <CreateJoinLeague onLeagueSelected={setSelectedLeagueId} />

            {leagues && leagues.length > 0 && (
              <div>
                <h3 className="font-bebas text-xl text-white tracking-wider mb-3">
                  MIS LIGAS
                </h3>
                <div className="flex flex-col gap-3">
                  {leagues.map((league) => (
                    <LeagueCard
                      key={league.id}
                      league={league}
                      onSelect={setSelectedLeagueId}
                      isSelected={selectedLeagueId === league.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — leaderboard */}
          <div className="lg:col-span-2">
            {selectedLeagueId ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
                <LeagueLeaderboard leagueId={selectedLeagueId} />
              </div>
            ) : (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="font-bebas text-2xl text-white mb-2">
                  Selecciona una liga
                </h3>
                <p className="text-gray-500 text-sm">
                  Crea o únete a una liga para ver el ranking
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
