"use client";

import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
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
  const queryClient = useQueryClient();
  const [newText, setNewText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["arguments", fight.id],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await api.get(
          `/predictions/arguments/?fight=${fight.id}&limit=${PAGE_LIMIT}&offset=${pageParam}`,
        );
        // Si la respuesta tiene paginación DRF, extraer results; si no, usar directamente
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

  // Crear nuevo argumento
  const createMutation = useMutation({
    mutationFn: (text: string) =>
      api.post("/predictions/arguments/", {
        fight: fight.id,
        fighter_supported: userPrediction?.predicted_winner.id,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
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
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs text-gray-500 hover:text-gray-300 flex items-center gap-2 py-1"
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        💬 Debate ({arguments_.length} argumentos)
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4">
          {arguments_.length > 0 && (
            <div className="flex justify-between text-xs text-gray-500 bg-[#0f0f0f] rounded-lg px-4 py-2">
              <span>
                {fight.fighter1.name}:{" "}
                <span className="text-[#e63946]">{f1Count}</span>
              </span>
              <span>
                {fight.fighter2.name}:{" "}
                <span className="text-[#9146FF]">{f2Count}</span>
              </span>
            </div>
          )}

          {topArgument && topArgument.vote_count > 2 && (
            <div className="bg-[#f4a261]/5 border border-[#f4a261]/30 rounded-xl p-4">
              <div className="text-[#f4a261] text-xs tracking-widest mb-2">
                🏆 MÁS VOTADO
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

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <p className="text-center py-8 text-gray-600">Cargando...</p>
            ) : arguments_.length === 0 ? (
              <p className="text-center py-8 text-gray-600">
                Sé el primero en dejar tu argumento 🔥
              </p>
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

            {/* Botón para cargar más */}
            {hasNextPage && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded"
                >
                  {isFetchingNextPage ? "Cargando..." : "Mostrar más"}
                </button>
              </div>
            )}
          </div>

          {/* Input para crear nuevo */}
          {user && userPrediction ? (
            <ArgumentInput
              text={newText}
              setText={setNewText}
              fighterName={userPrediction.predicted_winner.name}
              onSubmit={() => newText.trim() && createMutation.mutate(newText)}
              isPending={createMutation.isPending}
            />
          ) : user ? (
            <p className="text-center text-xs text-gray-600 py-4">
              Haz tu predicción primero para participar en el debate
            </p>
          ) : (
            <p className="text-center text-xs text-gray-600 py-4">
              Inicia sesión con Twitch para participar
            </p>
          )}
        </div>
      )}
    </div>
  );
}
