"use client";

import { Prediction } from "@/types";

export function PosterCard({
  predictions,
  username,
}: {
  predictions: Prediction[];
  username: string;
}) {
  const mainEvent = predictions.find((p) => p.fight.is_main_event);
  const rest = predictions.filter((p) => !p.fight.is_main_event);

  return (
    <div className="bg-[#0a0a0a] border border-[#e63946]/40 rounded-2xl p-8 w-full max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#e63946]/10 via-transparent to-[#f4a261]/5 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-[10px] text-[#e63946] tracking-widest mb-1">
            MIS PREDICCIONES
          </div>
          <div className="font-bebas text-4xl text-white tracking-wider">
            VELADA DEL AÑO 6
          </div>
          <div className="text-xs text-gray-500 mt-1">
            25 · 07 · 2026 · SEVILLA
          </div>
          <div className="mt-2 text-sm text-[#f4a261]">@{username}</div>
        </div>

        {/* Main event */}
        {mainEvent && (
          <div className="bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl p-4 mb-4 text-center">
            <div className="text-xs text-[#e63946] tracking-widest mb-2">
              ⭐ COMBATE ESTELAR
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">
                {mainEvent.fight.fighter1.country_flag}
              </span>
              <div
                className={`font-bebas text-xl ${
                  mainEvent.predicted_winner.id === mainEvent.fight.fighter1.id
                    ? "text-[#f4a261]"
                    : "text-gray-600"
                }`}
              >
                {mainEvent.fight.fighter1.name}
                {mainEvent.predicted_winner.id ===
                  mainEvent.fight.fighter1.id && " 👑"}
              </div>
              <div className="font-bebas text-[#e63946] text-lg">VS</div>
              <div
                className={`font-bebas text-xl ${
                  mainEvent.predicted_winner.id === mainEvent.fight.fighter2.id
                    ? "text-[#f4a261]"
                    : "text-gray-600"
                }`}
              >
                {mainEvent.predicted_winner.id ===
                  mainEvent.fight.fighter2.id && "👑 "}
                {mainEvent.fight.fighter2.name}
              </div>
              <span className="text-lg">
                {mainEvent.fight.fighter2.country_flag}
              </span>
            </div>
          </div>
        )}

        {/* Rest of fights */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {rest.map((p) => (
            <div
              key={p.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-center"
            >
              <div className="text-lg mb-1">👑</div>
              <div className="font-bebas text-sm text-[#f4a261] leading-tight">
                {p.predicted_winner.name}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                vs{" "}
                {p.fight.fighter1.id === p.predicted_winner.id
                  ? p.fight.fighter2.name
                  : p.fight.fighter1.name}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-[#2a2a2a] pt-4">
          <div className="font-bebas text-lg text-white tracking-widest">
            🥊 VELADAZONE.COM
          </div>
          <div className="text-[10px] text-gray-600 mt-1">
            Haz tus predicciones en veladazone.com
          </div>
        </div>
      </div>
    </div>
  );
}
