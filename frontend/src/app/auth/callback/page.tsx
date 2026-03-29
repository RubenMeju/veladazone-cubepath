"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";
import Link from "next/link";

type Status = "loading" | "pwa_success" | "error";

function CallbackHandler() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPWA =
      urlParams.get("from_pwa") === "true" ||
      sessionStorage.getItem("from_pwa") === "true";

    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken && urlParams.get("from_pwa") === "true") {
      document.cookie = `access_token=${accessToken}; path=/; max-age=${86400 * 7}; secure; samesite=None`;
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${86400 * 30}; secure; samesite=None`;
    }

    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        sessionStorage.removeItem("from_pwa");

        if (isPWA) {
          setStatus("pwa_success");
        } else {
          router.replace("/");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("from_pwa");
        setStatus("error");
      });
  }, [setUser, router]);

  if (status === "pwa_success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">✅</div>
          <div className="font-bebas text-3xl text-white mb-2 tracking-wider">
            ¡Login completado!
          </div>
          <div className="text-gray-400 text-sm mb-6">
            Vuelve a la app VeladaZone en tu pantalla de inicio para continuar.
          </div>
          <div className="text-6xl">🥊</div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">❌</div>
          <div className="font-bebas text-3xl text-white mb-2 tracking-wider">
            Error al iniciar sesión
          </div>
          <div className="text-gray-400 text-sm mb-6">
            Algo salió mal con Twitch. Inténtalo de nuevo.
          </div>
          <Link href="/" className="text-[#e63946] underline text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-bebas text-3xl text-white mb-2">
          Iniciando sesión...
        </div>
        <div className="text-gray-500 text-sm">Conectando con Twitch</div>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#e63946] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
