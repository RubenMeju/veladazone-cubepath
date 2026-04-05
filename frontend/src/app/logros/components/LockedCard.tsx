import { Achievement } from "@/components/achievements/types";

export function LockedCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className="
        flex flex-col gap-8 p-4 rounded-2xl
        bg-white/[0.02] border border-white/5
        opacity-50
      "
    >
      <div className="flex justify-between items-center">
        <span className="text-3xl grayscale">{achievement.emoji}</span>
        <p className="text-sm text-white/70 font-semibold mt-auto">
          🔒 Sin desbloquear
        </p>
      </div>

      <div>
        <p className="text-sm font-bold text-white/90 leading-tight">
          {achievement.name}
        </p>
        <p className="text-sm text-white/70 mt-0.5 leading-relaxed">
          {achievement.description}
        </p>
      </div>
    </div>
  );
}
