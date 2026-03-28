"use client";

import { useRouter } from "next/navigation";

export default function EditionTabs({
  selectedEdition,
}: {
  selectedEdition: number;
}) {
  const router = useRouter();

  const handleChange = (num: number) => {
    router.push(`/stats?edition=${num}`);
  };

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button
          key={num}
          onClick={() => handleChange(num)}
          className={`relative flex-shrink-0 px-5 py-2.5 rounded-lg font-bebas text-lg tracking-wider transition-all duration-150 overflow-hidden ${
            selectedEdition === num
              ? "bg-[#e63946] text-white"
              : "bg-[#0d0d0d] text-gray-500 hover:text-white border border-white/5 hover:border-white/10"
          }`}
        >
          {selectedEdition === num && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          )}

          <span className="relative">
            Velada {num}
            {num === 6 && <span className="ml-1 text-sm">🔥</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
