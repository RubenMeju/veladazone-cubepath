import { ProfileData } from "../types";

interface Props {
  predictions: ProfileData["predictions"];
}

export function ProfilePredictions({ predictions }: Props) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
      <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
        🎯 Predicciones
      </h2>

      {predictions.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          Sin predicciones aún
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {predictions.map((pred, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-sm text-gray-600 truncate">
                  {pred.fight}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{pred.pick_flag}</span>
                  <span className="text-sm text-white font-medium">
                    {pred.pick}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {pred.is_correct === true && (
                  <span className="text-xs text-green-400 border border-green-400/20 rounded-full px-2 py-0.5">
                    ✓ Correcto
                  </span>
                )}
                {pred.is_correct === false && (
                  <span className="text-xs text-[#e63946] border border-[#e63946]/20 rounded-full px-2 py-0.5">
                    ✗ Fallo
                  </span>
                )}
                {pred.is_correct === null && (
                  <span className="text-xs text-gray-600 border border-white/5 rounded-full px-2 py-0.5">
                    Pendiente
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
