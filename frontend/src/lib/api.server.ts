/**
 * api.server.ts
 * Fetch helper exclusivo para Server Components.
 * Usa BACKEND_URL (red interna Docker) en vez de NEXT_PUBLIC_API_URL (browser).
 * Nunca importar desde Client Components.
 */

import { LeaderboardEntry } from "@/types";

const SERVER_API_URL = process.env.BACKEND_URL // Docker prod → http://backend:8000
  ? `${process.env.BACKEND_URL}/api/v1`
  : (process.env.NEXT_PUBLIC_API_URL ?? // local → http://localhost:8000/api/v1
    "http://localhost:8000/api/v1"); // fallback hardcodeado

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${SERVER_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    // No lanzamos en SSR para que la página no explote.
    // El Server Component decide qué hacer con null.
    throw new Error(`SSR fetch error ${res.status}: ${endpoint}`);
  }

  return res.json();
}

export async function getLeaderboard({
  limit = 50,
  offset = 0,
  search,
}: {
  limit?: number;
  offset?: number;
  search?: string;
} = {}): Promise<{ results: LeaderboardEntry[]; nextOffset?: number }> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  if (search) params.append("search", search);

  const data = await serverFetch<{ results: LeaderboardEntry[] }>(
    `/predictions/leaderboard/?${params.toString()}`,
  );

  const nextOffset = data.results.length === limit ? offset + limit : undefined;

  return { results: data.results, nextOffset };
}
