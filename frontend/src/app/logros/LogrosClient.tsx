"use client";

import { useState } from "react";
import type {
  MyAchievementsResponse,
  Achievement,
  UserAchievement,
} from "@/components/achievements/types";
import { UnlockedCard } from "./components/UnlockedCard";
import { LockedCard } from "./components/LockedCard";
import { NotAuthenticated } from "./components/NotAuthenticated";

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
  data: MyAchievementsResponse | null;
}

export function LogrosClient({ data }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  if (!data) return <NotAuthenticated />;

  const { unlocked, locked, total_points, unlocked_count } = data;
  const total = unlocked_count + locked.length;
  const pct = total > 0 ? Math.round((unlocked_count / total) * 100) : 0;

  // Agrupa desbloqueados por categoría
  const unlockedByCategory = CATEGORY_ORDER.reduce<
    Record<string, UserAchievement[]>
  >((acc, cat) => {
    acc[cat] = unlocked.filter((ua) => ua.achievement.category === cat);
    return acc;
  }, {});

  const lockedByCategory = CATEGORY_ORDER.reduce<Record<string, Achievement[]>>(
    (acc, cat) => {
      acc[cat] = locked.filter((a) => a.category === cat);
      return acc;
    },
    {},
  );

  const categories = ["todos", ...CATEGORY_ORDER];

  const filteredUnlocked =
    activeCategory === "todos"
      ? unlocked
      : (unlockedByCategory[activeCategory] ?? []);

  const filteredLocked =
    activeCategory === "todos"
      ? locked
      : (lockedByCategory[activeCategory] ?? []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">
          Mis Logros
        </h1>
        <p className="text-white/40 text-sm">
          {unlocked_count} de {total} desbloqueados · {total_points} puntos
          totales
        </p>

        {/* Barra de progreso */}
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden max-w-sm">
          <div
            className="h-full bg-gradient-to-r from-[#e63946] to-[#f4a261] rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-white/30 mt-1">{pct}% completado</p>
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

      {/* Logros desbloqueados */}
      {filteredUnlocked.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-bold text-[#e63946] uppercase tracking-widest mb-3">
            Desbloqueados ({filteredUnlocked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredUnlocked.map((ua) => (
              <UnlockedCard key={ua.achievement.slug} ua={ua} />
            ))}
          </div>
        </section>
      )}

      {/* Logros bloqueados */}
      {filteredLocked.length > 0 && (
        <section>
          <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">
            Por desbloquear ({filteredLocked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
