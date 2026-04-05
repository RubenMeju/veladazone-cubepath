"use client";

import { useState, useCallback, useEffect } from "react";
import type { UserAchievement } from "./types";

interface ToastItem extends UserAchievement {
  id: string;
}

// ── Hook interno ──────────────────────────────────────────────────────────────

export function useAchievementToast() {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  const push = useCallback((achievements: UserAchievement[]) => {
    const items: ToastItem[] = achievements.map((a) => ({
      ...a,
      id: `${a.achievement.slug}-${Date.now()}`,
    }));
    setQueue((prev) => [...prev, ...items]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { queue, push, dismiss };
}

// ── Componente individual ─────────────────────────────────────────────────────

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), 4500);
    return () => clearTimeout(t);
  }, [item.id, onDismiss]);

  return (
    <div
      className="
        flex items-center gap-3
        bg-[#1a1a1a] border border-white/10
        rounded-xl px-4 py-3
        shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        animate-slide-up
        cursor-pointer
        min-w-[280px] max-w-[340px]
      "
      onClick={() => onDismiss(item.id)}
    >
      <span className="text-3xl shrink-0">{item.achievement.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#e63946] font-semibold uppercase tracking-wider mb-0.5">
          ¡Logro desbloqueado!
        </p>
        <p className="text-sm font-bold text-white truncate">
          {item.achievement.name}
        </p>
        <p className="text-xs text-white/50 truncate">
          {item.achievement.description}
        </p>
      </div>
      <span className="text-xs text-[#e63946] font-bold shrink-0">
        +{item.achievement.points}pts
      </span>
    </div>
  );
}

// ── Contenedor global ─────────────────────────────────────────────────────────

export function AchievementToastContainer({
  queue,
  onDismiss,
}: {
  queue: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2 items-center">
      {queue.map((item) => (
        <Toast key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
