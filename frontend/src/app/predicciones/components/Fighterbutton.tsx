"use client";

import { twitchLoginUrl } from "@/lib/api";
import { Fight } from "@/types";

export function FighterButton({
  fighter,
  isSelected,
  onClick,
  disabled,
  isAuthenticated,
}: {
  fighter: Fight["fighter1"];
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isAuthenticated: boolean;
}) {
  const handleClick = () => {
    if (!isAuthenticated) {
      // guardamos intención
      localStorage.setItem("pendingVote", JSON.stringify(fighter));

      // 🚀 REDIRECT A TWITCH
      window.location.href = twitchLoginUrl;
      return;
    }

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`group flex-1 relative overflow-hidden rounded-xl p-3 sm:p-5 text-center transition-all duration-200 min-w-0 cursor-pointer w-full ${
        isSelected
          ? "bg-[#0d0d0d] border border-[#f4a261]/50"
          : "bg-[#0d0d0d] border border-white/5 hover:border-white/15"
      }`}
    >
      {isSelected && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#f4a261_0%,_transparent_70%)] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/50 to-transparent" />
        </>
      )}
      {!isSelected && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#e63946_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
      )}

      <div className="relative">
        {/* Flag */}
        <div
          className={`text-2xl sm:text-4xl mb-1.5 sm:mb-3 transition-transform duration-200 ${
            isSelected ? "scale-110" : "group-hover:scale-105"
          }`}
        >
          {fighter.country_flag}
        </div>

        {/* Name — truncate en móvil */}
        <div
          className={`font-bebas text-sm sm:text-xl md:text-2xl tracking-wider leading-tight transition-colors truncate ${
            isSelected
              ? "text-[#f4a261]"
              : "text-white group-hover:text-gray-200"
          }`}
        >
          {fighter.name}
        </div>

        {/* Country — oculto en móvil muy pequeño */}
        <div className="hidden xs:block text-[10px] text-gray-600 tracking-widest uppercase mt-0.5 sm:mt-1">
          {fighter.country}
        </div>

        {/* Pick indicator */}
        <div
          className={`mt-1.5 sm:mt-3 text-[10px] sm:text-sm tracking-widest uppercase font-medium transition-all duration-200 ${
            isSelected
              ? "text-[#f4a261] opacity-100"
              : "text-gray-700 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isSelected ? "👑 Pick" : "Elegir →"}
        </div>
      </div>
    </button>
  );
}
