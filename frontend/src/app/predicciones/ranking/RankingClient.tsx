"use client";

import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { LeaderboardEntry, User } from "@/types";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface LeaderboardPage {
  results: LeaderboardEntry[];
  nextOffset?: number | null;
}

interface Props {
  initialEntries: LeaderboardEntry[];
  initialNextOffset?: number | null;
}

const medals = ["🥇", "🥈", "🥉"];

export function RankingClient({ initialEntries, initialNextOffset }: Props) {
  console.log(
    "initialEntries:",
    initialEntries.length,
    "initialNextOffset:",
    initialNextOffset,
  );

  const me = useAuthStore((s) => s.user) as User | null;
  const myTwitchName = me ? me.twitch_username || me.username : null;

  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [hasMore, setHasMore] = useState(!!initialNextOffset);
  const [isFetching, setIsFetching] = useState(false);

  const observerElem = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialNextOffset ?? 0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(!!initialNextOffset);

  const fetchPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setIsFetching(true);

    try {
      const res = await api.get<LeaderboardPage>(
        `/predictions/leaderboard/?limit=50&offset=${offsetRef.current}`,
      );

      setEntries((prev) => [...prev, ...(res.results ?? [])]);

      if (res.nextOffset == null) {
        hasMoreRef.current = false;
        setHasMore(false);
      } else {
        offsetRef.current = res.nextOffset;
      }
    } catch {
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!observerElem.current || !hasMore) return;

    const observer = new IntersectionObserver((obs) => {
      if (obs[0].isIntersecting) fetchPage();
    });

    observer.observe(observerElem.current);
    return () => observer.disconnect();
  }, [fetchPage, hasMore]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const myEntry = useMemo(
    () => entries.find((e) => e.username === myTwitchName),
    [entries, myTwitchName],
  );

  const myPosition = useMemo(() => {
    if (!myTwitchName) return null;
    const index = entries.findIndex((e) => e.username === myTwitchName);
    return index >= 0 ? index + 1 : null;
  }, [entries, myTwitchName]);

  return (
    <div className="flex flex-col gap-8">
      {/* 🥇 TOP 3 */}
      {top3.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {top3.map((entry, idx) => (
            <Link
              key={entry.username}
              href={`/perfil/${entry.username}`}
              className={`relative rounded-2xl border p-5 flex flex-col items-center text-center
                transition-all duration-500 ease-out
                hover:-translate-y-1 hover:scale-[1.02]
                ${
                  idx === 0
                    ? "bg-[#1a1a1a] border-[#f4a261]/40 shadow-[0_0_40px_rgba(244,162,97,0.15)]"
                    : "bg-[#111] border-white/5 hover:border-[#e63946]/30"
                }
              `}
            >
              <div className="absolute -top-4 text-2xl">{medals[idx]}</div>

              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-20 h-20 rounded-full mb-3 border border-white/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#2a2a2a] mb-3" />
              )}

              <div className="text-white font-medium">{entry.username}</div>

              {entry.badge && (
                <div
                  className="text-[10px] mt-1 px-2 py-0.5 rounded-full"
                  style={{
                    color: entry.badge.color,
                    backgroundColor: `${entry.badge.color}20`,
                  }}
                >
                  {entry.badge.emoji} {entry.badge.label}
                </div>
              )}

              <div className="font-bebas text-4xl text-[#f4a261] mt-3">
                {entry.accuracy}%
              </div>

              <div className="text-gray-500 text-xs">
                {entry.correct}/{entry.total} aciertos
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 📌 TU POSICIÓN */}
      {myEntry && myPosition && (
        <div className="sticky top-4 z-10">
          <div className="rounded-xl border border-[#f4a261]/40 bg-[#f4a261]/10 p-3 flex items-center gap-4 backdrop-blur transition">
            <span className="font-bebas text-lg text-[#f4a261]">
              TU POSICIÓN
            </span>
            <span className="text-white font-medium">#{myPosition}</span>
            <span className="text-white">{myEntry.username}</span>
            <span className="ml-auto font-bebas text-xl text-[#f4a261]">
              {myEntry.accuracy}%
            </span>
          </div>
        </div>
      )}

      {/* 🧾 RESTO DEL RANKING */}
      <div className="flex flex-col gap-3">
        {rest.map((entry, idx) => {
          const position = idx + 4;
          return (
            <Link
              key={`${entry.username}-${idx}`}
              href={`/perfil/${entry.username}`}
              className={`group flex items-center gap-4 p-3 rounded-xl border
                transition-all duration-300 ease-out
                hover:-translate-y-[2px] hover:scale-[1.01]
                ${
                  entry.username === myTwitchName
                    ? "border-[#f4a261]/40 bg-[#f4a261]/5"
                    : "border-white/5 bg-[#0f0f0f] hover:bg-[#1a1a1a] hover:border-[#e63946]/30"
                }
              `}
            >
              <div className="w-10 text-center font-bebas text-xl text-gray-400 group-hover:text-white transition">
                #{position}
              </div>

              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {entry.username}
                  </span>
                  {entry.badge && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        color: entry.badge.color,
                        backgroundColor: `${entry.badge.color}20`,
                      }}
                    >
                      {entry.badge.emoji} {entry.badge.label}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">
                  {entry.correct}/{entry.total} correctas
                </div>
              </div>

              <div className="font-bebas text-2xl text-[#f4a261]">
                {entry.accuracy}%
              </div>
            </Link>
          );
        })}

        {/* infinite scroll */}
        <div
          ref={observerElem}
          className="text-center p-4 text-gray-500 text-sm"
        >
          {isFetching
            ? "Cargando más..."
            : hasMore
              ? "Desplázate para cargar más"
              : "Fin del ranking"}
        </div>
      </div>
    </div>
  );
}
