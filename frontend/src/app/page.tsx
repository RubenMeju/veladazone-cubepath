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

export default function HomePage() {
  const velada6Date = new Date("2026-07-25T20:00:00");
  const { days, hours, minutes, seconds } = useCountdown(velada6Date);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e63946]/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e63946]/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/30 rounded-full px-4 py-1.5 text-sm text-[#e63946] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
            25 Julio 2026 · Estadio La Cartuja · Sevilla
          </div>

          {/* Title */}
          <h1 className="font-bebas text-7xl md:text-9xl text-white tracking-wider leading-none mb-4">
            VELADA DEL AÑO
            <span className="text-[#e63946]"> 6</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Haz tus predicciones, compite en ligas con amigos y vive la noche
            más épica del streaming hispano.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 md:gap-8 mb-12">
            {[
              { value: days, label: "DÍAS" },
              { value: hours, label: "HORAS" },
              { value: minutes, label: "MINUTOS" },
              { value: seconds, label: "SEGUNDOS" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg w-20 md:w-28 h-20 md:h-28 flex items-center justify-center">
                  <span className="font-bebas text-4xl md:text-6xl text-white">
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs text-gray-500 mt-2 tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predicciones"
              className="bg-[#e63946] hover:bg-[#c1121f] text-white font-medium px-8 py-3 rounded transition-colors text-lg"
            >
              Hacer Predicciones
            </Link>
            <Link
              href="/fantasy"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-white font-medium px-8 py-3 rounded transition-colors text-lg"
            >
              Crear Liga Fantasy
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📊",
              title: "Stats & Historia",
              description:
                "Historial completo de las 6 ediciones. Récords, ganadores y datos de cada luchador.",
              href: "/stats",
            },
            {
              icon: "🎯",
              title: "Predicciones",
              description:
                "Elige tu ganador en cada combate y recibe un comentario épico generado por IA.",
              href: "/predicciones",
            },
            {
              icon: "🏆",
              title: "Fantasy League",
              description:
                "Crea una liga privada con tus amigos y compite por ser el mejor predictor.",
              href: "/fantasy",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#e63946]/50 hover:bg-[#1a1a1a]/80 transition-all group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bebas text-2xl text-white mb-2 group-hover:text-[#e63946] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Main event teaser */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-[#1a1a1a] border border-[#e63946]/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/5 via-transparent to-[#e63946]/5" />
          <div className="relative">
            <div className="text-sm text-[#e63946] font-medium tracking-widest mb-4">
              COMBATE ESTELAR
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-16">
              <div className="text-center">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#2a2a2a] border-2 border-[#e63946] mx-auto mb-3 flex items-center justify-center text-4xl">
                  🇪🇸
                </div>
                <div className="font-bebas text-2xl md:text-4xl text-white">
                  ILLOJUAN
                </div>
                <div className="text-gray-500 text-sm">España</div>
              </div>
              <div className="font-bebas text-4xl md:text-7xl text-[#e63946]">
                VS
              </div>
              <div className="text-center">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#2a2a2a] border-2 border-[#e63946] mx-auto mb-3 flex items-center justify-center text-4xl">
                  🇪🇸
                </div>
                <div className="font-bebas text-2xl md:text-4xl text-white">
                  THEGREFG
                </div>
                <div className="text-gray-500 text-sm">España</div>
              </div>
            </div>
            <Link
              href="/predicciones"
              className="inline-block mt-8 bg-[#e63946] hover:bg-[#c1121f] text-white font-medium px-8 py-3 rounded transition-colors"
            >
              ¿Quién ganará? Haz tu predicción →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
