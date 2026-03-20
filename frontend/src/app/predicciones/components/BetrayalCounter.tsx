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
    <div className="bg-[#1a1a1a] border border-[#e63946]/20 rounded-2xl p-6">
      <h3 className="font-bebas text-xl text-white tracking-wider mb-1">
        🗡️ CONTADOR DE TRAICIONES
      </h3>
      <p className="text-[#e63946] font-bebas text-4xl mb-3">
        {data.total_betrayals}
      </p>
      <div className="flex flex-col gap-2">
        {data.details.map((d, i) => (
          <div key={i} className="text-xs text-gray-500 leading-relaxed">
            Has traicionado a{" "}
            <span className="text-gray-300 font-medium">{d.betrayed}</span>{" "}
            {d.times} {d.times === 1 ? "vez" : "veces"} — ahora apoyas a{" "}
            <span className="text-[#f4a261] font-medium">{d.current}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
