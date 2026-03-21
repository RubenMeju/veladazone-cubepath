import { useAuthStore } from "@/stores/authStore";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

let isRefreshing = false;

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    try {
      // Intenta refrescar el token
      const refreshRes = await fetch(`${API_URL}/users/token/refresh/`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        isRefreshing = false;
        // Reintenta el request original con el nuevo token
        const retryRes = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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

    // Refresh falló — hace logout
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
