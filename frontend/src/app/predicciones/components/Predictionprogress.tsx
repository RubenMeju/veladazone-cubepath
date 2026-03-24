"use client";

export function PredictionProgress({ total }: { total: number }) {
  const pct = (total / 10) * 100;
  const isComplete = total === 10;

  return (
    <div
      className={`relative overflow-hidden rounded-xl mb-6 transition-all duration-300 ${
        isComplete
          ? "bg-[#0d0d0d] border border-[#f4a261]/30"
          : "bg-[#0d0d0d] border border-white/5"
      }`}
    >
      {/* Complete glow */}
      {isComplete && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/40 to-transparent" />
        </>
      )}

      <div className="relative p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 tracking-widest uppercase">
            Tu progreso
          </span>
          <div className="flex items-center gap-2">
            {/* Dots indicator */}
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i < total
                      ? isComplete
                        ? "bg-[#f4a261]"
                        : "bg-[#e63946]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-sm font-bebas tracking-wider ${
                isComplete ? "text-[#f4a261]" : "text-white"
              }`}
            >
              {total}/10
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isComplete
                ? "bg-gradient-to-r from-[#f4a261] to-[#e63946]"
                : "bg-[#e63946]"
            }`}
            style={{ width: `${pct}%` }}
          >
            {/* Shine */}
            <div className="h-full w-full bg-gradient-to-b from-white/20 to-transparent rounded-full" />
          </div>
        </div>

        {/* Complete CTA */}
        {isComplete && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-[#f4a261]/70 tracking-widest uppercase">
              ¡Cartel listo!
            </span>
            <a
              href="/mi-cartel"
              className="inline-flex items-center gap-2 bg-[#f4a261] hover:bg-[#e8943a] text-black font-bebas text-sm tracking-widest px-5 py-1.5 rounded transition-colors"
            >
              🃏 GENERA TU CARTEL →
            </a>
          </div>
        )}

        {/* Incomplete message */}
        {!isComplete && total > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Te faltan{" "}
            <span className="text-gray-400">{10 - total} predicciones</span>{" "}
            para completar tu cartel
          </p>
        )}
      </div>
    </div>
  );
}
