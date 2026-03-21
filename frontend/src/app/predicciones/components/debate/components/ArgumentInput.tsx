"use client";

import { Argument } from "../types";

export function ArgumentInput({
  userArgument,
  text,
  setText,
  fighterName,
  onSubmit,
  isPending,
}: {
  userArgument?: Argument;
  text: string;
  setText: (text: string) => void;
  fighterName: string;
  onSubmit: () => void;
  isPending: boolean;
}) {
  const canEdit =
    !userArgument || (!userArgument.edited && userArgument.vote_count < 3);

  return (
    <div className="flex flex-col gap-2">
      {/* Mensajes de estado */}
      {userArgument && canEdit && (
        <div className="text-[10px] text-gray-600 flex items-center gap-1">
          <span>✏️</span>
          <span>Puedes editar tu argumento una vez</span>
        </div>
      )}
      {userArgument?.edited && (
        <div className="text-[10px] text-[#e63946] flex items-center gap-1">
          <span>🔒</span>
          <span>Ya editaste tu argumento — no puedes volver a editarlo</span>
        </div>
      )}
      {userArgument && userArgument.vote_count >= 3 && !userArgument.edited && (
        <div className="text-[10px] text-[#f4a261] flex items-center gap-1">
          <span>🏆</span>
          <span>
            Tu argumento tiene {userArgument.vote_count} votos — ya no puedes
            editarlo
          </span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          placeholder={
            userArgument
              ? `Tu argumento: "${userArgument.text.slice(0, 40)}..."`
              : `¿Por qué ganará ${fighterName}?`
          }
          disabled={!canEdit}
          className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#e63946] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onSubmit}
          disabled={!text.trim() || isPending || !canEdit}
          className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-2 rounded-lg transition-colors"
        >
          {isPending ? "..." : userArgument ? "Editar" : "Enviar"}
        </button>
      </div>

      <div className="flex justify-between text-[10px] text-gray-600">
        <span>Un argumento por combate</span>
        <span>{text.length}/280</span>
      </div>
    </div>
  );
}
