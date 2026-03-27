"use client";

import { useState } from "react";
import { ArgumentReply } from "../types";

export function ArgumentReplyItem({
  reply,
  argumentId, // 👈 nuevo: id del argumento raíz
  onReply,
  currentUsername,
  level = 0,
  maxLevel = 2,
}: {
  reply: ArgumentReply;
  argumentId: number; // 👈 nuevo
  onReply: (argumentId: number, text: string, parentReplyId?: number) => void; // 👈
  currentUsername?: string;
  level?: number;
  maxLevel?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isOwn = reply.username === currentUsername;
  const canReply = !isOwn && currentUsername && level < maxLevel;
  const initials = reply.username?.slice(0, 2).toUpperCase() ?? "??";

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(argumentId, replyText.trim(), reply.id); // 👈 pasa argumentId y reply.id como parent
      setReplyText("");
      setShowReply(false);
    }
  };

  return (
    <div className="flex gap-2.5">
      {reply.avatar ? (
        <img
          src={reply.avatar}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
          alt=""
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[10px] font-bold text-gray-400 flex-shrink-0 mt-0.5">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-[#111] rounded-2xl rounded-tl-none px-3 py-2 inline-block w-full">
          <span className="text-xs font-bold text-white">
            {reply.username}{" "}
          </span>
          <span className="text-[13px] text-gray-300 leading-relaxed">
            {reply.text}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 pl-1">
          {canReply && (
            <button
              onClick={() => setShowReply((v) => !v)}
              className="text-[11px] font-semibold text-gray-500 hover:text-[#9146FF] transition-colors"
            >
              💬 Responder
            </button>
          )}
          <span className="text-[10px] text-gray-600">{reply.time_ago}</span>
        </div>

        {showReply && currentUsername && (
          <div className="mt-2 flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e63946] to-[#9146FF] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
              {currentUsername.slice(0, 2).toUpperCase()}
            </div>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value.slice(0, 280))}
              placeholder={`Responder a ${reply.username}...`}
              className="flex-1 bg-[#161616] border border-[#222] rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#9146FF]/40 transition-colors"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitReply();
              }}
            />
            <button
              onClick={handleSubmitReply}
              className="w-7 h-7 bg-[#9146FF] hover:bg-[#7a3fd4] rounded-full flex items-center justify-center text-xs transition-colors flex-shrink-0"
            >
              ↩
            </button>
          </div>
        )}

        {reply.replies && reply.replies.length > 0 && level < maxLevel && (
          <div className="mt-2 pl-2 border-l-2 border-[#1e1e1e] flex flex-col gap-2">
            {reply.replies.map((child) => (
              <ArgumentReplyItem
                key={child.id}
                reply={child}
                argumentId={argumentId} // 👈 propaga el mismo argumentId raíz
                onReply={onReply}
                currentUsername={currentUsername}
                level={level + 1}
                maxLevel={maxLevel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
