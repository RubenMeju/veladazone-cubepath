/**
 * api.server.ts
 * Fetch helper exclusivo para Server Components.
 * Usa BACKEND_URL (red interna Docker) en vez de NEXT_PUBLIC_API_URL (browser).
 * Nunca importar desde Client Components.
 */

// En producción Docker: http://backend:8000/api/v1
// En desarrollo local: http://localhost:8000/api/v1
const SERVER_API_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/v1`
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
