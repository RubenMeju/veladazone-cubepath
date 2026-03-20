"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Fight } from "@/types";

interface ArgumentReply {
  id: number;
  username: string;
  avatar: string | null;
  text: string;
  created_at: string;
}

interface Argument {
  id: number;
  username: string;
  avatar: string | null;
  fighter_name: string;
  fighter_flag: string;
  text: string;
  vote_count: number;
  replies: ArgumentReply[];
  user_voted: boolean;
  user_replied: boolean;
  created_at: string;
}

function ArgumentCard({
  arg,
  currentUsername,
  onVote,
  onReply,
  isVoting,
}: {
  arg: Argument;
  currentUsername?: string;
  onVote: (id: number) => void;
  onReply: (id: number, text: string) => void;
  isVoting: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isOwn = arg.username === currentUsername;

  return (
    <div className="bg-[#0f0f0f] rounded-lg p-3">
      {/* Argumento principal */}
      <div className="flex items-start gap-2">
        {arg.avatar ? (
          <img src={arg.avatar} className="w-6 h-6 rounded-full flex-shrink-0" alt="" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs text-gray-300 font-medium">{arg.username}</span>
            <span className="text-xs">{arg.fighter_flag}</span>
            <span className="text-[10px] text-gray-600">apoya a {arg.fighter_name}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{arg.text}</p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => !isOwn && onVote(arg.id)}
            disabled={isOwn || isVoting}
            className={`flex flex-col items-center gap-0.5 disabled:opacity-30 transition-colors ${
              arg.user_voted ? "text-[#e63946]" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="text-xs">{arg.user_voted ? "❤️" : "👍"}</span>
            <span className="text-[10px]">{arg.vote_count}</span>
          </button>
        </div>
      </div>

      {/* Respuestas existentes */}
      {arg.replies.length > 0 && (
        <div className="mt-2 ml-8 flex flex-col gap-1.5">
          {arg.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              {reply.avatar ? (
                <img src={reply.avatar} className="w-5 h-5 rounded-full flex-shrink-0" alt="" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#2a2a2a] flex-shrink-0" />
              )}
              <div>
                <span className="text-[10px] text-gray-400 font-medium mr-1">{reply.username}</span>
                <span className="text-[10px] text-gray-500">{reply.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón responder */}
      {!isOwn && currentUsername && !arg.user_replied && (
        <div className="mt-2 ml-8">
          {!showReply ? (
            <button
              onClick={() => setShowReply(true)}
              className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
            >
              💬 Responder
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value.slice(0, 280))}
                placeholder="Tu respuesta..."
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1 text-white text-[10px] placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
                autoFocus
              />
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    onReply(arg.id, replyText.trim())
                    setReplyText("")
                    setShowReply(false)
                  }
                }}
                className="text-[10px] bg-[#e63946] hover:bg-[#c1121f] text-white px-2 py-1 rounded transition-colors"
              >
                ↩
              </button>
              <button
                onClick={() => setShowReply(false)}
                className="text-[10px] text-gray-600 hover:text-gray-400"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {arg.user_replied && (
        <div className="mt-1 ml-8">
          <span className="text-[10px] text-gray-600">✓ Ya has respondido</span>
        </div>
      )}
    </div>
  );
}

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
    queryFn: () => api.get<Argument[]>(`/predictions/arguments/?fight=${fight.id}`),
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

  const userArgument = arguments_?.find((a) => a.username === user?.twitch_username);
  const topArgument = arguments_?.reduce((prev, curr) =>
    curr.vote_count > (prev?.vote_count ?? -1) ? curr : prev
  , arguments_?.[0]);

  const f1Count = arguments_?.filter(a => a.fighter_name === fight.fighter1.name).length ?? 0;
  const f2Count = arguments_?.filter(a => a.fighter_name === fight.fighter2.name).length ?? 0;
  const totalCount = (arguments_?.length ?? 0);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2 py-1"
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        <span>💬 Debate</span>
        {totalCount > 0 && (
          <span className="text-gray-600">({totalCount} {totalCount === 1 ? "argumento" : "argumentos"})</span>
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">

          {/* Contador de bandos */}
          {totalCount > 0 && (
            <div className="flex justify-between text-[10px] text-gray-500 bg-[#0f0f0f] rounded-lg px-3 py-2">
              <span>{fight.fighter1.country_flag} {fight.fighter1.name}: <span className="text-[#e63946] font-medium">{f1Count}</span></span>
              <span>{fight.fighter2.country_flag} {fight.fighter2.name}: <span className="text-[#9146FF] font-medium">{f2Count}</span></span>
            </div>
          )}

          {/* Top argumento */}
          {topArgument && topArgument.vote_count > 0 && (
            <div className="bg-[#f4a261]/5 border border-[#f4a261]/20 rounded-xl p-3">
              <div className="text-[10px] text-[#f4a261] tracking-wider mb-2">🏆 MÁS VOTADO</div>
              <ArgumentCard
                arg={topArgument}
                currentUsername={user?.twitch_username}
                onVote={(id) => voteMutation.mutate(id)}
                onReply={(id, text) => replyMutation.mutate({ argumentId: id, text })}
                isVoting={voteMutation.isPending}
              />
            </div>
          )}

          {/* Lista de argumentos */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {arguments_?.filter(a => a.id !== topArgument?.id || topArgument.vote_count === 0).map((arg) => (
              <ArgumentCard
                key={arg.id}
                arg={arg}
                currentUsername={user?.twitch_username}
                onVote={(id) => voteMutation.mutate(id)}
                onReply={(id, text) => replyMutation.mutate({ argumentId: id, text })}
                isVoting={voteMutation.isPending}
              />
            ))}

            {!arguments_?.length && (
              <p className="text-xs text-gray-600 text-center py-3">
                Sé el primero en dejar tu argumento
              </p>
            )}
          </div>

          {/* Input argumento propio */}
          {user && userPrediction && (
            <div className="flex flex-col gap-2">
              {userArgument && (
                <div className="text-[10px] text-gray-600 flex items-center gap-1">
                  <span>✏️</span>
                  <span>Editando tu argumento</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 280))}
                  placeholder={
                    userArgument
                      ? `Tu argumento actual: "${userArgument.text.slice(0, 30)}..."`
                      : `¿Por qué ganará ${userPrediction.predicted_winner.name}?`
                  }
                  className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
                />
                <button
                  onClick={() => text.trim() && createMutation.mutate()}
                  disabled={!text.trim() || createMutation.isPending}
                  className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                >
                  {createMutation.isPending ? "..." : userArgument ? "Editar" : "Enviar"}
                </button>
              </div>
              <div className="flex justify-between text-[10px] text-gray-600">
                <span>{userArgument ? "Un argumento por combate — puedes editarlo" : ""}</span>
                <span>{text.length}/280</span>
              </div>
            </div>
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