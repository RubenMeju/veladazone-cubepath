import { ProfileData } from "../types";

interface Props {
  args: ProfileData["arguments"];
}

export function ProfileArguments({ args }: Props) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
      <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
        💬 Comentarios
      </h2>

      {args.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">
          Sin comentarios aún
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {args.map((arg, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-600">{arg.fight}</span>
                <span className="text-[10px] text-[#f4a261]">
                  👍 {arg.votes}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {arg.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
