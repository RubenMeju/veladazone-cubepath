import { useAuthStore } from "@/stores/authStore";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const isDev = process.env.NODE_ENV === "development";

let isRefreshing = false;

function getDevHeaders(): Record<string, string> {
  if (isDev) {
    return { "x-dev-user": "devuser" };
  }
  return {};
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getDevHeaders(),
      ...options?.headers,
    },
  });

  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshRes = await fetch(`${API_URL}/users/token/refresh/`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        isRefreshing = false;
        const retryRes = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...getDevHeaders(),
            ...options?.headers,
          },
        });
        if (retryRes.ok) return retryRes.json();
      }
    } catch {
      // Refresh falló
    } finally {
      isRefreshing = false;
    }

    useAuthStore.getState().logout();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    fetchAPI<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const twitchLoginUrl = `${BACKEND_URL}/auth/login/twitch/`;
