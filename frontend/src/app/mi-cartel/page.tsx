"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { api } from "@/lib/api";
import { Prediction } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { twitchLoginUrl } from "@/lib/api";
import Link from "next/link";

function PosterCard({
  predictions,
  username,
}: {
  predictions: Prediction[];
  username: string;
}) {
  const mainEvent = predictions.find((p) => p.fight.is_main_event);
  const rest = predictions.filter((p) => !p.fight.is_main_event);

  return (
    <div className="bg-[#0a0a0a] border border-[#e63946]/40 rounded-2xl p-8 w-full max-w-lg mx-auto relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e63946]/10 via-transparent to-[#f4a261]/5 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-[10px] text-[#e63946] tracking-widest mb-1">
            MIS PREDICCIONES
          </div>
          <div className="font-bebas text-4xl text-white tracking-wider">
            VELADA DEL AÑO 6
          </div>
          <div className="text-xs text-gray-500 mt-1">
            25 · 07 · 2026 · SEVILLA
          </div>
          <div className="mt-2 text-sm text-[#f4a261]">@{username}</div>
        </div>

        {/* Main event */}
        {mainEvent && (
          <div className="bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl p-4 mb-4 text-center">
            <div className="text-[9px] text-[#e63946] tracking-widest mb-2">
              ⭐ COMBATE ESTELAR
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg">
                {mainEvent.fight.fighter1.country_flag}
              </span>
              <div className="text-center">
                <div
                  className={`font-bebas text-xl ${mainEvent.predicted_winner.id === mainEvent.fight.fighter1.id ? "text-[#f4a261]" : "text-gray-600"}`}
                >
                  {mainEvent.fight.fighter1.name}
                  {mainEvent.predicted_winner.id ===
                    mainEvent.fight.fighter1.id && " 👑"}
                </div>
              </div>
              <div className="font-bebas text-[#e63946] text-lg">VS</div>
              <div className="text-center">
                <div
                  className={`font-bebas text-xl ${mainEvent.predicted_winner.id === mainEvent.fight.fighter2.id ? "text-[#f4a261]" : "text-gray-600"}`}
                >
                  {mainEvent.predicted_winner.id ===
                    mainEvent.fight.fighter2.id && "👑 "}
                  {mainEvent.fight.fighter2.name}
                </div>
              </div>
              <span className="text-lg">
                {mainEvent.fight.fighter2.country_flag}
              </span>
            </div>
          </div>
        )}

        {/* Rest of fights */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {rest.map((p) => (
            <div
              key={p.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 text-center"
            >
              <div className="text-lg mb-1">👑</div>
              <div className="font-bebas text-sm text-[#f4a261] leading-tight">
                {p.predicted_winner.name}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                vs{" "}
                {p.fight.fighter1.id === p.predicted_winner.id
                  ? p.fight.fighter2.name
                  : p.fight.fighter1.name}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center border-t border-[#2a2a2a] pt-4">
          <div className="font-bebas text-lg text-white tracking-widest">
            🥊 VELADAZONE.COM
          </div>
          <div className="text-[10px] text-gray-600 mt-1">
            Haz tus predicciones en veladazone.com
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MiCartelPage() {
  const { isAuthenticated, user } = useAuthStore();
  const posterRef = useRef<HTMLDivElement>(null);

  const { data: predictions, isLoading } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: () => api.get<Prediction[]>("/predictions/"),
    enabled: isAuthenticated(),
  });

  const handleShare = (platform: string) => {
    const url = "https://veladazone.com";
    const text = `🥊 Mis predicciones para La Velada del Año 6 están listas. ¿Las tuyas? #VeladaZone #VeladaDelAño6`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      );
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-bebas text-5xl text-white mb-4">
          MI <span className="text-[#e63946]">CARTEL</span>
        </h1>
        <p className="text-gray-400 mb-6">
          Inicia sesión para generar tu cartel personalizado
        </p>

        <a
          href={twitchLoginUrl}
          className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-3 rounded transition-colors"
        >
          Entrar con Twitch
        </a>
      </div>
    );
  }

  const predList = Array.isArray(predictions)
    ? predictions
    : (predictions as any)?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          MI <span className="text-[#e63946]">CARTEL</span>
        </h1>
        <p className="text-gray-400">
          Tu cartel personalizado listo para compartir
        </p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-20">
          Generando tu cartel...
        </div>
      ) : predList.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="font-bebas text-2xl text-white mb-2">
            Aún no tienes predicciones
          </h3>
          <p className="text-gray-500 mb-6">
            Haz tus predicciones primero para generar tu cartel
          </p>
          <Link
            href="/predicciones"
            className="inline-block bg-[#e63946] hover:bg-[#c1121f] text-white font-medium px-8 py-3 rounded transition-colors"
          >
            Hacer Predicciones →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <div ref={posterRef}>
            <PosterCard
              predictions={predList}
              username={user?.twitch_username || "usuario"}
            />
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleShare("twitter")}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#e63946]/50 text-white px-5 py-2.5 rounded-lg transition-colors"
            >
              𝕏 Compartir en Twitter
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/50 text-white px-5 py-2.5 rounded-lg transition-colors"
            >
              💬 Compartir en WhatsApp
            </button>
          </div>

          <p className="text-gray-600 text-xs text-center">
            ¿Aún te faltan predicciones?{" "}
            <Link
              href="/predicciones"
              className="text-[#e63946] hover:underline"
            >
              Completar predicciones →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
