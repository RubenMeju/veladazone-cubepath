"use client";

import { CommunityStats, Fight, Prediction } from "@/types";
import { FighterButton } from "./Fighterbutton";
import { Thermometer } from "./Thermometer";
import { DebateSection } from "./debate/DebateSection";
import { ShareFightButton } from "./ShareFightButton";

export function FightCard({
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
    <div className={`relative overflow-hidden rounded-2xl transition-all duration-200 ${
      fight.is_main_event
        ? "bg-[#0d0d0d] border border-[#e63946]/30"
        : "bg-[#0d0d0d] border border-white/5 hover:border-white/10"
    }`}>
      {fight.is_main_event && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_60%)] opacity-5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/50 to-transparent" />
        </>
      )}

      <div className="relative p-4 sm:p-6">
        {fight.is_main_event && (
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e63946]/30" />
            <span className="text-[10px] text-[#e63946] font-medium tracking-[0.3em] uppercase flex-shrink-0">
              ⭐ Combate Estelar
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e63946]/30" />
          </div>
        )}

        {/* Fighters */}
        <div className="flex items-stretch gap-2 sm:gap-3">
          <FighterButton
            fighter={fight.fighter1}
            isSelected={selectedId === fight.fighter1.id}
            onClick={() => onPredict(fight.id, fight.fighter1.id)}
            disabled={isPending}
          />
          <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0 px-0.5 sm:px-1">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <span className="font-bebas text-lg sm:text-2xl text-[#e63946] leading-none">VS</span>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
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
          <div className="mt-4 relative overflow-hidden rounded-xl border border-[#f4a261]/20 bg-[#0a0a0a] p-3 sm:p-4">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">🎙️</span>
              <span className="text-[10px] text-[#f4a261]/80 font-medium tracking-[0.3em] uppercase">
                El Comentarista
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm italic leading-relaxed">
              {prediction.ai_comment}
            </p>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <ShareFightButton fight={fight} prediction={prediction} />
        </div>

        <DebateSection fight={fight} userPrediction={prediction} />
      </div>

      {selectedId && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
      )}
    </div>
  );
}