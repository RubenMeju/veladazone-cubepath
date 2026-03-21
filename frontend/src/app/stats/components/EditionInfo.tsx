"use client";

import { Edition } from "@/types";

export function EditionInfo({ edition }: { edition: Edition }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-8">
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Edición
          </div>
          <div className="font-bebas text-2xl text-white">
            Velada del Año {edition.number}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Año
          </div>
          <div className="font-bebas text-2xl text-white">{edition.year}</div>
        </div>
        {edition.city && (
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Ciudad
            </div>
            <div className="font-bebas text-2xl text-white">{edition.city}</div>
          </div>
        )}
        {edition.venue && (
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Sede
            </div>
            <div className="font-bebas text-2xl text-white">
              {edition.venue}
            </div>
          </div>
        )}
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Combates
          </div>
          <div className="font-bebas text-2xl text-white">
            {edition.fights.length}
          </div>
        </div>
      </div>
    </div>
  );
}
