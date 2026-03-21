"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Fighter } from "@/types";

export function FighterCard({ fighter }: { fighter: Fighter }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    if (analysis) {
      setAnalysis(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<{ analysis: string }>(
        `/fighters/${fighter.id}/analysis/`,
      );
      setAnalysis(data.analysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#e63946]/50 transition-all">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-2xl flex-shrink-0">
          {fighter.country_flag}
        </div>
        <div>
          <h3 className="font-bebas text-xl text-white tracking-wide">
            {fighter.name}
          </h3>
          <p className="text-gray-500 text-sm">{fighter.country}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-[#0f0f0f] rounded-lg p-2 text-center">
          <div className="font-bebas text-2xl text-green-400">
            {fighter.record.wins}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Victorias
          </div>
        </div>
        <div className="flex-1 bg-[#0f0f0f] rounded-lg p-2 text-center">
          <div className="font-bebas text-2xl text-[#e63946]">
            {fighter.record.losses}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">
            Derrotas
          </div>
        </div>
      </div>

      {fighter.bio && (
        <p className="text-gray-500 text-xs mb-3 leading-relaxed line-clamp-2">
          {fighter.bio}
        </p>
      )}

      {/* Botón análisis IA */}
      <button
        onClick={handleAnalysis}
        disabled={loading}
        className="w-full text-xs bg-[#0f0f0f] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#e63946]/50 text-gray-400 hover:text-white py-2 rounded-lg transition-all disabled:opacity-50"
      >
        {loading
          ? "Analizando..."
          : analysis
            ? "✕ Cerrar análisis"
            : "🤖 Análisis IA"}
      </button>

      {/* Análisis */}
      {analysis && (
        <div className="mt-3 bg-[#0f0f0f] border border-[#e63946]/20 rounded-lg p-3">
          <div className="text-[10px] text-[#e63946] tracking-wider mb-1">
            ANÁLISIS IA
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  );
}
