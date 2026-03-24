"use client";

import { CountdownSection } from "@/components/home/CountdownSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { MainEventTeaser } from "@/components/home/MainEventTeaser";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-[0.06]" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#e63946]/5 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_left,_#1a0a0a_0%,_transparent_70%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_#1a0a0a_0%,_transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/20 via-transparent to-transparent -translate-x-32 rotate-12 origin-top" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/15 via-transparent to-transparent translate-x-32 -rotate-12 origin-top" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Event badge */}
          <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/25 rounded-full px-4 py-2 text-[#e63946] mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse flex-shrink-0" />
            <span className="tracking-widest text-[10px] sm:text-sm font-medium uppercase">
              25 Julio 2026 · Estadio La Cartuja · Sevilla
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bebas text-[clamp(3rem,12vw,8rem)] text-white tracking-wider leading-none mb-2">
            VELADA DEL AÑO
          </h1>

          {/* The 6 */}
          <div className="relative mb-6 leading-none">
            <span
              className="font-bebas text-[clamp(6rem,25vw,18rem)] leading-none select-none block"
              style={{
                WebkitTextStroke: "2px #e63946",
                color: "transparent",
                textShadow:
                  "0 0 80px rgba(230,57,70,0.4), 0 0 160px rgba(230,57,70,0.2)",
              }}
            >
              6
            </span>
          </div>

          <p className="text-gray-400 text-sm sm:text-base max-w-sm sm:max-w-xl mx-auto mb-10 leading-relaxed px-2">
            Haz tus predicciones, compite en ligas con amigos y vive la noche
            más épica del streaming hispano.
          </p>

          {/* Countdown */}
          <CountdownSection />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Link
              href="/predicciones"
              className="group relative overflow-hidden bg-[#e63946] hover:bg-[#c1121f] text-white font-bebas text-lg sm:text-xl tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded transition-all duration-200"
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              HACER PREDICCIONES
            </Link>
            <Link
              href="/fantasy"
              className="group relative overflow-hidden bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white font-bebas text-lg sm:text-xl tracking-widest px-8 sm:px-10 py-3 sm:py-4 rounded transition-all duration-200"
            >
              CREAR LIGA FANTASY
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white animate-pulse" />
        </div>
      </section>

      <MainEventTeaser />
      <FeaturesGrid />
    </div>
  );
}
