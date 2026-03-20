"use client";

export function PredictionProgress({ total }: { total: number }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Tu progreso</span>
        <span className="text-sm text-white font-medium">
          {total}/10 predicciones
        </span>
      </div>
      <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#e63946] rounded-full transition-all"
          style={{ width: `${(total / 10) * 100}%` }}
        />
      </div>
      {total === 10 && (
        <div className="mt-3 text-center">
          <a
            href="/mi-cartel"
            className="inline-block bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-medium px-6 py-2 rounded transition-colors"
          >
            🃏 ¡Genera tu cartel! →
          </a>
        </div>
      )}
    </div>
  );
}
