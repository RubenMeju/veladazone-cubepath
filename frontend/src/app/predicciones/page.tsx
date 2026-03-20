"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Fight, Prediction, LeaderboardEntry } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";

interface CommunityStats {
  fight_id: number;
  fighter1_pct: number;
  fighter2_pct: number;
  total_votes: number;
}

function Thermometer({
  fight,
  stats,
}: {
  fight: Fight;
  stats?: CommunityStats;
}) {
  if (!stats || stats.total_votes === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>
          {fight.fighter1.name}{" "}
          <span className="text-[#e63946] font-medium">
            {stats.fighter1_pct}%
          </span>
        </span>
        <span className="text-gray-600">{stats.total_votes} votos</span>
        <span>
          <span className="text-[#9146FF] font-medium">
            {stats.fighter2_pct}%
          </span>{" "}
          {fight.fighter2.name}
        </span>
      </div>
      <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden flex">
        <div
          className="h-full bg-[#e63946] transition-all duration-500"
          style={{ width: `${stats.fighter1_pct}%` }}
        />
        <div
          className="h-full bg-[#9146FF] transition-all duration-500"
          style={{ width: `${stats.fighter2_pct}%` }}
        />
      </div>
    </div>
  );
}

function FightCard({
  fight,
  prediction,
  onPredict,
  isPending,
  stats,
}: {
  fight: Fight;
  prediction?: Prediction;
  onPredict: (fightId: number, winnerId: number) => void;
  isPending: boolean;
  stats?: CommunityStats;
}) {
  const selectedId = prediction?.predicted_winner?.id;

  return (
    <div
      className={`bg-[#1a1a1a] border rounded-2xl p-6 transition-all ${
        fight.is_main_event ? "border-[#e63946]/50" : "border-[#2a2a2a]"
      }`}
    >
      {fight.is_main_event && (
        <div className="text-center text-[10px] text-[#e63946] font-medium tracking-widest mb-4">
          ⭐ COMBATE ESTELAR
        </div>
      )}

      <div className="flex items-center gap-4">
        <FighterButton
          fighter={fight.fighter1}
          isSelected={selectedId === fight.fighter1.id}
          onClick={() => onPredict(fight.id, fight.fighter1.id)}
          disabled={isPending}
        />

        <div className="text-center flex-shrink-0">
          <div className="font-bebas text-3xl text-[#e63946]">VS</div>
        </div>

        <FighterButton
          fighter={fight.fighter2}
          isSelected={selectedId === fight.fighter2.id}
          onClick={() => onPredict(fight.id, fight.fighter2.id)}
          disabled={isPending}
        />
      </div>

      <Thermometer fight={fight} stats={stats} />

      {prediction?.ai_comment && (
        <div className="mt-4 border border-[#f4a261]/30 bg-[#f4a261]/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>🎙️</span>
            <span className="text-xs text-[#f4a261] font-medium tracking-wider">
              EL COMENTARISTA
            </span>
          </div>
          <p className="text-gray-300 text-sm italic leading-relaxed">
            {prediction.ai_comment}
          </p>
        </div>
      )}
    </div>
  );
}

function FighterButton({
  fighter,
  isSelected,
  onClick,
  disabled,
}: {
  fighter: Fight["fighter1"];
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 rounded-xl p-4 text-center transition-all border-2 ${
        isSelected
          ? "border-[#f4a261] bg-[#f4a261]/10"
          : "border-transparent bg-[#0f0f0f] hover:border-[#2a2a2a]"
      }`}
    >
      <div className="text-3xl mb-2">{fighter.country_flag}</div>
      <div className="font-bebas text-xl text-white tracking-wide">
        {fighter.name}
      </div>
      <div className="text-xs text-gray-500">{fighter.country}</div>
      {isSelected && (
        <div className="mt-2 text-xs text-[#f4a261] font-medium">
          👑 Tu pick
        </div>
      )}
    </button>
  );
}

function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.get<LeaderboardEntry[]>("/predictions/leaderboard/"),
  });

  const medals = ["🥇", "🥈", "🥉"];

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

function CraziestPrediction({ stats }: { stats?: CommunityStats[] }) {
  if (!stats?.length) return null;

  const craziest = stats.reduce((prev, curr) => {
    const prevMin = Math.min(prev.fighter1_pct, prev.fighter2_pct);
    const currMin = Math.min(curr.fighter1_pct, curr.fighter2_pct);
    return currMin < prevMin ? curr : prev;
  });

  if (craziest.total_votes < 5) return null;

  const underdog_pct = Math.min(craziest.fighter1_pct, craziest.fighter2_pct);

  return (
    <div className="bg-[#1a1a1a] border border-[#e63946]/30 rounded-2xl p-6">
      <h3 className="font-bebas text-xl text-white tracking-wider mb-2">
        🎲 LA PREDICCIÓN MÁS LOCA
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Solo el{" "}
        <span className="text-[#e63946] font-bold text-lg">
          {underdog_pct}%
        </span>{" "}
        de VeladaZone apoya al underdog de este combate.
        <span className="text-gray-500"> ¿Eres de los valientes?</span>
      </p>
    </div>
  );
}

export default function PrediccionesPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [pendingFightId, setPendingFightId] = useState<number | null>(null);

  const { data: fights, isLoading: loadingFights } = useQuery({
    queryKey: ["fights", 6],
    queryFn: () => api.get<Fight[]>("/fighters/fights/?edition=6"),
  });

  const { data: predictions } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: () => api.get<Prediction[]>("/predictions/"),
    enabled: isAuthenticated(),
  });

  const { data: communityStats } = useQuery({
    queryKey: ["community-stats"],
    queryFn: () => api.get<CommunityStats[]>("/predictions/community_stats/"),
    refetchInterval: 30000,
  });

  const mutation = useMutation({
    mutationFn: ({
      fightId,
      winnerId,
    }: {
      fightId: number;
      winnerId: number;
    }) =>
      api.post("/predictions/", {
        fight_id: fightId,
        predicted_winner_id: winnerId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-predictions"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["community-stats"] });
      setPendingFightId(null);
    },
  });

  const handlePredict = (fightId: number, winnerId: number) => {
    if (!isAuthenticated()) return;
    setPendingFightId(fightId);
    mutation.mutate({ fightId, winnerId });
  };

  const getPredictionForFight = (fightId: number) =>
    (Array.isArray(predictions) ? predictions : []).find(
      (p: Prediction) => p.fight.id === fightId,
    );

  const totalPredictions = Array.isArray(predictions) ? predictions.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          PREDIC<span className="text-[#e63946]">CIONES</span>
        </h1>
        <p className="text-gray-400">
          Elige tu ganador en cada combate de la Velada del Año 6
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {!isAuthenticated() && (
            <div className="bg-[#1a1a1a] border border-[#9146FF]/30 rounded-2xl p-6 mb-6 text-center">
              <p className="text-gray-300 mb-4">
                Inicia sesión con Twitch para guardar tus predicciones
              </p>
              <a
                href={twitchLoginUrl}
                className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-2.5 rounded transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                Entrar con Twitch
              </a>
            </div>
          )}

          {isAuthenticated() && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Tu progreso</span>
                <span className="text-sm text-white font-medium">
                  {totalPredictions}/10 predicciones
                </span>
              </div>
              <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e63946] rounded-full transition-all"
                  style={{ width: `${(totalPredictions / 10) * 100}%` }}
                />
              </div>
              {totalPredictions === 10 && (
                <div className="mt-3 text-center">
                  <a
                    href="/mi-cartel"
                    className="inline-block bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-medium px-6 py-2 rounded transition-colors"
                  >
                    🃏 ¡Genera tu cartel! →
                  </a>
                </div>
              )}
            </div>
          )}

          {loadingFights ? (
            <div className="text-gray-500 text-center py-20">
              Cargando combates...
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fights?.map((fight) => (
                <FightCard
                  key={fight.id}
                  fight={fight}
                  prediction={getPredictionForFight(fight.id)}
                  onPredict={handlePredict}
                  isPending={pendingFightId === fight.id && mutation.isPending}
                  stats={communityStats?.find((s) => s.fight_id === fight.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Leaderboard />
          <CraziestPrediction stats={communityStats} />
        </div>
      </div>
    </div>
  );
}
