"use client";

import { Suspense, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";

function CallbackHandler() {
  const { setUser } = useAuthStore();
  const [fromPWA] = useState(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    return (
      sessionStorage.getItem("from_pwa") === "true" ||
      urlParams.get("from_pwa") === "true"
    );
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pwaFromUrl = urlParams.get("from_pwa") === "true";

    // PWA móvil — tokens en URL
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken && pwaFromUrl) {
      document.cookie = `access_token=${accessToken}; path=/; max-age=${86400 * 7}; secure; samesite=None`;
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${86400 * 30}; secure; samesite=None`;
    }

    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        sessionStorage.removeItem("from_pwa");
        // No es PWA → es popup, simplemente cerrarse
        // La ventana principal detecta el login via polling a /users/me/
        if (!fromPWA) {
          setTimeout(() => window.close(), 300);
        }
      })
      .catch(() => {
        sessionStorage.removeItem("from_pwa");
        if (!fromPWA) {
          setTimeout(() => window.close(), 300);
        }
      });
  }, [fromPWA, setUser]);

  if (fromPWA) {
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
