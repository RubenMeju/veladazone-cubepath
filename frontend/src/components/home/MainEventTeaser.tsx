"use client";

import Link from "next/link";

export function MainEventTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#e63946]/20 bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#e63946_0%,_transparent_60%)] opacity-5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/40 to-transparent" />

        <div className="relative px-4 sm:px-8 py-10 sm:py-12 text-center">
          <div className="text-sm text-[#e63946] font-medium tracking-[0.4em] mb-8 uppercase">
            ⭐ Combate Estelar
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-12 md:gap-20">
            {/* Fighter 1 */}
            <div className="text-center group flex-1 min-w-0">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 rounded-full bg-[#e63946]/20 blur-xl group-hover:bg-[#e63946]/30 transition-colors" />
                <div className="relative w-full h-full rounded-full border-2 border-[#e63946]/50 bg-[#1a0a0a] flex items-center justify-center text-3xl sm:text-5xl md:text-6xl">
                  🇪🇸
                </div>
              </div>
              <div className="font-bebas text-xl sm:text-3xl md:text-5xl text-white tracking-wider truncate">
                ILLOJUAN
              </div>
              <div className="text-gray-600 text-[10px] tracking-widest uppercase mt-1">
                España
              </div>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />
              <span
                className="font-bebas text-3xl sm:text-5xl md:text-8xl text-[#e63946]"
                style={{ textShadow: "0 0 40px rgba(230,57,70,0.5)" }}
              >
                VS
              </span>
              <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />
            </div>

            {/* Fighter 2 */}
            <div className="text-center group flex-1 min-w-0">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 rounded-full bg-[#e63946]/20 blur-xl group-hover:bg-[#e63946]/30 transition-colors" />
                <div className="relative w-full h-full rounded-full border-2 border-[#e63946]/50 bg-[#1a0a0a] flex items-center justify-center text-3xl sm:text-5xl md:text-6xl">
                  🇪🇸
                </div>
              </div>
              <div className="font-bebas text-xl sm:text-3xl md:text-5xl text-white tracking-wider truncate">
                THEGREFG
              </div>
              <div className="text-gray-600 text-[10px] tracking-widest uppercase mt-1">
                España
              </div>
            </div>
          </div>

          <Link
            href="/predicciones"
            className="inline-flex items-center gap-2 mt-8 sm:mt-10 text-[#e63946] hover:text-white border border-[#e63946]/30 hover:border-[#e63946] hover:bg-[#e63946]/10 font-bebas text-base sm:text-lg tracking-widest px-6 sm:px-8 py-3 rounded transition-all"
          >
            ¿QUIÉN GANARÁ? HAZ TU PREDICCIÓN →
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/20 to-transparent" />
      </div>
    </section>
  );
}
