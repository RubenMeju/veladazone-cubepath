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
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 600))}
        placeholder={`¿Por qué crees que gana ${fighterName}?`}
        rows={3}
        className="w-full bg-transparent text-sm resize-y min-h-[80px] focus:outline-none placeholder-gray-500"
      />

      <div className="flex justify-between items-center mt-3 text-xs">
        <span className="text-gray-600">{text.length}/600</span>
        <button
          onClick={onSubmit}
          disabled={!text.trim() || isPending}
          className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 px-5 py-2 rounded-lg font-medium"
        >
          {isPending ? "Publicando..." : "Publicar argumento"}
        </button>
      </div>
    </div>
  );
}
