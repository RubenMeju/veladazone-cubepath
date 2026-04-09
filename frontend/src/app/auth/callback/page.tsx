"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";
import Link from "next/link";

type Status = "loading" | "error";

function CallbackHandler() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        router.replace("/");
      })
      .catch(() => {
        setStatus("error");
      });
  }, [setUser, router]);

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
