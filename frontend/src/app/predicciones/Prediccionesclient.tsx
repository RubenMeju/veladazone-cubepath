"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CommunityStats, Fight, Prediction } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { FightCard } from "./components/FightCard";
import { PredictionProgress } from "./components/Predictionprogress";
import { Leaderboard } from "./components/Leaderboard";
import { CraziestPrediction } from "./components/Craziestprediction";
import { BetrayalCounter } from "./components/BetrayalCounter";
import { AIPrediction } from "./components/AIPrediction";
import { DNAPredictor } from "./components/DNAPredictor";
import { CompletionCelebration } from "./components/CompletionCelebration";
import { TwitchLoginButton } from "@/components/ui/TwitchLoginButton";

// ---------------------------------------------------------------------------
// Login banner
// ---------------------------------------------------------------------------
function LoginBanner() {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#9146FF]/20 rounded-2xl p-5 sm:p-6 mb-6 text-center">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9146FF]/40 to-transparent" />
      <p className="text-gray-400 text-sm mb-4">
        Inicia sesión con Twitch para guardar tus predicciones
      </p>
      <TwitchLoginButton className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-bebas text-lg tracking-widest px-6 py-2.5 rounded transition-colors">
        <svg
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
        ENTRAR CON TWITCH
      </TwitchLoginButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Client Component principal
// No recibe props — consume el cache hidratado por HydrationBoundary.
// El header ya está renderizado en el Server Component (page.tsx).
// ---------------------------------------------------------------------------
export function PrediccionesClient() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [pendingFightId, setPendingFightId] = useState<number | null>(null);

  // Cache ya hidratado desde el servidor — 0 fetches extra en el mount
  const { data: fights = [] } = useQuery({
    queryKey: ["fights", 6],
    queryFn: () => api.get<Fight[]>("/fighters/fights/?edition=6"),
    staleTime: 5 * 60 * 1000,
  });

  const { data: communityStats = [] } = useQuery({
    queryKey: ["community-stats"],
    queryFn: () => api.get<CommunityStats[]>("/predictions/community_stats/"),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  // Solo client — depende de cookie JWT, no puede ir al servidor
  const { data: predictions = [] } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: () => api.get<Prediction[]>("/predictions/"),
    enabled: !!user,
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
      queryClient.invalidateQueries({ queryKey: ["betrayals"] });
      setPendingFightId(null);
    },
  });

  const handlePredict = (fightId: number, winnerId: number) => {
    if (!user) return;
    setPendingFightId(fightId);
    mutation.mutate({ fightId, winnerId });
  };

  const getPredictionForFight = (fightId: number) =>
    (predictions as Prediction[]).find((p) => p.fight.id === fightId);

  const totalPredictions = (predictions as Prediction[]).length;

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main — combates */}
        <div className="lg:col-span-2 min-w-0">
          {user ? (
            <PredictionProgress total={totalPredictions} />
          ) : (
            <LoginBanner />
          )}

          <div className="flex flex-col gap-4">
            {fights.map((fight) => (
              <FightCard
                key={fight.id}
                fight={fight}
                prediction={getPredictionForFight(fight.id)}
                onPredict={handlePredict}
                isPending={pendingFightId === fight.id && mutation.isPending}
                stats={communityStats.find((s) => s.fight_id === fight.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
          <Leaderboard />
          <DNAPredictor />
          <AIPrediction fights={fights} />
          <BetrayalCounter />
          <CraziestPrediction stats={communityStats} />
        </div>
      </div>

      <CompletionCelebration total={totalPredictions} />
    </>
  );
}