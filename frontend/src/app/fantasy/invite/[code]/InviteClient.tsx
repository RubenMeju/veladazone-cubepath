"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { TwitchLoginButton } from "@/components/ui/TwitchLoginButton";

interface League {
  id: number;
  name: string;
  member_count: number;
  is_private: boolean;
}

interface Props {
  league: League | null;
  inviteCode: string;
}

export default function InviteClient({ league, inviteCode }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [joined, setJoined] = useState(false);

  const joinMutation = useMutation({
    mutationFn: () =>
      api.post<{ id: number }>("/fantasy/leagues/join/", {
        invite_code: inviteCode,
      }),
    onSuccess: (data) => {
      setJoined(true);
      // Redirige a fantasy y selecciona la liga automáticamente
      setTimeout(() => router.push(`/fantasy?league=${data.id}`), 1500);
    },
  });

  if (!league) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="font-bebas text-3xl text-white mb-2">
            Invitación no válida
          </h1>
          <p className="text-gray-400 mb-6">
            Este código no existe o ha expirado
          </p>
          <button
            onClick={() => router.push("/fantasy")}
            className="bg-[#e63946] text-white px-6 py-2 rounded-lg"
          >
            Ir a Fantasy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="md:min-w-lg mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>

        <h1 className="font-bebas text-4xl text-white tracking-wider mb-1">
          {league.name}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {league.member_count} participantes · Fantasy La Velada del Año 6
        </p>

        {joined ? (
          <div className="text-green-400 font-medium">
            ✅ ¡Te has unido! Redirigiendo...
          </div>
        ) : !user ? (
          // No autenticado — login con Twitch, vuelve aquí después
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 text-sm">
              Inicia sesión con Twitch para unirte
            </p>
            <TwitchLoginButton
              //   redirectAfterLogin={`/fantasy/invite/${inviteCode}`}
              className="inline-flex items-center justify-center gap-2 bg-[#9146FF] hover:bg-[#7c3bdb] text-white font-medium px-6 py-3 rounded-lg transition-colors w-full"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Entrar con Twitch y unirse
            </TwitchLoginButton>
          </div>
        ) : (
          // Autenticado — unirse directo
          <div className="flex flex-col gap-3">
            <button
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending}
              className="bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 text-white font-bebas text-xl tracking-wider py-3 rounded-xl transition-colors w-full"
            >
              {joinMutation.isPending ? "Uniéndose..." : "UNIRSE A LA LIGA"}
            </button>
            <button
              onClick={() => router.push("/fantasy")}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Ver mis ligas sin unirme
            </button>
            {joinMutation.isError && (
              <p className="text-[#e63946] text-xs">
                Error al unirse. ¿Ya eres miembro?
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
