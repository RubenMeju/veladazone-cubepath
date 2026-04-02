"use client";

import dynamic from "next/dynamic";

// MiCartelContent usa useAuthStore (localStorage) — no puede renderizarse en el servidor
const MiCartelContent = dynamic(
  () => import("./components/MiCartelContent").then((m) => m.MiCartelContent),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          MI <span className="text-[#e63946]">CARTEL</span>
        </h1>
      </div>
    ),
  },
);

export default function MiCartelPage() {
  return (
    <div className="min-h-[80vh]">
      <MiCartelContent />
    </div>
  );
}
