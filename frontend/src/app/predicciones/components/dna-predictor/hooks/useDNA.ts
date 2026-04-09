"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export interface DNAData {
  dna: string;
  stats: {
    total: number;
    community_picks: number;
    underdog_picks: number;
    spanish_picks: number;
    foreign_picks: number;
    betrayals: number;
  };
}

export function useDNA() {
  const { user } = useAuthStore();
  const [revealed, setRevealed] = useState(false);

  const query = useQuery({
    queryKey: ["my-dna"],
    queryFn: () => api.get<DNAData>("/users/me/dna/"),
    enabled: false,
  });

  const reveal = () => {
    if (!user) return false;
    setRevealed(true);
    query.refetch();
    return true;
  };

  const title = query.data?.dna.split(":")[0]?.trim() || "";
  const analysis = query.data?.dna.split(":").slice(1).join(":").trim() || "";

  const viewState = !user
    ? "guest"
    : !revealed
      ? "idle"
      : query.isLoading
        ? "loading"
        : query.data
          ? "success"
          : "empty";

  return {
    user,
    revealed,
    reveal,
    title,
    analysis,
    viewState,
    ...query,
  };
}
