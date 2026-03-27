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

  const initials = arg.username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="flex gap-3 py-2 px-1 rounded-xl hover:bg-white/[0.02] transition-colors">
      {/* Avatar */}
      <Link href={`/perfil/${arg.username}`} className="flex-shrink-0 mt-0.5">
        {arg.avatar ? (
          <img
            src={arg.avatar}
            className="w-9 h-9 rounded-full object-cover"
            alt=""
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e63946] to-[#9146FF] flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        {/* Burbuja */}
        <div className="bg-[#161616] rounded-2xl rounded-tl-none px-4 py-3 inline-block w-full">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Link
              href={`/perfil/${arg.username}`}
              className="text-sm font-bold text-white hover:underline"
            >
              {arg.username}
            </Link>
            {arg.fighter_flag && (
              <span className="text-sm">{arg.fighter_flag}</span>
            )}
            {arg.fighter_name && (
              <span className="text-[11px] font-medium text-[#e63946] bg-[#e63946]/10 px-2 py-0.5 rounded-full">
                {arg.fighter_name}
              </span>
            )}
          </div>
          <p className="text-[14px] text-gray-200 leading-relaxed">{arg.text}</p>
          {arg.edited && (
            <span className="text-[11px] text-gray-600 mt-1 block">✏️ editado</span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 mt-1.5 pl-2">
          <button
            onClick={() => !isOwn && onVote(arg.id)}
            disabled={isOwn || isVoting}
            className={`text-xs font-semibold disabled:opacity-30 transition-colors active:scale-90 ${
              arg.user_voted
                ? "text-[#e63946]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {arg.user_voted ? "❤️" : "🤍"} {arg.vote_count}
          </button>

          {!isOwn && currentUsername && (
            <button
              onClick={() => setShowReply((v) => !v)}
              className="text-xs font-semibold text-gray-500 hover:text-[#9146FF] transition-colors"
            >
              💬 Responder
            </button>
          )}

          <span className="text-[11px] text-gray-600 ml-auto">{arg.time_ago}</span>
        </div>

        {/* Replies */}
        {arg.replies && arg.replies.length > 0 && (
          <div className="mt-3 pl-2 border-l-2 border-[#1e1e1e] flex flex-col gap-3">
            {arg.replies.map((reply) => (
              <ArgumentReplyItem
                key={reply.id}
                reply={reply}
                onReply={onReply}
                currentUsername={currentUsername}
                level={0}
                maxLevel={3}
              />
            ))}
          </div>
        )}

        {/* Reply input */}
        {showReply && currentUsername && (
          <div className="mt-3 flex gap-2 items-center pl-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e63946] to-[#9146FF] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {currentUsername.slice(0, 2).toUpperCase()}
            </div>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value.slice(0, 280))}
              placeholder={`Responder a ${arg.username}...`}
              className="flex-1 bg-[#161616] border border-[#222] rounded-full px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9146FF]/40 transition-colors"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && replyText.trim()) {
                  onReply(arg.id, replyText.trim());
                  setReplyText("");
                  setShowReply(false);
                }
              }}
            />
            <button
              onClick={() => {
                if (replyText.trim()) {
                  onReply(arg.id, replyText.trim());
                  setReplyText("");
                  setShowReply(false);
                }
              }}
              className="w-8 h-8 bg-[#9146FF] hover:bg-[#7a3fd4] rounded-full flex items-center justify-center text-sm transition-colors flex-shrink-0"
            >
              ↩
            </button>
          </div>
        )}
      </div>
    </div>
  );
}