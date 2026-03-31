"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Prediction } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { PosterCard } from "./PosterCard";
import { ShareButtons } from "./ShareButtons";
import { TwitchLoginButton } from "@/components/ui/TwitchLoginButton";

export function MiCartelContent() {
  const { user } = useAuthStore();

  const { data: predictions, isLoading } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: () => api.get<Prediction[]>("/predictions/"),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="font-bebas text-5xl text-white mb-4">
          MI <span className="text-[#e63946]">CARTEL</span>
        </h1>
        <p className="text-gray-400 mb-6">
          Inicia sesión para generar tu cartel personalizado
        </p>
        <TwitchLoginButton className="inline-flex items-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-3 rounded transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          Entrar con Twitch
        </TwitchLoginButton>
      </div>
    );
  }

  const predList = Array.isArray(predictions) ? predictions : [];

  return (
    <div className="page-container">
      <div className="mb-10 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          MI <span className="text-[#e63946]">CARTEL</span>
        </h1>
        <p className="text-gray-400">
          Tu cartel personalizado listo para compartir
        </p>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-20">
          Generando tu cartel...
        </div>
      ) : predList.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="font-bebas text-2xl text-white mb-2">
            Aún no tienes predicciones
          </h3>
          <p className="text-gray-500 mb-6">
            Haz tus predicciones primero para generar tu cartel
          </p>
          <Link
            href="/predicciones"
            className="inline-block bg-[#e63946] hover:bg-[#c1121f] text-white font-medium px-8 py-3 rounded transition-colors"
          >
            Hacer Predicciones →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <PosterCard
            predictions={predList}
            username={user.twitch_username || "usuario"}
          />
          <ShareButtons
            username={user.twitch_username}
            shareUrl={`https://laveladazone.com/mi-cartel/${user.twitch_username}`}
          />
          <p className="text-gray-600 text-xs text-center">
            ¿Aún te faltan predicciones?{" "}
            <Link
              href="/predicciones"
              className="text-[#e63946] hover:underline"
            >
              Completar predicciones →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
