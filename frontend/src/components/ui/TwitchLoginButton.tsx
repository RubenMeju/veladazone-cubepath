"use client";

import { twitchLoginUrl } from "@/lib/api";

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
    }

    window.location.href = isPWA
      ? `${twitchLoginUrl}?from_pwa=true`
      : twitchLoginUrl;
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
