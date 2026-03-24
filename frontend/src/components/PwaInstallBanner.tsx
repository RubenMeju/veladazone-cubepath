"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      const installed = localStorage.getItem("pwaInstalled");
      const dismissed = localStorage.getItem("pwaBannerDismissed");
      if (!installed && !dismissed) setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") localStorage.setItem("pwaInstalled", "true");
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwaBannerDismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl mx-auto animate-slide-up-fade">
      <div className="relative overflow-hidden bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-2xl p-5 flex items-center gap-5">
        {/* Contenedor del Icono */}
        <div className="shrink-0 bg-linear-to-br from-[#e63946] to-[#b91c1c] p-3 rounded-xl shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-white leading-tight">
            Instala nuestra App
          </h3>
          <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">
            Acceso instantáneo y mejor rendimiento offline.
          </p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleInstall}
            className="bg-white text-black hover:bg-gray-200 active:scale-95 font-bold px-5 py-2 rounded-xl text-sm transition-all duration-200"
          >
            Instalar
          </button>

          <button
            onClick={handleDismiss}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
