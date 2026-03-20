"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const access = searchParams.get("access");
    const refresh = searchParams.get("refresh");
    const error = searchParams.get("error");

    if (error || !access || !refresh) {
      router.push("/?error=auth_failed");
      return;
    }

    setTokens(access, refresh);

    api
      .get<User>("/users/me/")
      .then((user) => {
        setUser(user);
        router.push("/predicciones");
      })
      .catch(() => {
        router.push("/?error=auth_failed");
      });
  }, []);

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
