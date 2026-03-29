"use client";

import { twitchLoginUrl } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
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

    const poll = setInterval(() => {
      const authUser = localStorage.getItem("auth_user");
      const authTs = localStorage.getItem("auth_ts");

      // ✅ Detecta login exitoso
      if (authUser && authTs) {
        const age = Date.now() - parseInt(authTs);
        if (age < 60_000) {
          clearInterval(poll);
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_ts");
          const user = JSON.parse(authUser) as User;
          useAuthStore.getState().setUser(user);
          popup?.close();
        }
        return;
      }

      // ✅ Detecta fallo explícito
      if (localStorage.getItem("auth_failed")) {
        clearInterval(poll);
        localStorage.removeItem("auth_failed");
        popup?.close();
        return;
      }

      // ✅ Popup cerrado: espera 400ms por si localStorage se escribió
      // justo antes del cierre (race condition entre setInterval 500ms y close)
      if (popup?.closed) {
        clearInterval(poll);
        setTimeout(() => {
          const user = localStorage.getItem("auth_user");
          const ts = localStorage.getItem("auth_ts");
          if (user && ts) {
            const age = Date.now() - parseInt(ts);
            if (age < 60_000) {
              useAuthStore.getState().setUser(JSON.parse(user) as User);
            }
          } else {
            window.location.reload();
          }
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_ts");
          localStorage.removeItem("auth_failed");
        }, 400);
      }
    }, 500);

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
