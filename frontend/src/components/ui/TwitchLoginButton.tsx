"use client";

import { twitchLoginUrl } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

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

    const channel = new BroadcastChannel("auth");

    channel.onmessage = (e) => {
      console.log("📡 BroadcastChannel received:", e.data);
      channel.close();
      clearInterval(timer);
      popup?.close();
      if (e.data.type === "auth_complete") {
        console.log("✅ Auth complete, setting user in Zustand:", e.data.user);
        // Seteamos el usuario directamente desde el mensaje
        // sin necesitar hacer fetch a /users/me/ de nuevo
        useAuthStore.getState().setUser(e.data.user);
        // Sin reload — el estado de Zustand ya tiene el usuario
      }
    };

    // Safety net: usuario cierra el popup manualmente sin completar login
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        channel.close();
      }
    }, 500);
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
