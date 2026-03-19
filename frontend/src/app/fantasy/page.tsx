"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FantasyLeague, LeagueMember } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";

function LeagueCard({
  league,
  onSelect,
  isSelected,
}: {
  league: FantasyLeague;
  onSelect: (id: number) => void;
  isSelected: boolean;
}) {
  return (
    <div
      onClick={() => onSelect(league.id)}
      className={`bg-[#1a1a1a] border rounded-xl p-5 cursor-pointer transition-all ${
        isSelected
          ? "border-[#e63946]/50"
          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bebas text-xl text-white tracking-wide">
          {league.name}
        </h3>
        <span className="text-xs text-gray-500 bg-[#0f0f0f] px-2 py-1 rounded">
          {league.member_count} miembros
        </span>
      </div>
      {league.invite_code && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Código:</span>
          <code className="text-xs text-[#f4a261] bg-[#0f0f0f] px-2 py-1 rounded font-mono tracking-widest">
            {league.invite_code}
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(league.invite_code!);
            }}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}

function LeagueLeaderboard({ leagueId }: { leagueId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["league-leaderboard", leagueId],
    queryFn: () =>
      api.get<LeagueMember[]>(`/fantasy/leagues/${leagueId}/leaderboard/`),
  });

  const medals = ["🥇", "🥈", "🥉"];

  if (isLoading)
    return (
      <div className="text-gray-500 text-center py-8">Cargando ranking...</div>
    );

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

export default function FantasyPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [newLeagueName, setNewLeagueName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  const { data: leagues, isLoading } = useQuery({
    queryKey: ["my-leagues"],
    queryFn: () => api.get<FantasyLeague[]>("/fantasy/leagues/"),
    enabled: isAuthenticated(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => api.post("/fantasy/leagues/", { name }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setNewLeagueName("");
      setSelectedLeagueId(data.id);
    },
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) =>
      api.post("/fantasy/leagues/join/", { invite_code: code }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["my-leagues"] });
      setInviteCode("");
      setSelectedLeagueId(data.id);
    },
  });

  if (!isAuthenticated()) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
            FANTASY <span className="text-[#e63946]">LEAGUE</span>
          </h1>
        </div>
        <div className="max-w-md mx-auto bg-[#1a1a1a] border border-[#9146FF]/30 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="font-bebas text-2xl text-white mb-2">
            Inicia sesión para jugar
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Necesitas una cuenta de Twitch para crear o unirte a una liga
            fantasy
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          FANTASY <span className="text-[#e63946]">LEAGUE</span>
        </h1>
        <p className="text-gray-400">
          Compite con tus amigos y demuestra quién sabe más de La Velada
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — create/join + my leagues */}
        <div className="flex flex-col gap-6">
          {/* Create / Join tabs */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex gap-2 mb-5">
              {(["create", "join"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-[#e63946] text-white"
                      : "bg-[#0f0f0f] text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "create" ? "➕ Crear liga" : "🔗 Unirse"}
                </button>
              ))}
            </div>

            {activeTab === "create" ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre de la liga..."
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
                />
                <button
                  onClick={() =>
                    newLeagueName.trim() &&
                    createMutation.mutate(newLeagueName.trim())
                  }
                  disabled={!newLeagueName.trim() || createMutation.isPending}
                  className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {createMutation.isPending ? "Creando..." : "Crear liga"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Código de invitación..."
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#e63946] font-mono tracking-widest"
                  maxLength={8}
                />
                <button
                  onClick={() =>
                    inviteCode.trim() && joinMutation.mutate(inviteCode.trim())
                  }
                  disabled={inviteCode.length < 6 || joinMutation.isPending}
                  className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {joinMutation.isPending ? "Uniéndose..." : "Unirse a liga"}
                </button>
                {joinMutation.isError && (
                  <p className="text-[#e63946] text-xs text-center">
                    Código no válido
                  </p>
                )}
              </div>
            )}
          </div>

          {/* My leagues */}
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
    </div>
  );
}
