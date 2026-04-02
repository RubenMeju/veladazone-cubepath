"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Fight } from "@/types";

interface AIPredictionData {
  prediction: string;
  predicted_fighter: {
    id: number;
    name: string;
    flag: string;
  } | null;
}

export function AIPrediction({ fights }: { fights?: Fight[] }) {
  const [selectedFightId, setSelectedFightId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ai-prediction", selectedFightId],
    queryFn: () =>
      api.get<AIPredictionData>(
        `/fighters/fights/${selectedFightId}/ai-prediction/`,
      ),
    enabled: !!selectedFightId,
  });

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#9146FF]/20 rounded-2xl">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9146FF]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[radial-gradient(ellipse_at_top,_#9146FF_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🔮</span>
          <h3 className="font-bebas text-lg text-white tracking-wider">
            PREDICCIÓN DE LA IA
          </h3>
        </div>
        <p className="text-sm text-gray-600 tracking-wide mb-4">
          ¿Qué elegiría la IA en cada combate?
        </p>

        {/* Fight selector */}
        <div className="flex flex-col gap-1.5 mb-4">
          {fights?.map((fight) => (
            <button
              key={fight.id}
              onClick={() => setSelectedFightId(fight.id)}
              className={`relative text-left text-xs px-3 py-2 rounded-lg transition-all duration-150 border overflow-hidden cursor-pointer ${
                selectedFightId === fight.id
                  ? "border-[#9146FF]/40 bg-[#9146FF]/8 text-white"
                  : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10 hover:bg-white/2"
              }`}
            >
              {selectedFightId === fight.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#9146FF]/60 rounded-r" />
              )}
              <span className="relative">
                {fight.fighter1.country_flag}{" "}
                <span
                  className={selectedFightId === fight.id ? "text-white" : ""}
                >
                  {fight.fighter1.name}
                </span>{" "}
                <span className="text-[#e63946]/60">vs</span>{" "}
                {fight.fighter2.country_flag}{" "}
                <span
                  className={selectedFightId === fight.id ? "text-white" : ""}
                >
                  {fight.fighter2.name}
                </span>
                {fight.is_main_event && (
                  <span className="ml-1 text-[#e63946]/70">⭐</span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-[#0a0a0a] border border-[#9146FF]/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-[#9146FF]/30 animate-pulse" />
              <span className="text-sm text-[#9146FF]/60 tracking-widest uppercase animate-pulse">
                Analizando...
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-2 bg-white/5 rounded animate-pulse w-4/5" />
              <div className="h-2 bg-white/5 rounded animate-pulse w-3/5" />
            </div>
          </div>
        )}

        {/* Result */}
        {data && !isLoading && (
          <div className="relative overflow-hidden bg-[#0a0a0a] border border-[#9146FF]/15 rounded-xl p-4">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9146FF]/30 to-transparent" />

            {data.predicted_fighter && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{data.predicted_fighter.flag}</span>
                <div>
                  <div className="font-bebas text-lg text-[#9146FF] tracking-wider leading-none">
                    {data.predicted_fighter.name}
                  </div>
                  <div className="text-[10px] text-gray-600 tracking-widest uppercase">
                    ganador según la IA
                  </div>
                </div>
              </div>
            )}

            <p className="text-gray-400 text-xs leading-relaxed italic border-l-2 border-[#9146FF]/20 pl-3">
              {data.prediction}
            </p>

            <button
              onClick={() => refetch()}
              className="mt-3 flex items-center gap-1 text-[10px] text-gray-700 hover:text-[#9146FF] transition-colors tracking-widest uppercase"
            >
              <span>↺</span>
              <span>Nueva predicción</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {!selectedFightId && !isLoading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-700 tracking-wide">
              Selecciona un combate
            </p>
          </div>
        )}
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9146FF]/10 to-transparent" />
    </div>
  );
}
