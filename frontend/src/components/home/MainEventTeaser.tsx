"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CommunityStats, Fight } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function MainEventTeaser() {
  const { data: fights = [] } = useQuery({
    queryKey: ["fights", 6],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/fighters/fights/?edition=6`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats = [] } = useQuery({
    queryKey: ["community-stats"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/predictions/community_stats/`);
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 30000,
  });

  const mainEvent = (fights as Fight[]).find((f) => f.is_main_event);
  const mainEventStats = mainEvent
    ? (stats as CommunityStats[]).find((s) => s.fight_id === mainEvent.id)
    : null;

  const pct1 = mainEventStats?.fighter1_pct ?? 50;
  const pct2 = mainEventStats?.fighter2_pct ?? 50;
  const total = mainEventStats?.total_votes ?? 0;
  const winner = pct1 > pct2 ? "fighter1" : pct2 > pct1 ? "fighter2" : null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a]">
        {/* Línea superior roja */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e63946] to-transparent" />

        {/* Glow central de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(230,57,70,0.12),transparent)]" />

        {/* Líneas decorativas diagonales */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white"
              style={{
                width: "150%",
                top: `${10 + i * 12}%`,
                left: "-25%",
                transform: `rotate(-8deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative px-6 sm:px-10 py-10 sm:py-14">
          {/* Badge superior */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#e63946]/40" />
            <span className="text-xs md:text-lg text-[#e63946] font-medium tracking-[0.5em] uppercase">
              ⭐ Combate Estelar
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#e63946]/40" />
          </div>

          {/* Arena de combate */}
          <div className="flex items-center justify-center gap-0 sm:gap-4 mb-10">
            {/* Fighter 1 — IlloJuan */}
            <div className="flex-1 flex flex-col items-center group">
              {/* Hexágono / avatar */}
              <div className="relative mb-4">
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl border flex items-center justify-center text-4xl sm:text-6xl md:text-7xl transition-all duration-500"
                  style={{
                    background:
                      winner === "fighter1"
                        ? "linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%)"
                        : "#0f0f0f",
                    borderColor:
                      winner === "fighter1"
                        ? "rgba(230,57,70,0.6)"
                        : "rgba(255,255,255,0.06)",
                    boxShadow:
                      winner === "fighter1"
                        ? "0 0 40px rgba(230,57,70,0.2), inset 0 1px 0 rgba(230,57,70,0.2)"
                        : "none",
                  }}
                >
                  🇪🇸
                </div>
                {winner === "fighter1" && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#f4a261] rounded-full flex items-center justify-center text-sm shadow-lg animate-bounce">
                    👑
                  </div>
                )}
              </div>

              <div className="font-bebas text-2xl sm:text-4xl md:text-5xl text-white tracking-widest leading-none mb-1">
                ILLOJUAN
              </div>
              <div className="text-[10px] text-gray-600 tracking-[0.3em] uppercase mb-3">
                España
              </div>

              {/* Porcentaje grande */}
              <div
                className="font-bebas text-4xl sm:text-5xl md:text-6xl leading-none transition-all duration-700"
                style={{
                  color: winner === "fighter1" ? "#e63946" : "#333",
                  textShadow:
                    winner === "fighter1"
                      ? "0 0 30px rgba(230,57,70,0.5)"
                      : "none",
                }}
              >
                {pct1}%
              </div>
            </div>

            {/* VS central */}
            <div className="flex flex-col items-center px-2 sm:px-6 flex-shrink-0">
              <div className="w-px h-12 sm:h-20 bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent mb-2" />
              <div
                className="font-bebas text-4xl sm:text-6xl md:text-8xl leading-none"
                style={{
                  color: "#e63946",
                  textShadow:
                    "0 0 60px rgba(230,57,70,0.6), 0 0 120px rgba(230,57,70,0.2)",
                  letterSpacing: "0.05em",
                }}
              >
                VS
              </div>
              <div className="w-px h-12 sm:h-20 bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent mt-2" />
            </div>

            {/* Fighter 2 — TheGrefg */}
            <div className="flex-1 flex flex-col items-center group">
              <div className="relative mb-4">
                <div
                  className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl border flex items-center justify-center text-4xl sm:text-6xl md:text-7xl transition-all duration-500"
                  style={{
                    background:
                      winner === "fighter2"
                        ? "linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%)"
                        : "#0f0f0f",
                    borderColor:
                      winner === "fighter2"
                        ? "rgba(230,57,70,0.6)"
                        : "rgba(255,255,255,0.06)",
                    boxShadow:
                      winner === "fighter2"
                        ? "0 0 40px rgba(230,57,70,0.2), inset 0 1px 0 rgba(230,57,70,0.2)"
                        : "none",
                  }}
                >
                  🇪🇸
                </div>
                {winner === "fighter2" && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#f4a261] rounded-full flex items-center justify-center text-sm shadow-lg animate-bounce">
                    👑
                  </div>
                )}
              </div>

              <div className="font-bebas text-2xl sm:text-4xl md:text-5xl text-white tracking-widest leading-none mb-1">
                THEGREFG
              </div>
              <div className="text-[10px] text-gray-600 tracking-[0.3em] uppercase mb-3">
                España
              </div>

              <div
                className="font-bebas text-4xl sm:text-5xl md:text-6xl leading-none transition-all duration-700"
                style={{
                  color: winner === "fighter2" ? "#e63946" : "#333",
                  textShadow:
                    winner === "fighter2"
                      ? "0 0 30px rgba(230,57,70,0.5)"
                      : "none",
                }}
              >
                {pct2}%
              </div>
            </div>
          </div>

          {/* Barra de votación */}
          <div className="max-w-xs sm:max-w-sm mx-auto mb-3 md:w-1/3">
            {/* Labels arriba */}
            <div className="flex justify-between text-[10px] tracking-widest mb-1.5">
              <span className="text-[#e63946]">ILLOJUAN {pct1}%</span>
              <span className="text-[#f4a261]">{pct2}% THEGREFG</span>
            </div>

            {/* Barra */}
            <div className="relative h-1.5 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#e63946] transition-all duration-700 ease-out"
                style={{ width: `${pct1}%` }}
              />
              <div
                className="h-full bg-[#f4a261] transition-all duration-700 ease-out"
                style={{ width: `${pct2}%` }}
              />
            </div>
          </div>

          {/* Stats de votos */}
          <div className="text-center mb-10">
            {total > 0 ? (
              <p className="text-[11px] text-gray-600 tracking-widest">
                <span className="text-[#e63946]">{pct1}%</span> IlloJuan
                {" · "}
                <span className="text-gray-500">
                  {total.toLocaleString()} votos
                </span>
                {" · "}
                <span className="text-[#f4a261]">{pct2}%</span> TheGrefg
              </p>
            ) : (
              <p className="text-[11px] text-gray-600 tracking-widest">
                ¡Sé el primero en predecir!
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/predicciones"
              className="inline-flex items-center gap-2 mt-8 sm:mt-10 text-[#e63946] hover:text-white border border-[#e63946]/30 hover:border-[#e63946] hover:bg-[#e63946]/10 font-bebas text-base sm:text-lg tracking-widest px-6 sm:px-8 py-3 rounded transition-all"
              style={{
                boxShadow:
                  "0 0 40px rgba(230,57,70,0.35), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <span className="text-xl">🥊</span>
              ¿QUIÉN GANARÁ? PREDICE AHORA
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>

            {total > 0 && (
              <p className=" text-gray-600">
                Únete a{" "}
                <span className="text-gray-400 font-medium">
                  {total.toLocaleString()}
                </span>{" "}
                predictores
              </p>
            )}
          </div>
        </div>

        {/* Línea inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/20 to-transparent" />
      </div>
    </section>
  );
}
