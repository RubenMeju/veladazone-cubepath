"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [fromPWA, setFromPWA] = useState(false);
  const fromPWARef = useRef(false);

  useEffect(() => {
    fromPWARef.current = sessionStorage.getItem("from_pwa") === "true";

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const pwaParam = params.get("from_pwa");

    if (accessToken && refreshToken && pwaParam) {
      document.cookie = `access_token=${accessToken}; path=/; max-age=${86400 * 7}; secure; samesite=None`;
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${86400 * 30}; secure; samesite=None`;
      fromPWARef.current = true;
      setTimeout(() => setFromPWA(true), 0);
    }

    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        sessionStorage.removeItem("from_pwa");

        if (fromPWARef.current) {
          // PWA móvil — el estado 'fromPWA' ya muestra el mensaje en el render
        } else {
          // 1. Señalizar a la ventana padre (si existe)
          localStorage.setItem("auth_complete", Date.now().toString());

          // 2. Intentar cerrar la ventana (para casos de Popup)
          window.close();

          // 3. Fallback: Si no se cerró, redirigir después de 300ms
          setTimeout(() => {
            router.push("/predicciones");
          }, 300);
        }
      })
      .catch(() => {
        sessionStorage.removeItem("from_pwa");
        localStorage.setItem("auth_failed", Date.now().toString());
        window.close();
        setTimeout(() => router.push("/?error=auth_failed"), 300);
      });
  }, []);

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
