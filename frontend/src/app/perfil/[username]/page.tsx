"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FantasyLeague } from "@/types";

interface ProfileData {
  username: string;
  display_name: string;
  avatar: string | null;
  profile_views: number;
  stats: {
    total: number;
    correct: number;
    accuracy: number;
    badge: {
      label: string;
      color: string;
      emoji: string;
    };
  };
  betrayal_count: number;
  predictions: {
    fight: string;
    pick: string;
    pick_flag: string;
    is_correct: boolean | null;
  }[];
  arguments: {
    fight: string;
    fighter: string;
    text: string;
    votes: number;
  }[];
  leagues_created: FantasyLeague[];
  leagues_joined: FantasyLeague[];
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => api.get<ProfileData>(`/users/profile/${username}/`),
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-[#0d0d0d] border border-white/5 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-40 bg-[#0d0d0d] rounded animate-pulse" />
              <div className="h-4 w-24 bg-[#0d0d0d] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🥊</div>
          <h2 className="font-bebas text-3xl text-white mb-2">
            Usuario no encontrado
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Este luchador no existe en VeladaZone
          </p>
          <Link href="/" className="text-[#e63946] hover:underline text-sm">
            Volver al inicio →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header del perfil */}
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              {data.avatar ? (
                <img
                  src={data.avatar}
                  alt={data.display_name}
                  className="w-20 h-20 rounded-full border-2 border-white/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-white/10 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-bebas text-3xl text-white tracking-wider">
                    {data.display_name}
                  </h1>
                  {/* Badge */}
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: data.stats.badge.color,
                      backgroundColor: `${data.stats.badge.color}20`,
                      border: `1px solid ${data.stats.badge.color}30`,
                    }}
                  >
                    {data.stats.badge.emoji} {data.stats.badge.label}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">@{data.username}</p>
              </div>
            </div>

            {/* Profile views */}
            <div className="text-right flex-shrink-0">
              <div className="font-bebas text-2xl text-white">
                {data.profile_views}
              </div>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase">
                visitas
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Predicciones",
              value: data.stats.total,
              color: "text-white",
            },
            {
              label: "Correctas",
              value: data.stats.correct,
              color: "text-green-400",
            },
            {
              label: "Precisión",
              value: `${data.stats.accuracy}%`,
              color: "text-[#f4a261]",
            },
            {
              label: "Traiciones",
              value: data.betrayal_count,
              color: "text-[#e63946]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0d0d0d] border border-white/5 rounded-xl p-4 text-center"
            >
              <div
                className={`font-bebas text-3xl ${stat.color} leading-tight`}
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Predicciones */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
            <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
              🎯 Predicciones
            </h2>
            {data.predictions.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">
                Sin predicciones aún
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.predictions.map((pred, i) => (
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

          {/* Argumentos del debate */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
            <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
              💬 Comentarios
            </h2>
            {data.arguments.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">
                Sin comentarios aún
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {data.arguments.map((arg, i) => (
                  <div
                    key={i}
                    className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-600">
                        {arg.fight}
                      </span>
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

          {/* Ligas del usuario */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 mt-6">
            <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
              🏆 Ligas
            </h2>

            {data.leagues_created.length === 0 &&
            data.leagues_joined.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">
                No estás en ninguna liga todavía
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Ligas creadas */}
                {data.leagues_created.length > 0 && (
                  <>
                    <h3 className="text-gray-400 text-xs uppercase mb-1">
                      Creadas
                    </h3>
                    {data.leagues_created.map((league) => (
                      <div
                        key={league.id}
                        className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-white text-sm">
                          {league.name}
                        </span>
                        {league.is_private && (
                          <span className="text-xs text-gray-500">Privada</span>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Ligas unidas */}
                {data.leagues_joined.length > 0 && (
                  <>
                    <h3 className="text-gray-400 text-xs uppercase mt-3 mb-1">
                      Unidas
                    </h3>
                    {data.leagues_joined.map((league) => (
                      <div
                        key={league.id}
                        className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-white text-sm">
                          {league.name}
                        </span>
                        {league.is_private && (
                          <span className="text-xs text-gray-500">Privada</span>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compartir perfil */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const url = window.location.href;
              const text = `🥊 Mira mis predicciones para La Velada del Año 6 en VeladaZone #VeladaDelAño6`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
              );
            }}
            className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-white/5 hover:border-white/10 text-gray-400 hover:text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            𝕏 Compartir mi perfil
          </button>
        </div>
      </div>
    </div>
  );
}
