"use client";

import { useState } from "react";
import Link from "next/link";
import { ArgumentReplyItem } from "./ArgumentReplyItem";
import { Argument } from "../types";

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

  return (
    <div className="bg-[#0f0f0f] rounded-lg p-3">
      <div className="flex items-start gap-2">
        {/* Avatar con link */}
        <Link
          href={`/perfil/${arg.username}`}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          {arg.avatar ? (
            <img src={arg.avatar} className="w-6 h-6 rounded-full" alt="" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#2a2a2a]" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            {/* Username con link */}
            <Link
              href={`/perfil/${arg.username}`}
              className="text-xs text-gray-300 font-medium hover:text-white transition-colors"
            >
              {arg.username}
            </Link>
            <span className="text-xs">{arg.fighter_flag}</span>
            <span className="text-[10px] text-gray-600">
              apoya a {arg.fighter_name}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{arg.text}</p>
          {arg.edited && (
            <span className="text-xs text-gray-600 mt-0.5 block">
              ✏️ editado
            </span>
          )}
        </div>

        {/* Botón votar */}
        <button
          onClick={() => !isOwn && onVote(arg.id)}
          disabled={isOwn || isVoting}
          className={`flex flex-col items-center gap-0.5 flex-shrink-0 disabled:opacity-30 transition-colors ${
            arg.user_voted
              ? "text-[#e63946]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className="text-xs">{arg.user_voted ? "❤️" : "👍"}</span>
          <span className="text-[10px]">{arg.vote_count}</span>
        </button>
      </div>

      {/* Respuestas existentes */}
      {arg.replies.length > 0 && (
        <div className="mt-2 ml-8 flex flex-col gap-1.5">
          {arg.replies.map((reply) => (
            <ArgumentReplyItem key={reply.id} reply={reply} />
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
                    onReply(arg.id, replyText.trim());
                    setReplyText("");
                    setShowReply(false);
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
