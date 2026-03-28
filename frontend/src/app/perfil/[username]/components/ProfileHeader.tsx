import { ProfileData } from "../types";

interface Props {
  data: ProfileData;
}

export function ProfileHeader({ data }: Props) {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 mb-6">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.display_name}
              className="w-20 h-20 rounded-full border-2 border-white/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-white/10 flex items-center justify-center text-3xl">
              👤
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-bebas text-3xl text-white tracking-wider">
                {data.display_name}
              </h1>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: data.stats.badge.color,
                  backgroundColor: `${data.stats.badge.color}20`,
                  border: `1px solid ${data.stats.badge.color}30`,
                }}
              >
                {data.stats.badge.emoji} {data.stats.badge.label}
              </span>
            </div>
            <p className="text-gray-600 text-sm">@{data.username}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-bebas text-2xl text-white">
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
