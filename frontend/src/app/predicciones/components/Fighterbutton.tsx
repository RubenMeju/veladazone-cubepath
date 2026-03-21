"use client";

import { Fight } from "@/types";

export function FighterButton({
  fighter,
  isSelected,
  onClick,
  disabled,
}: {
  fighter: Fight["fighter1"];
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex-1 relative overflow-hidden rounded-xl p-5 text-center transition-all duration-200 ${
        isSelected
          ? "bg-[#0d0d0d] border border-[#f4a261]/50"
          : "bg-[#0d0d0d] border border-white/5 hover:border-white/15"
      }`}
    >
      {/* Selected glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#f4a261_0%,_transparent_70%)] opacity-10 pointer-events-none" />
      )}
      {/* Hover glow */}
      {!isSelected && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#e63946_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
      )}
      {/* Top shine on selected */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/50 to-transparent" />
      )}

      <div className="relative">
        {/* Flag */}
        <div
          className={`text-4xl mb-3 transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}
        >
          {fighter.country_flag}
        </div>

        {/* Name */}
        <div
          className={`font-bebas text-xl md:text-2xl tracking-wider leading-tight transition-colors ${
            isSelected
              ? "text-[#f4a261]"
              : "text-white group-hover:text-gray-200"
          }`}
        >
          {fighter.name}
        </div>

        {/* Country */}
        <div className="text-[11px] text-gray-600 tracking-widest uppercase mt-1">
          {fighter.country}
        </div>

        {/* Pick indicator */}
        <div
          className={`mt-3 text-[11px] tracking-widest uppercase font-medium transition-all duration-200 ${
            isSelected
              ? "text-[#f4a261] opacity-100"
              : "text-gray-700 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isSelected ? "👑 Tu pick" : "Elegir →"}
        </div>
      </div>
    </button>
  );
}
