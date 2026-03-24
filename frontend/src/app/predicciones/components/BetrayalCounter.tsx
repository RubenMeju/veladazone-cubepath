"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

interface BetrayalData {
  total_betrayals: number;
  details: {
    fight: string;
    betrayed: string | null;
    current: string;
    times: number;
  }[];
}

export function BetrayalCounter() {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["betrayals"],
    queryFn: () => api.get<BetrayalData>("/predictions/betrayals/"),
    enabled: !!user,
  });

  if (!user || !data || data.total_betrayals === 0) return null;

  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#e63946]/15 rounded-2xl">
      {/* Glow top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/25 to-transparent" />
      {/* Glow corner */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_left,_#e63946_0%,_transparent_70%)] opacity-8 pointer-events-none" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🗡️</span>
            <h3 className="font-bebas text-lg text-white tracking-wider">
              TRAICIONES
            </h3>
          </div>
          {/* Big number */}
          <span
            className="font-bebas text-4xl text-[#e63946] leading-none"
            style={{ textShadow: "0 0 20px rgba(230,57,70,0.4)" }}
          >
            {data.total_betrayals}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#e63946]/20 to-transparent mb-3" />

        {/* Details */}
        <div className="flex flex-col gap-2.5">
          {data.details.map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-[#e63946]/40 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Traicionaste a{" "}
                <span className="text-gray-400">{d.betrayed}</span>
                {d.times > 1 && (
                  <span className="text-[#e63946]/60"> ×{d.times}</span>
                )}{" "}
                — ahora apoyas a{" "}
                <span className="text-[#f4a261]">{d.current}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
