"use client";

import { useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import type { UserAchievement, MyAchievementsResponse } from "./types";

/**
 * Polling ligero cada 5s para detectar logros recién desbloqueados.
 * onUnlocked se llama con cada lote de logros nuevos para mostrar el toast.
 */
export function useAchievementPoller(
  onUnlocked: (achievements: UserAchievement[]) => void,
  enabled: boolean = true,
) {
  const onUnlockedRef = useRef(onUnlocked);
  onUnlockedRef.current = onUnlocked;

  useEffect(() => {
    if (!enabled) return;

    const check = async () => {
      try {
        const unread = await api.get<UserAchievement[]>(
          "/achievements/unread/",
        );
        if (unread.length > 0) {
          // Marca como leídos antes de notificar para evitar duplicados
          await api.post("/achievements/unread/", {});
          onUnlockedRef.current(unread);
        }
      } catch {
        // silencioso — el usuario puede no estar autenticado
      }
    };

    check(); // comprueba al montar
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [enabled]);
}

/**
 * Fetch de los logros del usuario autenticado.
 */
export async function fetchMyAchievements(): Promise<MyAchievementsResponse> {
  return api.get<MyAchievementsResponse>("/achievements/");
}
