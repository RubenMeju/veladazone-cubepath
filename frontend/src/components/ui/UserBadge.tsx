"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

interface BadgeData {
  badge: {
    label: string;
    color: string;
    emoji: string;
  };
}

export function UserBadge() {
  const { user, logout } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["my-stats"],
    queryFn: () => api.get<BadgeData>("/users/me/stats/"),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    retry: false, // no reintentar si falla
    throwOnError: false,
  });

  if (!user || !data?.badge) return null;

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
