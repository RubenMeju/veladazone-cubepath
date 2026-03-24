"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Edition, Fighter } from "@/types";
import { FighterCard } from "./components/FighterCard";
import { FightRow } from "./components/FightRow";
import { EditionInfo } from "./components/EditionInfo";

export default function StatsPage() {
  const [selectedEdition, setSelectedEdition] = useState(6);

  const { data: editions, isLoading: loadingEditions } = useQuery({
    queryKey: ["editions"],
    queryFn: () => api.get<Edition[]>("/fighters/editions/"),
  });

  const { data: fighters, isLoading: loadingFighters } = useQuery({
    queryKey: ["fighters", selectedEdition],
    queryFn: () =>
      api.get<Fighter[]>(`/fighters/list/?edition=${selectedEdition}`),
  });

  const currentEdition = editions?.find((e) => e.number === selectedEdition);

  return (
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-10">
          <div className="text-sm text-[#e63946]/60 tracking-[0.4em] uppercase mb-3 font-medium">
            Velada del Año · 2021 — 2026
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-wider leading-none mb-2">
            STATS & <span className="text-[#e63946]">HISTORIA</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Historial completo de las 6 ediciones
          </p>
        </div>

        {/* Edition tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedEdition(num)}
              className={`relative flex-shrink-0 px-5 py-2.5 rounded-lg font-bebas text-lg tracking-wider transition-all duration-150 overflow-hidden ${
                selectedEdition === num
                  ? "bg-[#e63946] text-white"
                  : "bg-[#0d0d0d] text-gray-500 hover:text-white border border-white/5 hover:border-white/10"
              }`}
            >
              {selectedEdition === num && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              )}
              <span className="relative">
                Velada {num}
                {num === 6 && <span className="ml-1 text-sm">🔥</span>}
              </span>
            </button>
          ))}
        </div>

        {/* Edition info */}
        {currentEdition && <EditionInfo edition={currentEdition} />}

        {/* Fights */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bebas text-3xl text-white tracking-wider">
              COMBATES
            </h2>
            {selectedEdition === 6 ? (
              <span className="text-[10px] text-[#e63946]/70 border border-[#e63946]/20 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                Pendientes
              </span>
            ) : (
              <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                {currentEdition?.fights.length} combates
              </span>
            )}
          </div>

          {loadingEditions ? (
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-[#0d0d0d] border border-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {currentEdition?.fights.map((fight) => (
                <FightRow key={fight.id} fight={fight} />
              ))}
            </div>
          )}
        </div>

        {/* Fighters */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bebas text-3xl text-white tracking-wider">
              LUCHADORES
            </h2>
            {!loadingFighters && fighters && (
              <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                {fighters.length} participantes
              </span>
            )}
          </div>

          {loadingFighters ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-[#0d0d0d] border border-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {fighters?.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
