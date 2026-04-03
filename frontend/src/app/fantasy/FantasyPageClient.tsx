"use client";

import dynamic from "next/dynamic";

const FantasyContent = dynamic(
  () => import("./components/FantasyContent").then((m) => m.FantasyContent),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
            FANTASY <span className="text-[#e63946]">LEAGUE</span>
          </h1>
        </div>
      </div>
    ),
  },
);

export function FantasyPageClient() {
  return (
    <div className="min-h-[80vh]">
      <FantasyContent />
    </div>
  );
}