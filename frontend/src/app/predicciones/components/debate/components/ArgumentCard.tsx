"use client";

import { useState } from "react";
import Link from "next/link";
import { ArgumentReplyItem } from "./ArgumentReplyItem";
import { Argument, ArgumentReply } from "../types";

export function ArgumentCard({
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

  // Función auxiliar para agregar reply a la estructura correcta
  const handleReply = (parentId: number, text: string) => {
    const newReply: ArgumentReply = {
      id: Date.now(),
      username: currentUsername!,
      avatar: null,
      text,
      created_at: new Date().toISOString(),
      time_ago: "ahora",
      replies: [],
    };
    onReply(parentId, text); // llamar función externa para backend o estado global
  };

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/perfil/${arg.username}`} className="flex-shrink-0">
          {arg.avatar ? (
            <img
              src={arg.avatar}
              className="w-9 h-9 rounded-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#2a2a2a]" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/perfil/${arg.username}`}
              className="text-sm text-white font-semibold hover:text-gray-300 transition-colors"
            >
              {arg.username}
            </Link>
            {arg.fighter_flag && (
              <span className="text-sm">{arg.fighter_flag}</span>
            )}
            <span className="text-xs text-gray-500">
              apoya a {arg.fighter_name}
            </span>
            <span className="text-xs text-gray-600 ml-auto">
              {arg.time_ago}
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{arg.text}</p>
          {arg.edited && (
            <span className="text-xs text-gray-600 mt-1 block">✏️ editado</span>
          )}
        </div>

        {/* Votar */}
        <button
          onClick={() => !isOwn && onVote(arg.id)}
          disabled={isOwn || isVoting}
          className={`flex flex-col items-center gap-0.5 flex-shrink-0 disabled:opacity-30 transition-colors ${
            arg.user_voted
              ? "text-[#e63946]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className="text-sm">{arg.user_voted ? "❤️" : "🤍"}</span>
          <span className="text-xs font-medium">{arg.vote_count}</span>
        </button>
      </div>

      {/* Respuestas recursivas */}
      {arg.replies && arg.replies.length > 0 && (
        <div className="ml-12 flex flex-col gap-2 border-l border-[#2a2a2a] pl-3">
          {arg.replies.map((reply) => (
            <ArgumentReplyItem
              key={reply.id}
              reply={reply}
              onReply={handleReply}
              currentUsername={currentUsername}
              level={0}
              maxLevel={3}
            />
          ))}
        </div>
      )}

      {/* Responder al comentario principal */}
      {!isOwn && currentUsername && (
        <div className="ml-12">
          {!showReply ? (
            <button
              onClick={() => setShowReply(true)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
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
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#e63946]"
                autoFocus
              />
              <button
                onClick={() => {
                  if (replyText.trim()) {
                    handleReply(arg.id, replyText.trim());
                    setReplyText("");
                    setShowReply(false);
                  }
                }}
                className="text-xs bg-[#e63946] hover:bg-[#c1121f] text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                ↩
              </button>
              <button
                onClick={() => setShowReply(false)}
                className="text-xs text-gray-600 hover:text-gray-400"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
