import { useAuthStore } from '@/stores/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().accessToken

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    fetchAPI<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

export const twitchLoginUrl = `${BACKEND_URL}/auth/login/twitch/`