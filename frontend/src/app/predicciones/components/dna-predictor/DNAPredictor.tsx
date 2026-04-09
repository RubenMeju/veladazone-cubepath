"use client";

import Link from "next/link";
import { twitchLoginUrl } from "@/lib/api";
import { useDNA } from "./hooks/useDNA";
import { DNACard } from "./components/DNACard";
import { DNASkeleton } from "./components/DNASkeleton";
import { DNAResult } from "./components/DNAResult";

export function DNAPredictor() {
  const { user, reveal, title, analysis, viewState, data, refetch } = useDNA();

  const handleShare = () => {
    if (!data || !user) return;

    const url = `https://laveladazone.com/perfil/${user.twitch_username}`;
    const text = `🧬 Mi ADN de predictor para La Velada del Año 6: ${title}. "${analysis.slice(
      0,
      100,
    )}..." #VeladaZone #VeladaDelAño6`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,
    );
  };

  return (
    <DNACard>
      {viewState === "guest" && (
        <Link
          href={twitchLoginUrl}
          className="block w-full bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-bebas text-lg tracking-widest py-3 rounded-xl text-center"
        >
          ENTRA CON TWITCH PARA REVELAR
        </Link>
      )}

      {viewState === "idle" && (
        <button
          onClick={reveal}
          className="w-full bg-[#f4a261] hover:bg-[#e8943a] text-black font-bebas text-lg tracking-widest py-3 rounded-xl"
        >
          REVELAR MI ADN
        </button>
      )}

      {viewState === "loading" && <DNASkeleton />}

      {viewState === "success" && data && (
        <DNAResult
          data={data}
          title={title}
          analysis={analysis}
          username={user!.twitch_username}
          onShare={handleShare}
          onRefresh={refetch}
        />
      )}

      {viewState === "empty" && (
        <p className="text-xs text-gray-600 text-center py-2">
          Haz al menos una predicción para descubrir tu ADN
        </p>
      )}
    </DNACard>
  );
}
