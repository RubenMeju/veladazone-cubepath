"use client";

import { CommunityStats } from "@/types";

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
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#e63946]/20 rounded-2xl">
      {/* Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_bottom_right,_#e63946_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎲</span>
          <h3 className="font-bebas text-lg text-white tracking-wider">
            LA PREDICCIÓN MÁS LOCA
          </h3>
        </div>

        {/* Big percentage */}
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="font-bebas text-5xl text-[#e63946] leading-none"
            style={{ textShadow: "0 0 30px rgba(230,57,70,0.4)" }}
          >
            {underdog_pct}%
          </span>
          <span className="text-xs text-gray-600 tracking-wide">
            de la comunidad
          </span>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed">
          apoya al <span className="text-gray-300">underdog</span> de este
          combate.{" "}
          <span className="text-[#e63946]/70">¿Eres de los valientes?</span>
        </p>

        {/* Bar showing how crazy it is */}
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#e63946] to-[#f4a261] rounded-full transition-all duration-700"
            style={{ width: `${underdog_pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-700">0%</span>
          <span className="text-[10px] text-gray-700">50%</span>
        </div>
      </div>
    </div>
  );
}
