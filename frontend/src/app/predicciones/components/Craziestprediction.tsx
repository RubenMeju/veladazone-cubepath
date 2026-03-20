"use client";

import { CommunityStats } from "./types";

export function CraziestPrediction({ stats }: { stats?: CommunityStats[] }) {
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
