"use client";

import { DNAData } from "../hooks/useDNA";

interface Props {
  data: DNAData;
  title: string;
  analysis: string;
  username: string;
  onShare: () => void;
  onRefresh: () => void;
}

export function DNAResult({
  data,
  title,
  analysis,
  onShare,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Título */}
      <div className="text-center">
        <div
          className="font-bebas text-4xl text-[#f4a261] tracking-widest"
          style={{ textShadow: "0 0 30px rgba(244,162,97,0.4)" }}
        >
          {title}
        </div>
      </div>

      {/* Análisis */}
      <div className="bg-[#0a0a0a] border border-[#f4a261]/10 rounded-xl p-4">
        <p className="text-gray-300 text-xs leading-relaxed italic">
          {analysis}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Favoritos" value={data.stats.community_picks} />
        <Stat label="Underdogs" value={data.stats.underdog_picks} danger />
        <Stat label="Traiciones" value={data.stats.betrayals} highlight />
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onShare}
          className="flex-1 text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-white py-2 rounded-lg tracking-widest uppercase"
        >
          𝕏 Compartir
        </button>

        <button
          onClick={onRefresh}
          className="text-sm border border-white/5 hover:border-white/10 text-gray-600 hover:text-gray-400 px-3 py-2 rounded-lg"
        >
          ↺
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
  highlight,
}: {
  label: string;
  value: number;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
      <div
        className={`font-bebas text-xl ${
          danger
            ? "text-[#e63946]"
            : highlight
              ? "text-[#f4a261]"
              : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-600 uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
