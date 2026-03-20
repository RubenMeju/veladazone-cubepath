"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CommunityStats, Fight, Prediction } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";
import { FightCard } from "./components/FightCard";
import { PredictionProgress } from "./components/Predictionprogress";
import { Leaderboard } from "./components/Leaderboard";
import { CraziestPrediction } from "./components/Craziestprediction";

function LoginBanner() {
  return (
    <div className="bg-[#1a1a1a] border border-[#9146FF]/30 rounded-2xl p-6 mb-6 text-center">
      <p className="text-gray-300 mb-4">
        Inicia sesión con Twitch para guardar tus predicciones
      </p>
      <a
        href={twitchLoginUrl}
        className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-2.5 rounded transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
        Entrar con Twitch
      </a>
    </div>
  );
}

export default function PrediccionesPage() {
  const { user } = useAuthStore();

  const queryClient = useQueryClient();
  const [pendingFightId, setPendingFightId] = useState<number | null>(null);

  const { data: fights, isLoading: loadingFights } = useQuery({
    queryKey: ["fights", 6],
    queryFn: () => api.get<Fight[]>("/fighters/fights/?edition=6"),
  });

  const { data: predictions } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: () => api.get<Prediction[]>("/predictions/"),
    enabled: !!user, // 👈 solo si hay usuario (cliente)
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
    if (!user) return;
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
          {/* Login banner o barra de progreso */}
          {user ? (
            <PredictionProgress total={totalPredictions} />
          ) : (
            <LoginBanner />
          )}

          {/* Combates */}
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

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Leaderboard />
          <CraziestPrediction stats={communityStats} />
        </div>
      </div>
    </div>
  );
}
