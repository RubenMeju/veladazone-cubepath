"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface DNAData {
  dna: string;
  stats: {
    total: number;
    community_picks: number;
    underdog_picks: number;
    spanish_picks: number;
    foreign_picks: number;
    betrayals: number;
  };
}

export function DNAPredictor() {
  const { user } = useAuthStore();
  const [revealed, setRevealed] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-dna"],
    queryFn: () => api.get<DNAData>("/users/me/dna/"),
    enabled: false, // solo se llama manualmente
  });

  if (!user) return null;

  const handleReveal = () => {
    setRevealed(true);
    refetch();
  };

  // Extrae el título (primera palabra en mayúsculas antes de los dos puntos)
  const title = data?.dna.split(":")[0]?.trim() || "";
  const analysis = data?.dna.split(":").slice(1).join(":").trim() || "";

  const handleShare = () => {
    if (!data) return;
    const url = `https://laveladazone.com/perfil/${user.twitch_username}`;
    const text = `🧬 Mi ADN de predictor para La Velada del Año 6: ${title}. "${analysis.slice(0, 100)}..." #VeladaZone #VeladaDelAño6`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#f4a261]/20 rounded-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🧬</span>
          <h3 className="font-bebas text-lg text-white tracking-wider">
            TU ADN DE PREDICTOR
          </h3>
        </div>
        <p className="text-sm text-gray-600 tracking-wide mb-4">
          La IA analiza tus picks y revela tu personalidad
        </p>

        {!revealed ? (
          <button
            onClick={handleReveal}
            className="w-full bg-[#f4a261] hover:bg-[#e8943a] text-black font-bebas text-lg tracking-widest py-3 rounded-xl transition-colors cursor-pointer"
          >
            REVELAR MI ADN
          </button>
        ) : isLoading ? (
          <div className="space-y-2 py-2">
            <div className="h-6 w-32 bg-[#f4a261]/10 rounded animate-pulse mx-auto" />
            <div className="h-3 bg-white/5 rounded animate-pulse" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-3/5" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Título del ADN */}
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
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/20 to-transparent" />
              <p className="text-gray-300 text-xs leading-relaxed italic">
                {analysis}
              </p>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
                <div className="font-bebas text-xl text-white">
                  {data.stats.community_picks}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">
                  Favoritos
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
                <div className="font-bebas text-xl text-[#e63946]">
                  {data.stats.underdog_picks}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">
                  Underdogs
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
                <div className="font-bebas text-xl text-[#f4a261]">
                  {data.stats.betrayals}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">
                  Traiciones
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 text-sm border border-white/10 hover:border-white/20 text-gray-400 hover:text-white py-2 rounded-lg transition-colors tracking-widest uppercase"
              >
                𝕏 Compartir
              </button>
              <button
                onClick={() => refetch()}
                className="text-sm border border-white/5 hover:border-white/10 text-gray-600 hover:text-gray-400 px-3 py-2 rounded-lg transition-colors"
              >
                ↺
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600 text-center py-2">
            Haz al menos una predicción para descubrir tu ADN
          </p>
        )}
      </div>
    </div>
  );
}
