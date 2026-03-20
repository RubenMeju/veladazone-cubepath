"use client";

import { CommunityStats, Fight, Prediction } from "@/types";
import { FighterButton } from "./Fighterbutton";
import { Thermometer } from "./Thermometer";

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
