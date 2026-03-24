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
   <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50 mx-2 w-full max-w-md sm:max-w-lg md:max-w-xl">
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 transition-all duration-500 ease-out">
    
    {/* Icono */}
    <div className="flex-shrink-0">
      <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
    </div>

    {/* Texto */}
    <div className="flex-1">
      <h3 className="font-bold text-base sm:text-lg md:text-xl">
        Agrega esta app a tu pantalla de inicio
      </h3>
      <p className="text-sm sm:text-base opacity-90 mt-1">
        Rápido acceso, incluso offline y mejor experiencia móvil.
      </p>
    </div>

    {/* Botones */}
    <div className="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-2">
      <button
        onClick={handleInstall}
        className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Instalar
      </button>
      <button
        onClick={handleDismiss}
        className="text-white text-xl hover:text-gray-200 transition self-end sm:self-auto"
        aria-label="Cerrar banner de instalación"
      >
        ✕
      </button>
    </div>
  </div>
</div>
  );
}
