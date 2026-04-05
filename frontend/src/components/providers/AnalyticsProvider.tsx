"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function AnalyticsProvider() {
  const pathname = usePathname();

  // AnalyticsProvider.tsx
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id) return;

    const sendPageView = () => {
      window.gtag?.("config", id, { page_path: pathname });
    };

    // Si gtag ya existe, envía inmediatamente; si no, espera a que cargue
    if (window.gtag) {
      sendPageView();
    } else {
      window.addEventListener("gtag_loaded", sendPageView, { once: true });
    }
  }, [pathname]);

  return null;
}
