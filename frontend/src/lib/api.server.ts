/**
 * api.server.ts
 * Fetch helper exclusivo para Server Components.
 * Usa BACKEND_URL (red interna Docker) en vez de NEXT_PUBLIC_API_URL (browser).
 * Nunca importar desde Client Components.
 */
import { cookies } from "next/headers";
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

/**
 * Helper para obtener las cookies y headers de auth
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const isDev = process.env.NODE_ENV === "development";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isDev) {
    headers["x-dev-user"] = "devuser";
  } else {
    // En PROD, extraemos las cookies que el navegador envió a Next.js
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  return headers;
}

export async function getMyPredictions(): Promise<{
  user: User;
  predictions: Prediction[];
} | null> {
  try {
    const authHeaders = await getAuthHeaders();

    const [userRes, predsRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/users/me/`, {
        headers: authHeaders,
        cache: "no-store",
      }),
      fetch(`${SERVER_API_URL}/predictions/`, {
        headers: authHeaders,
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok || !predsRes.ok) {
      console.error(
        "Auth failed en getMyPredictions:",
        userRes.status,
        predsRes.status,
      );
      return null;
    }

    return {
      user: await userRes.json(),
      predictions: await predsRes.json(),
    };
  } catch (error) {
    console.error("Error en getMyPredictions:", error);
    return null;
  }
}

export async function getUserProfile(
  username: string,
): Promise<OpponentProfile | null> {
  try {
    const authHeaders = await getAuthHeaders();

    const res = await fetch(`${SERVER_API_URL}/users/profile/${username}/`, {
      headers: authHeaders,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return null;
  }
}
