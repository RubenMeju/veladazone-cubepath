"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Fight } from "@/types";

interface Argument {
  id: number;
  username: string;
  avatar: string | null;
  fighter_name: string;
  fighter_flag: string;
  text: string;
  votes: number;
  created_at: string;
}

export function DebateSection({
  fight,
  userPrediction,
}: {
  fight: Fight;
  userPrediction?: { predicted_winner: { id: number } };
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

  const topArgument = arguments_?.find(
    (a) =>
      a.votes === Math.max(...(arguments_?.map((x) => x.votes) || [0])) &&
      a.votes > 0,
  );

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 py-1"
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        <span>💬 Debate</span>
        {arguments_?.length ? (
          <span className="text-gray-600">
            ({arguments_.length} argumentos)
          </span>
        ) : null}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {/* Top argument */}
          {topArgument && (
            <div className="bg-[#f4a261]/5 border border-[#f4a261]/20 rounded-xl p-3">
              <div className="text-[10px] text-[#f4a261] tracking-wider mb-2">
                🏆 ARGUMENTO MÁS VOTADO
              </div>
              <div className="flex items-start gap-2">
                {topArgument.avatar ? (
                  <img
                    src={topArgument.avatar}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    alt=""
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-gray-400 font-medium">
                      {topArgument.username}
                    </span>
                    <span className="text-xs">{topArgument.fighter_flag}</span>
                    <span className="text-[10px] text-gray-600">
                      apoya a {topArgument.fighter_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {topArgument.text}
                  </p>
                </div>
                <span className="text-xs text-[#f4a261] font-bebas text-lg">
                  {topArgument.votes}
                </span>
              </div>
            </div>
          )}

          {/* Arguments list */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {arguments_
              ?.filter((a) => a.id !== topArgument?.id)
              .map((arg) => (
                <div
                  key={arg.id}
                  className="bg-[#0f0f0f] rounded-lg p-3 flex items-start gap-2"
                >
                  {arg.avatar ? (
                    <img
                      src={arg.avatar}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      alt=""
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs text-gray-400 font-medium">
                        {arg.username}
                      </span>
                      <span className="text-xs">{arg.fighter_flag}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {arg.text}
                    </p>
                  </div>
                  <button
                    onClick={() => user && voteMutation.mutate(arg.id)}
                    disabled={!user || arg.username === user.twitch_username}
                    className="flex flex-col items-center gap-0.5 flex-shrink-0 disabled:opacity-30"
                  >
                    <span className="text-xs">👍</span>
                    <span className="text-[10px] text-gray-500">
                      {arg.votes}
                    </span>
                  </button>
                </div>
              ))}

            {!arguments_?.length && (
              <p className="text-xs text-gray-600 text-center py-3">
                Sé el primero en dejar tu argumento
              </p>
            )}
          </div>

          {/* Input */}
          {user && userPrediction && (
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 280))}
                placeholder={`¿Por qué ganará ${
                  userPrediction.predicted_winner.id === fight.fighter1.id
                    ? fight.fighter1.name
                    : fight.fighter2.name
                }?`}
                className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
              />
              <button
                onClick={() => text.trim() && createMutation.mutate()}
                disabled={!text.trim() || createMutation.isPending}
                className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                {createMutation.isPending ? "..." : "Enviar"}
              </button>
            </div>
          )}

          {user && !userPrediction && (
            <p className="text-xs text-gray-600 text-center">
              Haz tu predicción primero para dejar un argumento
            </p>
          )}
        </div>
      )}
    </div>
  );
}
