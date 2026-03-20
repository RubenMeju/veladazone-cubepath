"use client";

import { FantasyLeague } from "@/types";

export function LeagueCard({
  league,
  onSelect,
  isSelected,
}: {
  league: FantasyLeague;
  onSelect: (id: number) => void;
  isSelected: boolean;
}) {
  return (
    <div
      onClick={() => onSelect(league.id)}
      className={`bg-[#1a1a1a] border rounded-xl p-5 cursor-pointer transition-all ${
        isSelected
          ? "border-[#e63946]/50"
          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bebas text-xl text-white tracking-wide">
          {league.name}
        </h3>
        <span className="text-xs text-gray-500 bg-[#0f0f0f] px-2 py-1 rounded">
          {league.member_count} miembros
        </span>
      </div>
      {league.invite_code && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Código:</span>
          <code className="text-xs text-[#f4a261] bg-[#0f0f0f] px-2 py-1 rounded font-mono tracking-widest">
            {league.invite_code}
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(league.invite_code!);
            }}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
}
