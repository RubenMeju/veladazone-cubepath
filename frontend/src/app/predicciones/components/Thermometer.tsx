"use client";

import { CommunityStats, Fight } from "@/types";

export function Thermometer({
  fight,
  stats,
}: {
  fight: Fight;
  stats?: CommunityStats;
}) {
  if (!stats || stats.total_votes === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between  text-gray-500 mb-1">
        <span>
          {fight.fighter1.name}{" "}
          <span className="text-[#e63946] font-medium">
            {stats.fighter1_pct}%
          </span>
        </span>
        {/* <span className="text-gray-600">{stats.total_votes} votos</span> */}
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
