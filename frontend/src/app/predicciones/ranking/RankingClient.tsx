"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { LeaderboardEntry, User } from "@/types";
import { Search, Swords, ChevronRight, User as UserIcon } from "lucide-react";

interface Props {
  initialEntries: LeaderboardEntry[];
  initialNextOffset?: number | null;
}

export function RankingClient({ initialEntries, initialNextOffset }: Props) {
  const me = useAuthStore((s) => s.user) as User | null;
  const myName = me?.twitch_username || me?.username;

  const [entries, setEntries] = useState(initialEntries);
  const [hasMore, setHasMore] = useState(!!initialNextOffset);
  const [isFetching, setIsFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const observerElem = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialNextOffset ?? 0);

  const fetchPage = useCallback(async () => {
    if (isFetching || !hasMore || searchQuery) return;
    setIsFetching(true);
    try {
      const res = await api.get<{
        results: LeaderboardEntry[];
        nextOffset: number;
      }>(`/predictions/leaderboard/?limit=50&offset=${offsetRef.current}`);
      if (res.results) {
        setEntries((prev) => [...prev, ...res.results]);
        setHasMore(!!res.nextOffset);
        offsetRef.current = res.nextOffset ?? 0;
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchPage();
      },
      { threshold: 0.1 },
    );
    if (observerElem.current) observer.observe(observerElem.current);
    return () => observer.disconnect();
  }, [fetchPage]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) =>
      e.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [entries, searchQuery]);

  const top3 = useMemo(() => entries.slice(0, 3), [entries]);
  const rest = useMemo(() => filteredEntries.slice(3), [filteredEntries]);
  const myEntry = useMemo(
    () => entries.find((e) => e.username === myName),
    [entries, myName],
  );
  const myPosition = entries.findIndex((e) => e.username === myName) + 1;

  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* Buscador */}
      {/* <div className="relative max-w-md mx-auto group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[#f4a261] transition-colors" />
        <input
          type="text"
          placeholder="Busca un oponente..."
          className="w-full bg-[#111] border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#f4a261] focus:ring-1 focus:ring-[#f4a261] transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}

      {/* Podio Visual */}
      {!searchQuery && top3.length > 0 && (
        <div className="grid grid-cols-3 items-end gap-2 md:gap-6 pt-10 px-2">
          {podiumOrder.map((entry, idx) => {
            if (!entry) return <div key={idx} />;
            const isFirst = entry.username === top3[0].username;
            const avatarSize = isFirst
              ? "w-24 h-24 md:w-32 md:h-32"
              : "w-16 h-16 md:w-24 md:h-24";

            return (
              <div
                key={entry.username}
                className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              >
                <div className="relative mb-4 group">
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      className={`rounded-full border-4 transition-transform duration-500 group-hover:scale-110 object-cover
                        ${avatarSize} ${isFirst ? "border-[#f4a261] shadow-[0_0_30px_rgba(244,162,97,0.4)]" : "border-gray-700 shadow-xl"}`}
                      alt={entry.username}
                    />
                  ) : (
                    <div
                      className={`rounded-full border-4 bg-[#222] flex items-center justify-center
                      ${avatarSize} ${isFirst ? "border-[#f4a261]" : "border-gray-700"}`}
                    >
                      <UserIcon className="text-gray-500 w-1/2 h-1/2" />
                    </div>
                  )}
                  <div
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 font-bebas text-2xl ${isFirst ? "text-[#f4a261]" : "text-gray-400"}`}
                  >
                    {entry.username === top3[0].username
                      ? "🥇"
                      : entry.username === top3[1].username
                        ? "🥈"
                        : "🥉"}
                  </div>
                </div>
                <div
                  className={`w-full rounded-t-2xl bg-linear-to-b from-[#1a1a1a] to-black/0 p-4 text-center border-t border-white/10
                  ${isFirst ? "h-32 md:h-44 border-x border-[#f4a261]/20" : "h-24 md:h-32"}`}
                >
                  <p className="text-white font-bold truncate text-xs md:text-base mb-1">
                    {entry.username}
                  </p>
                  <p className="text-[#f4a261] font-bebas text-2xl md:text-4xl leading-none">
                    {entry.accuracy}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista Principal */}
      <div className="flex flex-col gap-3 px-2">
        {rest.map((entry, idx) => {
          const isMe = entry.username === myName;
          return (
            <div
              key={entry.username}
              className={`group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 
    ${
      isMe
        ? "bg-[#f4a261]/10 border-[#f4a261]/40 ring-1 ring-[#f4a261]/20"
        : "bg-[#0a0a0a] border-white/5 hover:border-white/20 hover:bg-[#111] shadow-lg hover:shadow-white/5"
    } hover:-translate-y-0.5 active:scale-[0.99]`}
            >
              {/* Rank - Más compacto en móvil */}
              <div className="w-6 sm:w-8 font-bebas text-lg sm:text-xl text-gray-500 italic shrink-0">
                #{idx + (searchQuery ? 1 : 4)}
              </div>

              <Link
                href={`/perfil/${entry.username}`}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
              >
                {/* Avatar con fallback mejorado */}
                <div className="relative shrink-0">
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 object-cover"
                      alt={entry.username}
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-gradient-to-br from-[#222] to-[#111] flex items-center justify-center">
                      <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                  )}
                  {/* Indicador visual si es "Me" opcional */}
                  {isMe && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f4a261] rounded-full border-2 border-[#0a0a0a]" />
                  )}
                </div>

                <div className=" gap-1.5">
                  <span className="text-white font-bold text-sm sm:text-base truncate">
                    {entry.username}
                  </span>
                  <div className="flex gap-4">
                    {entry.badge && (
                      <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">
                        {entry.badge.label}
                      </span>
                    )}
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                      <span className="text-green-500/80">{entry.correct}</span>
                      <span className="mx-1 text-gray-700">/</span>
                      <span>
                        {entry.total}{" "}
                        <span className="hidden xs:inline text-gray-600 ml-0.5 text-[9px]">
                          TOTALES
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </Link>

              {/* Stats y Acciones */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="text-right flex flex-col items-end justify-center">
                  <p className="text-[#f4a261] font-bebas text-2xl sm:text-3xl leading-none tracking-tight">
                    {entry.accuracy}
                    <span className="text-sm ml-0.5">%</span>
                  </p>
                  <span className="text-[8px] text-[#f4a261]/50 font-bold tracking-widest hidden sm:block uppercase">
                    PRECISIÓN
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  {myName && !isMe && (
                    <Link
                      href={`/predicciones/ranking/comparar/${entry.username}`}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-[#e63946] text-gray-500 hover:text-white transition-all active:scale-90 border border-white/5"
                      title="Duelo Directo"
                    >
                      <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  )}

                  <Link
                    href={`/perfil/${entry.username}`}
                    className="p-1 sm:p-2 text-gray-600 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={observerElem} className="py-20 flex justify-center">
          {isFetching && (
            <div className="w-6 h-6 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Tu posición Sticky */}
      {myEntry && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-50 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          <div className="bg-[#f4a261] text-black px-6 py-4 rounded-3xl shadow-[0_20px_60px_rgba(244,162,97,0.4)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white font-bebas text-2xl px-4 py-1 rounded-2xl transform -rotate-2">
                #{myPosition}
              </div>
              <div className="hidden xs:block">
                <p className="text-[10px] uppercase font-black leading-none opacity-80 mb-1">
                  Tu posición global
                </p>
                <p className="font-bold text-lg leading-none">
                  ¡Sigue así, {myName}!
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bebas text-4xl leading-none">
                {myEntry.accuracy}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
