"use client";

import { FantasyLeague } from "@/types";

export function LeagueCard({
  league,
  onSelect,
  isSelected,
  onJoin,
  isMember,
}: {
  league: FantasyLeague;
  onSelect: (id: number) => void;
  isSelected: boolean;
  onJoin?: (leagueId: number) => void;
  isMember?: boolean;
}) {
  const isPrivate = league.is_private;

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
        <h3 className="font-bebas text-xl text-white tracking-wide flex items-center gap-2">
          {isPrivate ? "🔒" : "🔓"} {league.name}
        </h3>
        <span className="text-xs text-gray-500 bg-[#0f0f0f] px-2 py-1 rounded">
          {league.member_count} miembros
        </span>
      </div>

      {isPrivate ? (
        // Liga privada: mostrar código y copiar
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/fantasy/invite/${league.invite_code}`;
              navigator.share?.({ title: league.name, url }) ??
                navigator.clipboard.writeText(url);
            }}
            className="text-xs text-gray-500 hover:text-white transition-colors"
            title="Compartir enlace de invitación"
          >
            🔗
          </button>
        </div>
      ) : (
        // Liga pública: mostrar botón "Unirse" si no eres miembro
        <div className="flex items-center gap-2">
          {isMember ? (
            <span className="text-xs text-gray-500">Liga pública</span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoin?.(league.id);
              }}
              className="text-xs bg-[#e63946] hover:bg-[#c1121f] text-white px-2 py-1 rounded transition-colors"
            >
              Unirse
            </button>
          )}
        </div>
      )}
    </div>
  );
}
