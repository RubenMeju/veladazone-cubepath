import { ProfileData } from "../types";

interface Props {
  data: ProfileData;
}

export function ProfileHeader({ data }: Props) {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 sm:p-6 mb-6">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.display_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/10"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a1a1a] border-2 border-white/10 flex items-center justify-center text-2xl sm:text-3xl">
              👤
            </div>
          )}

          <div className="min-w-0">
            {/* NOMBRE + BADGE */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-bebas text-xl sm:text-3xl text-white tracking-wider truncate">
                {data.display_name}
              </h1>

              <span
                className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                style={{
                  color: data.stats.badge.color,
                  backgroundColor: `${data.stats.badge.color}20`,
                  border: `1px solid ${data.stats.badge.color}30`,
                }}
              >
                {data.stats.badge.emoji} {data.stats.badge.label}
              </span>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm truncate">
              @{data.username}
            </p>
          </div>
        </div>

        {/* DERECHA (VISITAS) */}
        <div className="flex sm:block items-center justify-between sm:text-right">
          <div className="font-bebas text-xl sm:text-2xl text-white">
            {data.profile_views}
          </div>
          <div className="text-[10px] text-gray-600 tracking-widest uppercase">
            visitas
          </div>
        </div>
      </div>
    </div>
  );
}
