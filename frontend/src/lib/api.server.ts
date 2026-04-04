/**
 * api.server.ts
 * Fetch helper exclusivo para Server Components.
 * Usa BACKEND_URL (red interna Docker) en vez de NEXT_PUBLIC_API_URL (browser).
 * Nunca importar desde Client Components.
 */

import { LeaderboardEntry, OpponentProfile, Prediction, User } from "@/types";

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

export async function getMyPredictions(): Promise<{
  user: User;
  predictions: Prediction[];
} | null> {
  const isDev = process.env.NODE_ENV === "development";

  // ── Dev: x-dev-user header ─────────
  if (isDev) {
    try {
      const [userRes, predsRes] = await Promise.all([
        fetch(`${SERVER_API_URL}/users/me/`, {
          headers: {
            "Content-Type": "application/json",
            "x-dev-user": "devuser",
          },
          cache: "no-store",
        }),
        fetch(`${SERVER_API_URL}/predictions/`, {
          headers: {
            "Content-Type": "application/json",
            "x-dev-user": "devuser",
          },
          cache: "no-store",
        }),
      ]);

      if (!userRes.ok || !predsRes.ok) return null;

      return {
        user: await userRes.json(),
        predictions: await predsRes.json(),
      };
    } catch {
      return null;
    }
  }

  // ── Prod: usar cookies HttpOnly ─────────
  try {
    const [userRes, predsRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/users/me/`, {
        cache: "no-store",
        credentials: "include", // <<<< importante
      }),
      fetch(`${SERVER_API_URL}/predictions/`, {
        cache: "no-store",
        credentials: "include", // <<<< importante
      }),
    ]);

    if (!userRes.ok || !predsRes.ok) return null;

    return {
      user: await userRes.json(),
      predictions: await predsRes.json(),
    };
  } catch (error) {
    console.error("Error en getMyPredictions:", error);
    return null;
  }
}

// Nota: Para comparar, tu backend de Django debería incluir la lista de 'predictions'
// en el serializer de este endpoint público.
export async function getUserProfile(
  username: string,
): Promise<OpponentProfile | null> {
  const isDev = process.env.NODE_ENV === "development";

  // ── Dev: x-dev-user header ─────────
  if (isDev) {
    try {
      const res = await fetch(`${SERVER_API_URL}/users/profile/${username}/`, {
        headers: {
          "Content-Type": "application/json",
          "x-dev-user": "devuser",
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Error en getUserProfile (dev):", error);
      return null;
    }
  }

  // ── Prod: usar cookies HttpOnly ─────────
  try {
    const res = await fetch(`${SERVER_API_URL}/users/profile/${username}/`, {
      cache: "no-store",
      credentials: "include", // <<<< importante para enviar cookies JWT
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error en getUserProfile (prod):", error);
    return null;
  }
}
