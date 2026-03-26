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
  const [newText, setNewText] = useState("");

  // Cargar todos los argumentos del combate
  const { data: arguments_ = [] } = useQuery({
    queryKey: ["arguments", fight.id],
    queryFn: () =>
      api.get<Argument[]>(`/predictions/arguments/?fight=${fight.id}`),
  });

  // Crear nuevo argumento (múltiples permitidos)
  const createMutation = useMutation({
    mutationFn: (text: string) =>
      api.post("/predictions/arguments/", {
        fight: fight.id, // ← backend espera "fight"
        fighter_supported: userPrediction?.predicted_winner.id,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
      setNewText("");
    },
  });

  // Votar
  const voteMutation = useMutation({
    mutationFn: (argumentId: number) =>
      api.post(`/predictions/arguments/${argumentId}/vote/`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
    },
  });

  // Responder (a un argumento)
  const replyMutation = useMutation({
    mutationFn: ({ argumentId, text }: { argumentId: number; text: string }) =>
      api.post(`/predictions/arguments/${argumentId}/reply/`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arguments", fight.id] });
    },
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
        onClick={() => {}} // si quieres toggle, pon aquí tu lógica
        className="w-full text-left text-xs text-gray-500 hover:text-gray-300 flex items-center gap-2 py-1"
      >
        💬 Debate ({arguments_.length} argumentos)
      </button>

      <div className="mt-3 space-y-4">
        {/* Contador de bandos */}
        {arguments_.length > 0 && (
          <div className="flex justify-between text-xs text-gray-500 bg-[#0f0f0f] rounded-lg px-4 py-2">
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

        {/* Más votado */}
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

        {/* Lista de argumentos */}
        <div className="space-y-3">
          {arguments_.map((arg) => (
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
          ))}

          {arguments_.length === 0 && (
            <p className="text-center text-gray-600 py-8 text-sm">
              Sé el primero en dejar tu argumento 🔥
            </p>
          )}
        </div>

        {/* Input para escribir nuevo argumento */}
        {user && userPrediction ? (
          <ArgumentInput
            text={newText}
            setText={setNewText}
            fighterName={userPrediction.predicted_winner.name}
            onSubmit={() => createMutation.mutate(newText)}
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
    </div>
  );
}
