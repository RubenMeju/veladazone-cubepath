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
  const hasWinner = !!fight.winner;

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all ${
        fight.is_main_event
          ? "bg-[#0d0d0d] border border-[#e63946]/25"
          : "bg-[#0d0d0d] border border-white/5"
      }`}
    >
      {fight.is_main_event && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/40 to-transparent" />
      )}

      <div className="p-4">
        {fight.is_main_event && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e63946]/20" />
            <span className="text-[10px] text-[#e63946]/70 tracking-[0.3em] uppercase">
              ⭐ Combate Estelar
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e63946]/20" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Fighter 1 */}
          <div
            className={`flex-1 flex items-center justify-end gap-2 ${
              hasWinner && fight.winner?.id !== fight.fighter1.id
                ? "opacity-40"
                : ""
            }`}
          >
            <div className="text-right">
              <div
                className={`font-bebas text-lg tracking-wider leading-tight ${
                  fight.winner?.id === fight.fighter1.id
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {fight.fighter1.name}
              </div>
              <div className="text-sm text-gray-600">
                {fight.fighter1.country_flag}
              </div>
            </div>
            {fight.winner?.id === fight.fighter1.id && (
              <span className="text-base flex-shrink-0">👑</span>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0 px-2">
            <div className="font-bebas text-lg text-[#e63946] leading-none">
              VS
            </div>
            {fight.is_completed && fight.result_method && (
              <div className="text-xs text-gray-600 tracking-widest uppercase">
                {fight.result_method}
              </div>
            )}
            {!fight.is_completed && (
              <div className="text-xs text-gray-700 tracking-widest uppercase">
                pendiente
              </div>
            )}
          </div>

          {/* Fighter 2 */}
          <div
            className={`flex-1 flex items-center gap-2 ${
              hasWinner && fight.winner?.id !== fight.fighter2.id
                ? "opacity-40"
                : ""
            }`}
          >
            {fight.winner?.id === fight.fighter2.id && (
              <span className="text-base flex-shrink-0">👑</span>
            )}
            <div>
              <div
                className={`font-bebas text-lg tracking-wider leading-tight ${
                  fight.winner?.id === fight.fighter2.id
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {fight.fighter2.name}
              </div>
              <div className="text-sm text-gray-600">
                {fight.fighter2.country_flag}
              </div>
            </div>
          </div>
        </div>
      </div>

      {fight.is_main_event && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/15 to-transparent" />
      )}
    </div>
  );
}
