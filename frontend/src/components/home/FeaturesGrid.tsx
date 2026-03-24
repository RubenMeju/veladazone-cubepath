"use client";

import Link from "next/link";

const features = [
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
];

const featurePills = [
  "🔮 Predicción de la IA",
  "🌡️ Termómetro comunidad",
  "💬 Modo Debate",
  "🗡️ Contador traiciones",
  "🏅 Sistema de badges",
  "🃏 Cartel personalizado",
  "🎲 La predicción más loca",
  "👤 Perfil público",
];

export function FeaturesGrid() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-xl p-6 sm:p-7 hover:border-white/10 transition-all duration-300"
            >
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
                <div className="text-3xl mb-4 sm:mb-5">{feature.icon}</div>
                <h3 className="font-bebas text-xl sm:text-2xl text-white mb-2 tracking-wider group-hover:text-[#e63946] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 sm:mt-5 text-xs tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors uppercase">
                  Ver más →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="border-t border-white/5 pt-10 sm:pt-12">
          <p className="text-center text-sm tracking-[0.4em] text-gray-600 uppercase mb-6 sm:mb-8">
            Todo lo que necesitas para La Velada
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {featurePills.map((feature) => (
              <span
                key={feature}
                className="text-xs text-gray-500 border border-white/5 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:border-white/10 hover:text-gray-400 transition-colors cursor-default"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
