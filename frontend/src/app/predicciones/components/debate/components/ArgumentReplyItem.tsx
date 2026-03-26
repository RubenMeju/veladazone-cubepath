"use client";

import { useState } from "react";
import { ArgumentReply } from "../types";

export function ArgumentReplyItem({
  reply,
  onReply,
  currentUsername,
  level = 0,
  maxLevel = 3,
}: {
  reply: ArgumentReply;
  onReply: (id: number, text: string) => void;
  currentUsername?: string;
  level?: number;
  maxLevel?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isOwn = reply.username === currentUsername;

  return (
    <div
      className="flex flex-col gap-2"
      style={{ marginLeft: level > 0 ? `${level * 1.5}rem` : 0 }}
    >
      <div className="flex items-start gap-2">
        {reply.avatar ? (
          <img
            src={reply.avatar}
            className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
            alt=""
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs text-gray-300 font-semibold">
              {reply.username}
            </span>
            <span className="text-xs text-gray-600">{reply.time_ago}</span>
          </div>
          <span className="text-xs text-gray-400">{reply.text}</span>
        </div>

        {/* Botón de responder disponible para todos los niveles */}
        {!isOwn && currentUsername && level < maxLevel && (
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-gray-600 hover:text-gray-400 ml-2"
          >
            💬
          </button>
        )}
      </div>

      {/* Input para responder */}
      {showReply && currentUsername && (
        <div className="flex gap-2 ml-6">
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
                onReply(reply.id, replyText.trim());
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

      {/* Respuestas recursivas */}
      {reply.replies && reply.replies.length > 0 && level < maxLevel && (
        <div className="flex flex-col gap-2 mt-2">
          {reply.replies.map((r) => (
            <ArgumentReplyItem
              key={r.id}
              reply={r}
              onReply={onReply}
              currentUsername={currentUsername}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
