"use client";

import { useAuthStore } from "@/stores/authStore";
import {
  AchievementToastContainer,
  useAchievementToast,
} from "../achievements/AchievementToast";
import { useAchievementPoller } from "../achievements/UseAchievements";

export function AchievementsProvider() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated()); // ← llamada como función
  const { queue, push, dismiss } = useAchievementToast();

  useAchievementPoller(push, isAuthenticated);

  return <AchievementToastContainer queue={queue} onDismiss={dismiss} />;
}
