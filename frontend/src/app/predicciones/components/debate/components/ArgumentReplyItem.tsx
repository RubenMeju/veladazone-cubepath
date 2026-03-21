"use client";

import { ArgumentReply } from "../types";

export function ArgumentReplyItem({ reply }: { reply: ArgumentReply }) {
  return (
    <div className="flex items-start gap-2">
      {reply.avatar ? (
        <img
          src={reply.avatar}
          className="w-5 h-5 rounded-full flex-shrink-0"
          alt=""
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-[#2a2a2a] flex-shrink-0" />
      )}
      <div>
        <span className="text-[10px] text-gray-400 font-medium mr-1">
          {reply.username}
        </span>
        <span className="text-[10px] text-gray-500">{reply.text}</span>
      </div>
    </div>
  );
}
