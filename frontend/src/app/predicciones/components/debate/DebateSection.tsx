"use client";

import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Fight } from "@/types";
import { Argument } from "./types";
import { ArgumentCard } from "./components/ArgumentCard";
import { ArgumentInput } from "./components/ArgumentInput";

const PAGE_LIMIT = 5;

export function DebateSection({
  fight,
  userPrediction,
}: {
  fight: Fight;
  userPrediction?: { predicted_winner: { id: number; name: string } };
}) {
  const { user } = useAuthStore();
  console.log("USER DEBUG:", user);
  const queryClient = useQueryClient();
  const [newText, setNewText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Query solo para el count — siempre activa
  const { data: countData } = useQuery({
    queryKey: ["arguments-count", fight.id],
    queryFn: async () => {
      const res = await api.get(
        `/predictions/arguments/?fight=${fight.id}&limit=1&offset=0`,
      );
      return (res as any).count ?? 0;
    },
  });

  const totalCount = countData ?? 0;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["arguments", fight.id],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await api.get(
          `/predictions/arguments/?fight=${fight.id}&limit=${PAGE_LIMIT}&offset=${pageParam}`,
        );
        return (res as any).results
          ? ((res as any).results as Argument[])
          : (res as Argument[]);
      },
      enabled: isOpen,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < PAGE_LIMIT ? undefined : allPages.length * PAGE_LIMIT,
    });

  const arguments_ = data?.pages.flat() ?? [];

  const createMutation = useMutation({
    mutationFn: (text: string) =>
      api.post("/predictions/arguments/", {
        fight: fight.id,
        fighter_supported: userPrediction?.predicted_winner.id,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
      queryClient.invalidateQueries({
        queryKey: ["arguments-count", fight.id],
      });
      setNewText("");
    },
  });

  const voteMutation = useMutation({
    mutationFn: (argumentId: number) =>
      api.post(`/predictions/arguments/${argumentId}/vote/`, {}),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ argumentId, text }: { argumentId: number; text: string }) =>
      api.post(`/predictions/arguments/${argumentId}/reply/`, { text }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] }),
  });

  const f1Count = arguments_.filter(
    (a) => a.fighter_name === fight.fighter1.name,
  ).length;
  const f2Count = arguments_.filter(
    (a) => a.fighter_name === fight.fighter2.name,
  ).length;

  const topArgument =
    arguments_.length > 0
      ? [...arguments_].sort((a, b) => b.vote_count - a.vote_count)[0]
      : undefined;

  return (
    <div className="mt-4">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-xs text-gray-500 hover:text-gray-300"
      >
        <span className="flex items-center gap-2">
          <span>💬</span>
          <span>
            Debate
            {totalCount > 0 && (
              <span className="ml-1.5 bg-[#e63946]/20 text-[#e63946] text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </span>
        </span>
        <span className="text-[10px] tracking-wider">
          {isOpen ? "▲ cerrar" : "▼ ver debate"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4">
          {/* Barra de bandos */}
          {arguments_.length > 0 && (
            <div className="flex items-center gap-3 text-xs bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-2.5">
              <span className="text-[#e63946] font-medium">
                {fight.fighter1.name}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#e63946] to-[#9146FF] rounded-full transition-all duration-500"
                  style={{
                    width: `${f1Count + f2Count > 0 ? Math.round((f1Count / (f1Count + f2Count)) * 100) : 50}%`,
                  }}
                />
              </div>
              <span className="text-[#9146FF] font-medium">
                {fight.fighter2.name}
              </span>
            </div>
          )}

          {/* Top argumento */}
          {topArgument && topArgument.vote_count > 2 && (
            <div className="relative overflow-hidden bg-[#0a0a0a] border border-[#f4a261]/20 rounded-xl p-4">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
              <div className="text-[10px] text-[#f4a261]/70 font-medium tracking-[0.3em] uppercase mb-3">
                🏆 Argumento más votado
              </div>
              <ArgumentCard
                arg={topArgument}
                currentUsername={user?.twitch_username}
                onVote={voteMutation.mutate}
                onReply={(id, text) =>
                  replyMutation.mutate({ argumentId: id, text })
                }
                isVoting={voteMutation.isPending}
              />
            </div>
          )}

          {/* Lista de argumentos */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#e63946]/50 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs">Cargando argumentos...</span>
              </div>
            ) : arguments_.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-gray-600">
                <span className="text-3xl">🔥</span>
                <span className="text-sm">Sé el primero en argumentar</span>
              </div>
            ) : (
              arguments_.map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  arg={arg}
                  currentUsername={user?.twitch_username}
                  onVote={voteMutation.mutate}
                  onReply={(id, text) =>
                    replyMutation.mutate({ argumentId: id, text })
                  }
                  isVoting={voteMutation.isPending}
                />
              ))
            )}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full text-xs text-gray-500 hover:text-gray-300 py-2 border border-white/5 hover:border-white/10 rounded-xl transition-all"
              >
                {isFetchingNextPage ? "Cargando..." : "Ver más argumentos"}
              </button>
            )}
          </div>

          {/* Input */}
          {user && userPrediction ? (
            <ArgumentInput
              text={newText}
              setText={setNewText}
              fighterName={userPrediction.predicted_winner.name}
              onSubmit={() => newText.trim() && createMutation.mutate(newText)}
              isPending={createMutation.isPending}
            />
          ) : user ? (
            <p className="text-center text-xs text-gray-600 py-4 border border-white/5 rounded-xl">
              Haz tu predicción primero para participar en el debate
            </p>
          ) : (
            <p className="text-center text-xs text-gray-600 py-4 border border-white/5 rounded-xl">
              Inicia sesión con Twitch para participar
            </p>
          )}
        </div>
      )}
    </div>
  );
}
