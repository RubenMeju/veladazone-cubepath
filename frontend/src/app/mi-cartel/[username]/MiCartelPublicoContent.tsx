// app/mi-cartel/[username]/components/MiCartelPublicoContent.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import { PosterCard } from "@/app/mi-cartel/components/PosterCard";
import { ShareButtons } from "@/app/mi-cartel/components/ShareButtons";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function MiCartelPublicoContent({ username }: { username: string }) {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["cartel-publico", username],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/predictions/cartel/${username}/`,
        // Sin credentials, sin x-dev-user, sin auth — es público
      );
      if (!res.ok) return [];
      return res.json();
    },
  });

  const predList = Array.isArray(predictions) ? predictions : [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          CARTEL DE <span className="text-[#e63946]">@{username}</span>
        </h1>
        <p className="text-gray-500 mt-4">Cargando predicciones...</p>
      </div>
    );
  }

  if (predList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-bebas text-5xl text-white mb-4">
          CARTEL DE <span className="text-[#e63946]">@{username}</span>
        </h1>
        <p className="text-gray-400">Este usuario aún no tiene predicciones.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-10 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          CARTEL DE{" "}
          <span className="text-[#e63946]">@{username.toUpperCase()}</span>
        </h1>
        <p className="text-gray-400">
          Sus predicciones para La Velada del Año 6
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <PosterCard predictions={predList} username={username} />
        <ShareButtons
          username={username}
          shareUrl={`https://laveladazone.com/mi-cartel/${username}`}
        />
      </div>
    </div>
  );
}
