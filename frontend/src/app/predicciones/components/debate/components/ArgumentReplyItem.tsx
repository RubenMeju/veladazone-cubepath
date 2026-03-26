"use client";

import { ArgumentReply } from "../types";

export function ArgumentReplyItem({ reply }: { reply: ArgumentReply }) {
  return (
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
    </div>
  );
}
