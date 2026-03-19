"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Edition, Fighter } from "@/types";

function FighterCard({ fighter }: { fighter: Fighter }) {
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
      <div className="flex gap-3">
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
        <p className="text-gray-500 text-xs mt-3 leading-relaxed line-clamp-2">
          {fighter.bio}
        </p>
      )}
    </div>
  );
}

function FightRow({ fight }: { fight: any }) {
  return (
    <div
      className={`bg-[#1a1a1a] border rounded-xl p-4 ${fight.is_main_event ? "border-[#e63946]/50" : "border-[#2a2a2a]"}`}
    >
      {fight.is_main_event && (
        <div className="text-[10px] text-[#e63946] font-medium tracking-widest mb-2">
          COMBATE ESTELAR
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <span
            className={`font-bebas text-lg ${fight.winner?.id === fight.fighter1.id ? "text-white" : "text-gray-500"}`}
          >
            {fight.fighter1.name}
            {fight.winner?.id === fight.fighter1.id && " 👑"}
          </span>
          <div className="text-xs text-gray-600">
            {fight.fighter1.country_flag}
          </div>
        </div>
        <div className="text-center px-3">
          <div className="font-bebas text-[#e63946] text-xl">VS</div>
          {fight.is_completed && (
            <div className="text-[10px] text-gray-500 uppercase">
              {fight.result_method}
            </div>
          )}
        </div>
        <div className="flex-1 text-left">
          <span
            className={`font-bebas text-lg ${fight.winner?.id === fight.fighter2.id ? "text-white" : "text-gray-500"}`}
          >
            {fight.winner?.id === fight.fighter2.id && "👑 "}
            {fight.fighter2.name}
          </span>
          <div className="text-xs text-gray-600">
            {fight.fighter2.country_flag}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {currentEdition && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-8">
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Edición
              </div>
              <div className="font-bebas text-2xl text-white">
                Velada del Año {currentEdition.number}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Año
              </div>
              <div className="font-bebas text-2xl text-white">
                {currentEdition.year}
              </div>
            </div>
            {currentEdition.city && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Ciudad
                </div>
                <div className="font-bebas text-2xl text-white">
                  {currentEdition.city}
                </div>
              </div>
            )}
            {currentEdition.venue && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Sede
                </div>
                <div className="font-bebas text-2xl text-white">
                  {currentEdition.venue}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Combates
              </div>
              <div className="font-bebas text-2xl text-white">
                {currentEdition.fights.length}
              </div>
            </div>
          </div>
        </div>
      )}

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
