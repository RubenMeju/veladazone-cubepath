"use client";

interface FightRowProps {
  fight: {
    id: number;
    is_main_event: boolean;
    is_completed: boolean;
    result_method?: string;
    winner?: { id: number } | null;
    fighter1: { id: number; name: string; country_flag: string };
    fighter2: { id: number; name: string; country_flag: string };
  };
}

export function FightRow({ fight }: FightRowProps) {
  return (
    <div
      className={`bg-[#1a1a1a] border rounded-xl p-4 ${
        fight.is_main_event ? "border-[#e63946]/50" : "border-[#2a2a2a]"
      }`}
    >
      {fight.is_main_event && (
        <div className="text-[10px] text-[#e63946] font-medium tracking-widest mb-2">
          COMBATE ESTELAR
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <span
            className={`font-bebas text-lg ${
              fight.winner?.id === fight.fighter1.id
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            {fight.fighter1.name}
            {fight.winner?.id === fight.fighter1.id && " 👑"}
          </span>
          <div className="text-xs text-gray-600">
            {fight.fighter1.country_flag}
          </div>
        </div>

        <div className="text-center px-3">
          <div className="font-bebas text-[#e63946] text-xl">VS</div>
          {fight.is_completed && (
            <div className="text-[10px] text-gray-500 uppercase">
              {fight.result_method}
            </div>
          )}
        </div>

        <div className="flex-1 text-left">
          <span
            className={`font-bebas text-lg ${
              fight.winner?.id === fight.fighter2.id
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            {fight.winner?.id === fight.fighter2.id && "👑 "}
            {fight.fighter2.name}
          </span>
          <div className="text-xs text-gray-600">
            {fight.fighter2.country_flag}
          </div>
        </div>
      </div>
    </div>
  );
}
