"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Fight } from "@/types";
import { Argument } from "./types";
import { ArgumentCard } from "./components/ArgumentCard";
import { ArgumentInput } from "./components/ArgumentInput";

export function DebateSection({
  fight,
  userPrediction,
}: {
  fight: Fight;
  userPrediction?: { predicted_winner: { id: number; name: string } };
}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: arguments_ } = useQuery({
    queryKey: ["arguments", fight.id],
    queryFn: () =>
      api.get<Argument[]>(`/predictions/arguments/?fight=${fight.id}`),
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.post("/predictions/arguments/", {
        fight_id: fight.id,
        fighter_id: userPrediction?.predicted_winner.id,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
      setText("");
    },
  });

  const voteMutation = useMutation({
    mutationFn: (argumentId: number) =>
      api.post(`/predictions/arguments/${argumentId}/vote/`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ argumentId, text }: { argumentId: number; text: string }) =>
      api.post(`/predictions/arguments/${argumentId}/reply/`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
    },
  });

  const userArgument = arguments_?.find(
    (a) => a.username === user?.twitch_username,
  );

  const topArgument =
    arguments_ && arguments_.length > 0
      ? arguments_.reduce((prev, curr) =>
          curr.vote_count > prev.vote_count ? curr : prev,
        )
      : undefined;

  const f1Count =
    arguments_?.filter((a) => a.fighter_name === fight.fighter1.name).length ??
    0;
  const f2Count =
    arguments_?.filter((a) => a.fighter_name === fight.fighter2.name).length ??
    0;
  const totalCount = arguments_?.length ?? 0;

  return (
    <div className="mt-3">
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 py-1"
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        <span>💬 Debate</span>
        {totalCount > 0 && (
          <span className="text-gray-600">
            ({totalCount} {totalCount === 1 ? "argumento" : "argumentos"})
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Contador de bandos */}
          {totalCount > 0 && (
            <div className="flex justify-between text-[10px] text-gray-500 bg-[#0f0f0f] rounded-lg px-3 py-2">
              <span>
                {fight.fighter1.country_flag} {fight.fighter1.name}:{" "}
                <span className="text-[#e63946] font-medium">{f1Count}</span>
              </span>
              <span>
                {fight.fighter2.country_flag} {fight.fighter2.name}:{" "}
                <span className="text-[#9146FF] font-medium">{f2Count}</span>
              </span>
            </div>
          )}

          {/* Top argumento */}
          {topArgument && topArgument.vote_count > 0 && (
            <div className="bg-[#f4a261]/5 border border-[#f4a261]/20 rounded-xl p-3">
              <div className="text-[10px] text-[#f4a261] tracking-wider mb-2">
                🏆 MÁS VOTADO
              </div>
              <ArgumentCard
                arg={topArgument}
                currentUsername={user?.twitch_username}
                onVote={(id) => voteMutation.mutate(id)}
                onReply={(id, text) =>
                  replyMutation.mutate({ argumentId: id, text })
                }
                isVoting={voteMutation.isPending}
              />
            </div>
          )}

          {/* Lista de argumentos */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {arguments_
              ?.filter(
                (a) => a.id !== topArgument?.id || topArgument.vote_count === 0,
              )
              .map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  arg={arg}
                  currentUsername={user?.twitch_username}
                  onVote={(id) => voteMutation.mutate(id)}
                  onReply={(id, text) =>
                    replyMutation.mutate({ argumentId: id, text })
                  }
                  isVoting={voteMutation.isPending}
                />
              ))}

            {!arguments_?.length && (
              <p className="text-xs text-gray-600 text-center py-3">
                Sé el primero en dejar tu argumento
              </p>
            )}
          </div>

          {/* Input argumento */}
          {user && userPrediction && (
            <ArgumentInput
              userArgument={userArgument}
              text={text}
              setText={setText}
              fighterName={userPrediction.predicted_winner.name}
              onSubmit={() => text.trim() && createMutation.mutate()}
              isPending={createMutation.isPending}
            />
          )}

          {user && !userPrediction && (
            <p className="text-xs text-gray-600 text-center">
              Haz tu predicción primero para participar en el debate
            </p>
          )}

          {!user && (
            <p className="text-xs text-gray-600 text-center">
              Inicia sesión para participar en el debate
            </p>
          )}
        </div>
      )}
    </div>
  );
}
