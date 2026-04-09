"use client";

import { useState, useEffect } from "react";
import { TrendingUp, X, Trophy } from "lucide-react";
import Link from "next/link";

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece después de 800px de scroll
      if (window.scrollY > 800 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-20 opacity-0 scale-90 pointer-events-none"
      }`}
    >
      {/* Contenedor con borde "Neon" sutil */}
      <div className="relative group bg-[#0a0a0a] border-2 border-red-600/50 p-1 rounded-sm shadow-[0_0_30px_rgba(220,38,38,0.2)]">
        {/* Botón Cerrar Estilo Minimalista */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 hover:bg-white hover:text-red-600 transition-colors z-20 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative overflow-hidden bg-black p-5 pr-8">
          {/* Marca de agua de fondo (VI) */}
          <div className="absolute -bottom-4 -right-2 text-6xl font-black italic text-white/[0.03] select-none pointer-events-none">
            VI
          </div>

          <div className="flex items-center gap-5">
            {/* Icono con animación de pulso de combate */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-red-600 blur-md opacity-40 animate-pulse rounded-full"></div>
              <div className="relative w-14 h-14 bg-red-600 flex items-center justify-center rounded-sm rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white -rotate-3 group-hover:rotate-0 transition-transform" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-white font-black italic uppercase tracking-tighter text-xl leading-none">
                ¿Quién gana el <span className="text-red-600">MAIN EVENT?</span>
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                Tu predicción puede ser la ganadora
              </p>

              <Link
                href="/predicciones"
                className="relative inline-block overflow-hidden bg-white text-black font-black uppercase italic py-2 px-4 text-center text-sm group/btn transition-all hover:bg-red-600 hover:text-white"
              >
                <span className="relative z-10">¡Votar Ahora!</span>
                {/* Efecto de brillo al pasar el ratón */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
