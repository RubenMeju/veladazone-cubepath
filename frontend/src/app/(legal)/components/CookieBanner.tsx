"use client";

/**
 * CookieBanner.tsx
 * ─────────────────────────────────────────────────────────────────
 * Banner de consentimiento RGPD simplificado:
 *  - Solo dos opciones: No aceptar / Aceptar
 *  - Accesible (roles ARIA, foco gestionado)
 *  - Se oculta si ya decidió (consent.decided === true)
 * ─────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/components/providers/ConsentProvider";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll } = useConsent();

  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showBanner) bannerRef.current?.focus();
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configuración de cookies"
      ref={bannerRef}
      tabIndex={-1}
      className="
        fixed bottom-0 left-0 right-0 z-[9999]
        bg-[#111] border-t border-white/10
        p-4 md:p-6
        shadow-[0_-8px_40px_rgba(0,0,0,0.6)]
        focus:outline-none
      "
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="text-sm text-white/70 flex-1 leading-relaxed">
          Usamos cookies analíticas para entender cómo se usa el sitio y mejorar
          la experiencia. Puedes consultar nuestra{" "}
          <Link
            href="/cookies"
            className="underline underline-offset-2 text-white/90 hover:text-[#e63946] transition-colors"
          >
            política de cookies
          </Link>
          .
        </p>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={rejectAll}
            className="
              px-5 py-2 text-sm rounded border border-white/20
              text-white/60 hover:text-white hover:border-white/40
              transition-colors
            "
          >
            No aceptar
          </button>
          <button
            onClick={acceptAll}
            className="
              px-5 py-2 text-sm rounded
              bg-[#e63946] hover:bg-[#c1121f]
              text-white font-medium
              transition-colors
            "
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
