/**
 * ProfileAchievements.tsx
 * Sección de logros para el perfil público /perfil/[username]
 * Es un Server Component — fetchea directamente desde el servidor.
 */

import { serverFetch } from "@/lib/api.server";
import { PublicAchievementsResponse } from "./types";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  predicciones: "Predicciones",
  debate: "Debate",
  social: "Social",
  ligas: "Ligas",
  especial: "Especial",
};

export async function ProfileAchievements({ username }: { username: string }) {
  let data: PublicAchievementsResponse | null = null;

  try {
    data = await serverFetch<PublicAchievementsResponse>(
      `/achievements/user/${username}/`,
    );
  } catch {
    return null;
  }

  if (!data || data.achievements.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bebas text-2xl text-white tracking-wide">Logros</h2>
        <span className="text-xs text-white/40">
          {data.achievements.length} desbloqueados · {data.total_points} pts
        </span>
      </div>

      {/* Link general a todos los logros */}
      <div className="mb-3">
        <Link
          href="/logros" // <-- tu ruta de logros
          className="text-sm text-[#e63946] hover:underline"
        >
          Ver todos los logros
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {data.achievements.map(({ achievement, unlocked_at }) => (
          <div
            key={achievement.slug}
            title={achievement.description}
            className="
              flex items-center gap-2 p-3 rounded-xl
              bg-white/5 border border-white/10
              hover:border-[#e63946]/40 transition-colors
            "
          >
            <span className="text-2xl shrink-0">{achievement.emoji}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {achievement.name}
              </p>
              <p className="text-[10px] text-white/30">
                {CATEGORY_LABELS[achievement.category] ?? achievement.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
