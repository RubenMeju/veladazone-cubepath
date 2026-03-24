"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Fighter } from "@/types";

export function FighterCard({ fighter }: { fighter: Fighter }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalysis = async () => {
    if (analysis) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<{ analysis: string }>(
        `/fighters/${fighter.id}/analysis/`,
      );
      setAnalysis(data.analysis);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const totalFights = fighter.record.wins + fighter.record.losses;
  const winRate =
    totalFights > 0 ? Math.round((fighter.record.wins / totalFights) * 100) : 0;

  return (
    <>
      <div className="group relative flex flex-col h-full bg-[#0d0d0d] border border-white/5 rounded-xl hover:border-white/10 transition-all duration-300 overflow-hidden">
        <div className="relative p-4 flex flex-col h-full uppercase">
          {/* SECCIÓN SUPERIOR: Nombre y Bandera */}
          <div className="flex items-start gap-3 mb-4 min-h-14 md:min-h-16">
            <div className="flex-1 min-w-0">
              <h3 className="font-bebas text-lg md:text-xl text-white tracking-wide leading-tight break-all group-hover:text-[#e63946] transition-colors line-clamp-2">
                {fighter.name}
              </h3>
              <p className="text-[9px] text-gray-500 tracking-widest mt-0.5 truncate">
                {fighter.country}
              </p>
            </div>
          </div>

          {/* SECCIÓN MEDIA: Stats */}
          <div className="grid grid-cols-3 gap-1 md:gap-1.5 mb-4">
            <StatBox
              label="Wins"
              value={fighter.record.wins}
              color="text-green-400"
            />
            <StatBox
              label="Losses"
              value={fighter.record.losses}
              color="text-[#e63946]"
            />
            <StatBox
              label="Win %"
              value={`${winRate}%`}
              color="text-[#f4a261]"
            />
          </div>

          {/* Barra de progreso */}
          {totalFights > 0 && (
            <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-500 via-[#f4a261] to-[#e63946]/50 transition-all duration-1000"
                style={{ width: `${winRate}%` }}
              />
            </div>
          )}

          {/* SECCIÓN BIO */}
          <div className="flex-grow mb-5">
            {fighter.bio && (
              <p className="text-xs md:text-xs text-gray-500 italic leading-relaxed">
                &quot;{fighter.bio}&quot;
              </p>
            )}
          </div>

          {/* SECCIÓN INFERIOR: Botón */}
          <div className="mt-auto">
            <button
              onClick={handleAnalysis}
              disabled={loading}
              className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:bg-[#e63946] hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Analizando..." : "🤖 Análisis IA"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-[#0d0d0d] border border-white/10 w-full sm:max-w-96 md:max-w-112.5 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-1 w-full bg-linear-to-r from-transparent via-[#e63946] to-transparent opacity-50" />
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#e63946] font-black tracking-widest uppercase">
                    IA Intel Report
                  </span>
                  <div className="h-0.5 w-8 bg-[#e63946] mt-1" />
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-white transition-colors p-1"
                >
                  <span className="text-xl leading-none">✕</span>
                </button>
              </div>

              <h4 className="font-bebas text-2xl md:text-3xl text-white mb-5 tracking-wider uppercase leading-none">
                {fighter.name}
              </h4>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5 max-h-96 overflow-y-auto custom-scrollbar">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed italic">
                  {analysis}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-6 py-3.5 bg-[#e63946] text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-[#ff4d5a] transition-all active:scale-95"
              >
                Cerrar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-lg py-2 flex flex-col items-center justify-center min-w-0 overflow-hidden">
      <span
        className={`font-bebas ${color} leading-none mb-0.5 text-base md:text-xl sm:text-lg whitespace-nowrap`}
      >
        {value}
      </span>
      <span className="text-[7px] md:text-[9px] text-gray-600 uppercase font-bold tracking-tighter truncate w-full text-center px-0.5">
        {label}
      </span>
    </div>
  );
}
