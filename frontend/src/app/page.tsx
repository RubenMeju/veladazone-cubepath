"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#e63946]/20 blur-xl rounded-lg" />
        <div className="relative bg-[#0d0d0d] border border-[#e63946]/40 rounded-lg w-20 md:w-32 h-20 md:h-32 flex items-center justify-center overflow-hidden">
          {/* Top shine */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/60 to-transparent" />
          {/* Number */}
          <span className="font-bebas text-4xl md:text-6xl text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-[10px] md:text-xs text-[#e63946]/70 mt-3 tracking-[0.3em] font-medium">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const velada6Date = new Date("2026-07-25T20:00:00");
  const { days, hours, minutes, seconds } = useCountdown(velada6Date);

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Background — dramatic light cone from top */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-10" />
          {/* Secondary warm glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-6" />
          {/* Floor reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#e63946]/5 to-transparent" />
          {/* Corner vignettes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_left,_#1a0a0a_0%,_transparent_70%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_#1a0a0a_0%,_transparent_70%)]" />
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
          {/* Diagonal light lines */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/20 via-transparent to-transparent -translate-x-32 rotate-12 origin-top" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[#e63946]/15 via-transparent to-transparent translate-x-32 -rotate-12 origin-top" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Event badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#e63946]/10 border border-[#e63946]/25 rounded-full px-5 py-2 text-sm text-[#e63946] mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse" />
            <span className="tracking-widest text-[11px] font-medium uppercase">
              25 Julio 2026 · Estadio La Cartuja · Sevilla
            </span>
          </div>

          {/* Main title */}
          <div className="mb-2">
            <h1 className="font-bebas text-[clamp(4rem,14vw,10rem)] text-white tracking-wider leading-none">
              VELADA DEL AÑO
            </h1>
          </div>

          {/* The 6 — oversized, dramatic */}
          <div className="relative mb-8 leading-none">
            <span
              className="font-bebas text-[clamp(8rem,28vw,20rem)] leading-none select-none"
              style={{
                WebkitTextStroke: "2px #e63946",
                color: "transparent",
                textShadow:
                  "0 0 80px rgba(230,57,70,0.4), 0 0 160px rgba(230,57,70,0.2)",
              }}
            >
              6
            </span>
            {/* Solid version slightly offset for depth */}
            <span
              className="absolute inset-0 font-bebas text-[clamp(8rem,28vw,20rem)] leading-none text-[#e63946] select-none"
              style={{ clipPath: "inset(0 0 50% 0)", opacity: 0.15 }}
            >
              6
            </span>
          </div>

          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-14 leading-relaxed">
            Haz tus predicciones, compite en ligas con amigos y vive la noche
            más épica del streaming hispano.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-3 md:gap-6 mb-14">
            <CountdownUnit value={days} label="DÍAS" />
            <div className="font-bebas text-3xl md:text-5xl text-[#e63946]/40 self-center mb-4">
              :
            </div>
            <CountdownUnit value={hours} label="HORAS" />
            <div className="font-bebas text-3xl md:text-5xl text-[#e63946]/40 self-center mb-4">
              :
            </div>
            <CountdownUnit value={minutes} label="MINUTOS" />
            <div className="font-bebas text-3xl md:text-5xl text-[#e63946]/40 self-center mb-4">
              :
            </div>
            <CountdownUnit value={seconds} label="SEGUNDOS" />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predicciones"
              className="group relative overflow-hidden bg-[#e63946] hover:bg-[#c1121f] text-white font-bebas text-xl tracking-widest px-10 py-4 rounded transition-all duration-200"
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              HACER PREDICCIONES
            </Link>
            <Link
              href="/fantasy"
              className="group relative overflow-hidden bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white font-bebas text-xl tracking-widest px-10 py-4 rounded transition-all duration-200"
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

      {/* ── MAIN EVENT TEASER ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#e63946]/20 bg-[#0d0d0d]">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#e63946_0%,_transparent_60%)] opacity-5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/40 to-transparent" />

          <div className="relative px-8 py-12 text-center">
            <div className="text-[11px] text-[#e63946] font-medium tracking-[0.4em] mb-8 uppercase">
              ⭐ Combate Estelar
            </div>

            <div className="flex items-center justify-center gap-6 md:gap-20">
              {/* Fighter 1 */}
              <div className="text-center group">
                <div className="relative w-24 h-24 md:w-36 md:h-36 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-[#e63946]/20 blur-xl group-hover:bg-[#e63946]/30 transition-colors" />
                  <div className="relative w-full h-full rounded-full border-2 border-[#e63946]/50 bg-[#1a0a0a] flex items-center justify-center text-5xl md:text-6xl">
                    🇪🇸
                  </div>
                </div>
                <div className="font-bebas text-3xl md:text-5xl text-white tracking-wider">
                  ILLOJUAN
                </div>
                <div className="text-gray-600 text-xs tracking-widest uppercase mt-1">
                  España
                </div>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />
                <span
                  className="font-bebas text-5xl md:text-8xl text-[#e63946]"
                  style={{ textShadow: "0 0 40px rgba(230,57,70,0.5)" }}
                >
                  VS
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />
              </div>

              {/* Fighter 2 */}
              <div className="text-center group">
                <div className="relative w-24 h-24 md:w-36 md:h-36 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-[#e63946]/20 blur-xl group-hover:bg-[#e63946]/30 transition-colors" />
                  <div className="relative w-full h-full rounded-full border-2 border-[#e63946]/50 bg-[#1a0a0a] flex items-center justify-center text-5xl md:text-6xl">
                    🇪🇸
                  </div>
                </div>
                <div className="font-bebas text-3xl md:text-5xl text-white tracking-wider">
                  THEGREFG
                </div>
                <div className="text-gray-600 text-xs tracking-widest uppercase mt-1">
                  España
                </div>
              </div>
            </div>

            <Link
              href="/predicciones"
              className="inline-flex items-center gap-2 mt-10 text-[#e63946] hover:text-white border border-[#e63946]/30 hover:border-[#e63946] hover:bg-[#e63946]/10 font-bebas text-lg tracking-widest px-8 py-3 rounded transition-all"
            >
              ¿QUIÉN GANARÁ? HAZ TU PREDICCIÓN →
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/20 to-transparent" />
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "📊",
              title: "Stats & Historia",
              description:
                "Historial completo de las 6 ediciones. Récords, ganadores y análisis IA de cada luchador.",
              href: "/stats",
              accent: "#e63946",
            },
            {
              icon: "🎯",
              title: "Predicciones",
              description:
                "Elige tu ganador, recibe comentarios épicos de la IA y compite en el ranking global.",
              href: "/predicciones",
              accent: "#f4a261",
            },
            {
              icon: "🏆",
              title: "Fantasy League",
              description:
                "Crea una liga privada con tus amigos y demuestra quién sabe más de La Velada.",
              href: "/fantasy",
              accent: "#9146FF",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-xl p-7 hover:border-white/10 transition-all duration-300"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(ellipse at bottom left, ${feature.accent}08 0%, transparent 70%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(to right, transparent, ${feature.accent}40, transparent)`,
                }}
              />

              <div className="relative">
                <div className="text-3xl mb-5">{feature.icon}</div>
                <h3 className="font-bebas text-2xl text-white mb-2 tracking-wider group-hover:text-[#e63946] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-5 text-xs tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors uppercase">
                  Ver más →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW FEATURES STRIP ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="border-t border-white/5 pt-12">
          <p className="text-center text-[11px] tracking-[0.4em] text-gray-600 uppercase mb-8">
            Todo lo que necesitas para La Velada
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🔮 Predicción de la IA",
              "🌡️ Termómetro comunidad",
              "💬 Modo Debate",
              "🗡️ Contador traiciones",
              "🏅 Sistema de badges",
              "🃏 Cartel personalizado",
              "🎲 La predicción más loca",
            ].map((feature) => (
              <span
                key={feature}
                className="text-xs text-gray-500 border border-white/5 rounded-full px-4 py-2 hover:border-white/10 hover:text-gray-400 transition-colors cursor-default"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
