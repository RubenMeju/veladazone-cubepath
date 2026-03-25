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
    setFromPWA(fromPWARef.current);

    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        sessionStorage.removeItem("from_pwa");
        if (window.opener) {
          window.close();
        } else if (fromPWARef.current) {
          // muestra mensaje — el state fromPWA ya está seteado
        } else {
          router.push("/predicciones");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("from_pwa");
        if (window.opener) {
          window.close();
        } else {
          router.push("/?error=auth_failed");
        }
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
