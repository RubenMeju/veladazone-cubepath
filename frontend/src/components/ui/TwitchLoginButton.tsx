"use client";

import { twitchLoginUrl } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { User } from "@/types";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function TwitchLoginButton({ className, children }: Props) {
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();

    const isPWA = window.matchMedia("(display-mode: standalone)").matches;
    if (isPWA) {
      sessionStorage.setItem("from_pwa", "true");
      window.location.href = twitchLoginUrl + "?from_pwa=true";
      return;
    }

    const width = 550;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      twitchLoginUrl,
      "twitch_login",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
    );

    if (!popup) return;

    // Polling: pregunta /users/me/ cada segundo.
    // Django setea las cookies JWT en el dominio compartido durante el OAuth,
    // así que en cuanto el popup completa el login, la ventana principal
    // puede leer las cookies y autenticarse sin reload.
    const poll = setInterval(async () => {
      if (popup.closed) {
        console.log("Popup cerrado por el usuario");
        clearInterval(poll);
        // ✅ Popup cerrado — hacer UN intento final con las cookies recién seteadas
        try {
          console.log(
            "Intentando obtener usuario después de cierre de popup...",
          );
          const user = await api.get<User>("/users/me/");
          if (user) {
            useAuthStore.getState().setUser(user);
          }
        } catch {
          // Login cancelado por el usuario
          console.log("Login cancelado o fallido");
        }
        return;
      }

      try {
        const user = await api.get<User>("/users/me/");
        if (user) {
          clearInterval(poll);
          useAuthStore.getState().setUser(user);
          popup.close();
        }
      } catch {
        // 401 — OAuth aún en curso
      }
    }, 1000);

    // Safety net: máximo 3 minutos de polling
    setTimeout(() => clearInterval(poll), 3 * 60 * 1000);
  };

  return (
    <a href={twitchLoginUrl} onClick={handleLogin} className={className}>
      {children ?? (
        <>
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          <span>Entrar con Twitch</span>
        </>
      )}
    </a>
  );
}
