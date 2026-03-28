import { ProfileData } from "../types";

interface Props {
  stats: ProfileData["stats"];
  betrayal_count: number;
}

export function ProfileStats({ stats, betrayal_count }: Props) {
  const items = [
    { label: "Predicciones", value: stats.total, color: "text-white" },
    { label: "Correctas", value: stats.correct, color: "text-green-400" },
    {
      label: "Precisión",
      value: `${stats.accuracy}%`,
      color: "text-[#f4a261]",
    },
    { label: "Traiciones", value: betrayal_count, color: "text-[#e63946]" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#0d0d0d] border border-white/5 rounded-xl p-4 text-center"
        >
          <div className={`font-bebas text-3xl ${stat.color} leading-tight`}>
            {stat.value}
          </div>
          <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
