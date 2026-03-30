"use client";

import { useState, useRef, useEffect } from "react";
import { Fight, Prediction } from "@/types";

export function ShareFightButton({
  fight,
  prediction,
}: {
  fight: Fight;
  prediction?: Prediction;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!prediction) return null;

  const pickedFighter = prediction.predicted_winner;
  const url = "https://laveladazone.com/predicciones";
  const text = `🥊 Apoyo a ${pickedFighter.name} ${pickedFighter.country_flag} contra ${
    fight.fighter1.id === pickedFighter.id
      ? fight.fighter2.name
      : fight.fighter1.name
  } en La Velada del Año 6. ¿Y tú? #VeladaDelAño6 #VeladaZone`;

  const shareOptions = [
    {
      label: "X (Twitter)",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      icon: "💬",
      url: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    },
    {
      label: "Telegram",
      icon: "✈️",
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      label: "Facebook",
      icon: "👤",
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-400 transition-colors tracking-widest uppercase"
      >
        <span>↗</span>
        <span>Compartir</span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 right-0 bg-[#0d0d0d] border border-white/10 rounded-xl p-2 flex flex-col gap-1 min-w-[160px] z-10 shadow-xl">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {shareOptions.map((option) => (
            <a
              key={option.label}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-gray-400 hover:text-white"
            >
              <span className="w-5 text-center">{option.icon}</span>
              <span>{option.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
