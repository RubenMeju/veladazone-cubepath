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

  const selectedFight = fights?.find((f) => f.id === selectedFightId);

  return (
    <div className="bg-[#1a1a1a] border border-[#9146FF]/30 rounded-2xl p-6">
      <h3 className="font-bebas text-xl text-white tracking-wider mb-1">
        🔮 PREDICCIÓN DE LA IA
      </h3>
      <p className="text-gray-500 text-xs mb-4">
        ¿Qué diría la IA sobre cada combate?
      </p>

      {/* Selector de combate */}
      <div className="flex flex-col gap-2 mb-4">
        {fights?.map((fight) => (
          <button
            key={fight.id}
            onClick={() => setSelectedFightId(fight.id)}
            className={`text-left text-xs px-3 py-2 rounded-lg transition-colors border ${
              selectedFightId === fight.id
                ? "border-[#9146FF]/50 bg-[#9146FF]/10 text-white"
                : "border-[#2a2a2a] text-gray-500 hover:text-gray-300 hover:border-[#3a3a3a]"
            }`}
          >
            {fight.fighter1.country_flag} {fight.fighter1.name}{" "}
            <span className="text-[#e63946]">vs</span>{" "}
            {fight.fighter2.country_flag} {fight.fighter2.name}
            {fight.is_main_event && (
              <span className="ml-1 text-[#e63946]">⭐</span>
            )}
          </button>
        ))}
      </div>

      {/* Resultado */}
      {isLoading && (
        <div className="text-gray-500 text-xs text-center py-4 animate-pulse">
          La IA está analizando...
        </div>
      )}

      {data && selectedFight && (
        <div className="bg-[#0f0f0f] border border-[#9146FF]/20 rounded-xl p-4">
          {data.predicted_fighter && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{data.predicted_fighter.flag}</span>
              <span className="font-bebas text-[#9146FF] text-lg">
                {data.predicted_fighter.name}
              </span>
              <span className="text-xs text-gray-500">según la IA</span>
            </div>
          )}
          <p className="text-gray-300 text-xs leading-relaxed italic">
            {data.prediction}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
          >
            🔄 Nueva predicción
          </button>
        </div>
      )}

      {!selectedFightId && (
        <p className="text-gray-600 text-xs text-center py-2">
          Selecciona un combate para ver la predicción
        </p>
      )}
    </div>
  );
}
