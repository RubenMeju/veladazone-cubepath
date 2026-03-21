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
    queryKey: ["fighters"],
    queryFn: () => api.get<Fighter[]>("/fighters/list/"),
  });

  const currentEdition = editions?.find((e) => e.number === selectedEdition);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          STATS & <span className="text-[#e63946]">HISTORIA</span>
        </h1>
        <p className="text-gray-400">
          Historial completo de las 6 ediciones de La Velada del Año
        </p>
      </div>

      {/* Edition tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedEdition(num)}
            className={`flex-shrink-0 px-5 py-2 rounded-lg font-bebas text-lg tracking-wider transition-colors ${
              selectedEdition === num
                ? "bg-[#e63946] text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]"
            }`}
          >
            Velada {num}
            {num === 6 && <span className="ml-1 text-xs">🔥</span>}
          </button>
        ))}
      </div>

      {/* Edition info */}
      {currentEdition && <EditionInfo edition={currentEdition} />}

      {/* Fights */}
      <div className="mb-12">
        <h2 className="font-bebas text-3xl text-white mb-4 tracking-wider">
          COMBATES
          {selectedEdition === 6 && (
            <span className="ml-3 text-sm text-[#e63946] font-sans font-normal">
              Pendientes
            </span>
          )}
        </h2>
        {loadingEditions ? (
          <div className="text-gray-500 text-center py-12">
            Cargando combates...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {currentEdition?.fights.map((fight) => (
              <FightRow key={fight.id} fight={fight} />
            ))}
          </div>
        )}
      </div>

      {/* Fighters grid */}
      <div>
        <h2 className="font-bebas text-3xl text-white mb-4 tracking-wider">
          LUCHADORES
        </h2>
        {loadingFighters ? (
          <div className="text-gray-500 text-center py-12">
            Cargando luchadores...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fighters?.map((fighter) => (
              <FighterCard key={fighter.id} fighter={fighter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
