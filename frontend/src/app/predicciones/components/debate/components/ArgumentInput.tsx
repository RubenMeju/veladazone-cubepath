"use client";

export function ArgumentInput({
  text,
  setText,
  fighterName,
  onSubmit,
  isPending,
}: {
  text: string;
  setText: (text: string) => void;
  fighterName: string;
  onSubmit: () => void;
  isPending: boolean;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden mt-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 600))}
        placeholder={`¿Por qué crees que gana ${fighterName}? Defiende tu predicción...`}
        rows={3}
        className="w-full bg-transparent text-[14px] text-gray-200 leading-relaxed resize-none min-h-[90px] focus:outline-none placeholder-gray-600 px-4 pt-4 pb-2"
      />
      <div className="flex justify-between items-center px-4 pb-3 pt-1 border-t border-[#1a1a1a]">
        <span
          className={`text-xs ${text.length > 500 ? "text-[#e63946]" : "text-gray-600"}`}
        >
          {text.length} / 600
        </span>
        <button
          onClick={onSubmit}
          disabled={!text.trim() || isPending}
          className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-40 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
        >
          {isPending ? "Publicando..." : "Publicar 🔥"}
        </button>
      </div>
    </div>
  );
}
