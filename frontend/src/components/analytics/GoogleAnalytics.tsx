"use client";

/**
 * GoogleAnalytics.tsx
 * ─────────────────────────────────────────────────────────────────
 * Carga Google Analytics ÚNICAMENTE si el usuario ha aceptado
 * cookies analíticas. Cumple RGPD / LOPD-GDD.
 *
 * Estrategia:
 *  - Si consent.analytics === false → NO se inyectan scripts
 *  - En cuanto cambia a true → se inyectan dinámicamente
 *  - anonymize_ip: true por defecto (buena práctica adicional)
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/components/providers/ConsentProvider";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  const { consent } = useConsent();

  // Cuando el usuario revoca el consentimiento, desactiva GA en runtime
  useEffect(() => {
    if (!consent.analytics && typeof window !== "undefined" && GA_ID) {
      // Desactiva el tracking sin recargar la página
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] =
        true;
    }
  }, [consent.analytics]);

  // No montar scripts si no hay consentimiento o no hay GA_ID
  if (!consent.analytics || !GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}
