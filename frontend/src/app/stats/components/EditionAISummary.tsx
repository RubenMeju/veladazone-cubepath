"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SummaryData {
  summary: string;
}

export function EditionAISummary({ editionNumber }: { editionNumber: number }) {
  const [requested, setRequested] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["edition-summary", editionNumber],
    queryFn: () =>
      api.get<SummaryData>(`/fighters/editions/${editionNumber}/summary/`),
    enabled: requested,
  });

  return (
    <div className="mt-4">
      {!requested ? (
        <button
          onClick={() => setRequested(true)}
          className="w-full relative overflow-hidden bg-[#0d0d0d] border border-[#f4a261]/20 hover:border-[#f4a261]/40 rounded-xl px-5 py-3 transition-all group cursor-pointer"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#f4a261_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
          <div className="flex items-center justify-center gap-2">
            <span className="text-base">🎙️</span>
            <span className="font-bebas text-lg text-[#f4a261]/80 group-hover:text-[#f4a261] tracking-widest transition-colors uppercase">
              Que la IA cuente esta historia
            </span>
          </div>
        </button>
      ) : isLoading ? (
        <div className="bg-[#0d0d0d] border border-[#f4a261]/10 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#f4a261]/40 animate-pulse" />
            <span className="text-sm text-[#f4a261]/50 tracking-widest uppercase animate-pulse">
              Narrando...
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-4/6" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-3/6" />
        </div>
      ) : data ? (
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#f4a261]/20 rounded-xl p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">🎙️</span>
            <span className="text-[10px] text-[#f4a261]/70 tracking-[0.3em] uppercase">
              Narración IA
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed italic">
            {data.summary}
          </p>
        </div>
      ) : null}
    </div>
  );
}
