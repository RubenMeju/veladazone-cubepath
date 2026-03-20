import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function UserBadge() {
  const { data } = useQuery({
    queryKey: ["my-stats"],
    queryFn: () =>
      api.get<{ badge: { label: string; color: string; emoji: string } }>(
        "/users/me/stats/",
      ),
  });

  if (!data?.badge) return null;

  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
      style={{
        color: data.badge.color,
        backgroundColor: `${data.badge.color}20`,
      }}
    >
      {data.badge.emoji} {data.badge.label}
    </span>
  );
}
