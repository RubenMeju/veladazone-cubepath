"use client";

import { CommunityStats, Fight, Prediction } from "@/types";
import { FighterButton } from "./Fighterbutton";
import { Thermometer } from "./Thermometer";
import { DebateSection } from "./debate/DebateSection";
import { ShareFightButton } from "./ShareFightButton";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export function FightCard({
  fight,
  prediction,
  onPredict,
  isPending,
  stats,
}: {
  fight: Fight;
  prediction?: Prediction;
  onPredict: (fightId: number, winnerId: number) => void;
  isPending: boolean;
  stats?: CommunityStats;
}) {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const selectedId = prediction?.predicted_winner?.id;
  const isMain = fight.is_main_event;
  const [showVideo, setShowVideo] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    return url.split("/embed/")[1]?.split("?")[0];
  };

  const videoId = getYoutubeId(fight.youtube_url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const isActive = activeVideoId === fight.id;

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl transition-all duration-300",
        isMain
          ? [
              "bg-[#0a0a0a]",
              "border border-[#e63946]/40",
              "shadow-[0_0_60px_-10px_rgba(230,57,70,0.25)]",
              "hover:shadow-[0_0_80px_-10px_rgba(230,57,70,0.40)]",
              "hover:border-[#e63946]/60",
            ].join(" ")
          : [
              "bg-[#0a0a0a]",
              "border border-white/[0.06]",
              "hover:border-white/[0.12]",
              "hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
            ].join(" "),
      ].join(" ")}
    >
      {/* ── Fondo atmosférico ─────────────────────────────── */}
      {isMain ? (
        <>
          {/* Glow central rojo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(230,57,70,0.08)_0%,transparent_70%)] pointer-events-none" />
          {/* Líneas diagonales decorativas */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #e63946 0px, #e63946 1px, transparent 1px, transparent 40px)",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      )}

      {/* ── Borde superior luminoso ───────────────────────── */}
      <div
        className={[
          "absolute top-0 left-0 right-0 h-px",
          isMain
            ? "bg-linear-to-r from-transparent via-[#e63946]/70 to-transparent"
            : "bg-linear-to-r from-transparent via-white/10 to-transparent",
        ].join(" ")}
      />

      <div className="relative p-5 sm:p-7">
        {/* ── Badge Main Event ──────────────────────────────── */}
        {isMain && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#e63946]/40" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#e63946]/30 bg-[#e63946]/5">
              <span className="size-1.5 rounded-full bg-[#e63946] animate-pulse" />
              <span className="text-[10px] text-[#e63946] font-semibold tracking-[0.35em] uppercase">
                Combate Estelar
              </span>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#e63946]/40" />
          </div>
        )}

        {/* ── Arena: los dos peleadores ─────────────────────── */}
        <div className="relative flex items-stretch gap-0">
          {/* Fighter 1 */}
          <div className="flex-1 min-w-0">
            <FighterButton
              fighter={fight.fighter1}
              isSelected={selectedId === fight.fighter1.id}
              onClick={() => onPredict(fight.id, fight.fighter1.id)}
              disabled={isPending}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* VS separator */}
          <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-12 sm:w-14 z-10">
            {/* línea vertical superior */}
            <div className="w-px flex-1 bg-linear-to-b from-transparent via-white/8 to-transparent" />

            {/* VS badge */}
            <div
              className={[
                "flex items-center justify-center size-10 sm:size-12 rounded-full",
                "border-2 shadow-lg",
                isMain
                  ? "border-[#e63946]/50 bg-[#e63946]/8 shadow-[0_0_20px_rgba(230,57,70,0.2)]"
                  : "border-white/10 bg-white/3",
              ].join(" ")}
            >
              <span
                className={[
                  "font-bebas leading-none text-base sm:text-lg tracking-wider",
                  isMain ? "text-[#e63946]" : "text-white/40",
                ].join(" ")}
              >
                VS
              </span>
            </div>

            {/* línea vertical inferior */}
            <div className="w-px flex-1 bg-linear-to-b from-transparent via-white/8 to-transparent" />
          </div>

          {/* Fighter 2 */}
          <div className="flex-1 min-w-0">
            <FighterButton
              fighter={fight.fighter2}
              isSelected={selectedId === fight.fighter2.id}
              onClick={() => onPredict(fight.id, fight.fighter2.id)}
              disabled={isPending}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

        {/* ── Termómetro de la comunidad ────────────────────── */}
        <div className="mt-5">
          <Thermometer fight={fight} stats={stats} />
        </div>

        {/* ── Video Cara a Cara ───────────────────── */}
        {fight.youtube_url && videoId && (
          <div className="mt-5 relative overflow-hidden rounded-xl">
            {isActive ? (
              <iframe
                width="100%"
                height="220"
                src={`${fight.youtube_url}?&autoplay=1`}
                title={`Cara a Cara: ${fight.fighter1} vs ${fight.fighter2}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl animate-fade-in"
              />
            ) : (
              <div
                className="relative cursor-pointer group"
                onClick={() => setActiveVideoId(fight.id)}
              >
                <img
                  src={thumbnail!}
                  alt="Video preview"
                  className="w-full h-[220px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

                {/* Botón play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <span className="text-black text-xl ml-1">▶</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Comentario IA ─────────────────────────────────── */}
        {prediction?.ai_comment && (
          <div className="mt-4 relative overflow-hidden rounded-xl">
            {/* fondo con grain */}
            <div className="absolute inset-0 bg-[#0d0d0d] rounded-xl" />
            <div className="absolute inset-0 border border-[#f4a261]/15 rounded-xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#f4a261]/40 to-transparent" />

            <div className="relative p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex items-center justify-center size-6 rounded-full bg-[#f4a261]/10 border border-[#f4a261]/20">
                  <span className="text-[11px] leading-none">🎙️</span>
                </div>
                <span className="text-[10px] text-[#f4a261]/70 font-semibold tracking-[0.3em] uppercase">
                  El Comentarista
                </span>
              </div>
              <p className="text-white/50 text-xs sm:text-sm italic leading-relaxed">
                &ldquo;{prediction.ai_comment}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* ── Footer: predicción confirmada + share ─────────── */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Pill de confirmación si ya predijo */}
          {selectedId ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-white/50 font-medium">
                Predicción registrada
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-white/25 italic">
              Toca un peleador para predecir
            </span>
          )}

          <ShareFightButton fight={fight} prediction={prediction} />
        </div>

        {/* ── Debate ────────────────────────────────────────── */}
        <DebateSection fight={fight} userPrediction={prediction} />
      </div>

      {/* ── Borde inferior luminoso si hay predicción ─────── */}
      {selectedId && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-400/30 to-transparent" />
      )}
    </article>
  );
}
