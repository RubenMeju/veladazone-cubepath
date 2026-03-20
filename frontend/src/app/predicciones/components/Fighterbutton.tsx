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
      className={`flex-1 rounded-xl p-4 text-center transition-all border-2 ${
        isSelected
          ? "border-[#f4a261] bg-[#f4a261]/10"
          : "border-transparent bg-[#0f0f0f] hover:border-[#2a2a2a]"
      }`}
    >
      <div className="text-3xl mb-2">{fighter.country_flag}</div>
      <div className="font-bebas text-xl text-white tracking-wide">
        {fighter.name}
      </div>
      <div className="text-xs text-gray-500">{fighter.country}</div>
      {isSelected && (
        <div className="mt-2 text-xs text-[#f4a261] font-medium">
          👑 Tu pick
        </div>
      )}
    </button>
  );
}
