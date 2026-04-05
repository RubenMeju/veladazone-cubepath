"use client";

import { useState } from "react";
import { twitchLoginUrl } from "@/lib/api";
import type {
  MyAchievementsResponse,
  Achievement,
  UserAchievement,
} from "@/components/achievements/types";
import { UnlockedCard } from "./components/UnlockedCard";
import { LockedCard } from "./components/LockedCard";

const CATEGORY_LABELS: Record<string, string> = {
  predicciones: "Predicciones",
  debate: "Debate",
  social: "Social",
  ligas: "Ligas",
  especial: "Especial",
};

const CATEGORY_ORDER = [
  "predicciones",
  "debate",
  "ligas",
  "social",
  "especial",
];

interface Props {
  catalog: Achievement[];
  userData: MyAchievementsResponse | null;
}

export function LogrosClient({ catalog, userData }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const isAuthenticated = userData !== null;
  const unlockedSlugs = new Set(
    userData?.unlocked.map((ua) => ua.achievement.slug) ?? [],
  );

  const visibleUnlocked: UserAchievement[] = userData?.unlocked ?? [];
  const visibleLocked: Achievement[] = isAuthenticated
    ? catalog.filter((a) => !unlockedSlugs.has(a.slug))
    : catalog;

  const total_points = userData?.total_points ?? 0;
  const unlocked_count = userData?.unlocked_count ?? 0;
  const total = unlocked_count + visibleLocked.length;
  const pct = total > 0 ? Math.round((unlocked_count / total) * 100) : 0;

  // ── Filtrado por categoría ────────────────────────────────────────────────
  const filteredUnlocked =
    activeCategory === "todos"
      ? visibleUnlocked
      : visibleUnlocked.filter(
          (ua) => ua.achievement.category === activeCategory,
        );

  const filteredLocked =
    activeCategory === "todos"
      ? visibleLocked
      : visibleLocked.filter((a) => a.category === activeCategory);

  const categories = ["todos", ...CATEGORY_ORDER];

  return (
    <div className="max-w-4xl mx-auto ">
      {/* Banner CTA — solo si no está autenticado */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-white font-bold text-sm">
              Inicia sesión para desbloquear logros
            </p>
            <p className="text-white/40 text-xs mt-0.5">
              Conecta con Twitch y empieza a competir por los {catalog.length}{" "}
              logros disponibles
            </p>
          </div>
          <a
            href={twitchLoginUrl}
            className="shrink-0 px-5 py-2 bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-semibold rounded-xl transition-colors text-center"
          >
            Conectar con Twitch
          </a>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">
          {isAuthenticated ? "Mis Logros" : "Logros disponibles"}
        </h1>
        <p className="text-white/40 text-sm">
          {isAuthenticated
            ? `${unlocked_count} de ${total} desbloqueados · ${total_points} puntos totales`
            : `${catalog.length} logros por desbloquear`}
        </p>

        {/* Barra de progreso — solo si autenticado */}
        {isAuthenticated && (
          <>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden max-w-sm">
              <div
                className="h-full bg-gradient-to-r from-[#e63946] to-[#f4a261] rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-white/30 mt-1">{pct}% completado</p>
          </>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-semibold transition-all
              ${
                activeCategory === cat
                  ? "bg-[#e63946] text-white"
                  : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
              }
            `}
          >
            {cat === "todos" ? "Todos" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Logros desbloqueados — solo si autenticado y tiene alguno */}
      {isAuthenticated && filteredUnlocked.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold text-[#e63946] uppercase tracking-widest mb-3">
            Desbloqueados ({filteredUnlocked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
            {filteredUnlocked.map((ua) => (
              <UnlockedCard key={ua.achievement.slug} ua={ua} />
            ))}
          </div>
        </section>
      )}

      {/* Logros bloqueados / catálogo */}
      {filteredLocked.length > 0 && (
        <section>
          {isAuthenticated && (
            <h2 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-3">
              Por desbloquear ({filteredLocked.length})
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
            {filteredLocked.map((a) => (
              <LockedCard key={a.slug} achievement={a} />
            ))}
          </div>
        </section>
      )}

      {filteredUnlocked.length === 0 && filteredLocked.length === 0 && (
        <p className="text-center text-white/30 py-16 text-sm">
          No hay logros en esta categoría
        </p>
      )}
    </div>
  );
}
