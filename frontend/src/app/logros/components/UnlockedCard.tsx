import { UserAchievement } from "@/components/achievements/types";

export function UnlockedCard({ ua }: { ua: UserAchievement }) {
  const date = new Date(ua.unlocked_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="
        group relative flex flex-col gap-2 p-4 rounded-2xl
        bg-white/5 border border-white/10
        hover:border-[#e63946]/50 hover:bg-white/8
        transition-all duration-300
      "
    >
      {/* Punto dorado */}
      <div className="absolute top-3 right-3  font-bold text-[#f4a261]">
        +{ua.achievement.points}pts
      </div>

      <span className="text-3xl">{ua.achievement.emoji}</span>

      <div>
        <p className="text-md font-bold text-white leading-tight">
          {ua.achievement.name}
        </p>
        <p className="text-sm text-white/40 mt-0.5 leading-relaxed">
          {ua.achievement.description}
        </p>
      </div>

      <p className=" text-[#e63946]/70 font-semibold mt-auto">{date}</p>
    </div>
  );
}
