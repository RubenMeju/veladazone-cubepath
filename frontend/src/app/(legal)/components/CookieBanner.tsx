"use client";

/**
 * CookieBanner.tsx
 * ─────────────────────────────────────────────────────────────────
 * Banner de consentimiento RGPD con:
 *  - Aceptar todo / Rechazar todo
 *  - Panel de personalización por categoría
 *  - Accesible (roles ARIA, foco gestionado)
 *  - Se oculta si ya decidió (consent.decided === true)
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/components/providers/ConsentProvider";

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, acceptCustom } = useConsent();

  const [showCustom, setShowCustom] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  // Foco automático al montar para accesibilidad
  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showBanner) bannerRef.current?.focus();
  }, [showBanner]);

  if (!showBanner) return null;

  const handleCustomSave = () => {
    acceptCustom({ analytics: analyticsChecked, marketing: marketingChecked });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Configuración de cookies"
      ref={bannerRef}
      tabIndex={-1}
      className="
        fixed bottom-0 left-0 right-0 z-9999
        bg-[#111] border-t border-white/10
        p-4 md:p-6
        shadow-[0_-8px_40px_rgba(0,0,0,0.6)]
        focus:outline-none
      "
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Vista principal ─────────────────────── */}
        {!showCustom && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <p className="text-sm text-white/70 flex-1 leading-relaxed">
              Usamos cookies técnicas (necesarias) y, con tu permiso, cookies
              analíticas para mejorar la experiencia. Puedes consultar nuestra{" "}
              <Link
                href="/cookies"
                className="underline underline-offset-2 text-white/90 hover:text-[#e63946] transition-colors"
              >
                política de cookies
              </Link>
              .
            </p>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setShowCustom(true)}
                className="
                  px-4 py-2 text-sm rounded border border-white/20
                  text-white/60 hover:text-white hover:border-white/40
                  transition-colors
                "
              >
                Personalizar
              </button>
              <button
                onClick={rejectAll}
                className="
                  px-4 py-2 text-sm rounded border border-white/20
                  text-white/60 hover:text-white hover:border-white/40
                  transition-colors
                "
              >
                Solo necesarias
              </button>
              <button
                onClick={acceptAll}
                className="
                  px-4 py-2 text-sm rounded
                  bg-[#e63946] hover:bg-[#c1121f]
                  text-white font-medium
                  transition-colors
                "
              >
                Aceptar todo
              </button>
            </div>
          </div>
        )}

        {/* ── Vista personalización ───────────────── */}
        {showCustom && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Personaliza tus preferencias
            </h2>

            <div className="flex flex-col gap-3">
              {/* Necesarias — siempre activas */}
              <CookieToggle
                id="cookie-necessary"
                label="Necesarias"
                description="Autenticación, sesión y funcionamiento básico del sitio. No se pueden desactivar."
                checked={true}
                disabled
                onChange={() => {}}
              />

              {/* Analíticas */}
              <CookieToggle
                id="cookie-analytics"
                label="Analíticas"
                description="Google Analytics — nos ayuda a entender cómo se usa el sitio. Ningún dato personal es vendido."
                checked={analyticsChecked}
                onChange={setAnalyticsChecked}
              />

              {/* Marketing */}
              <CookieToggle
                id="cookie-marketing"
                label="Marketing"
                description="Cookies de publicidad personalizada y retargeting."
                checked={marketingChecked}
                onChange={setMarketingChecked}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-1">
              <button
                onClick={() => setShowCustom(false)}
                className="
                  px-4 py-2 text-sm rounded border border-white/20
                  text-white/60 hover:text-white
                  transition-colors
                "
              >
                Volver
              </button>
              <button
                onClick={handleCustomSave}
                className="
                  px-4 py-2 text-sm rounded
                  bg-[#e63946] hover:bg-[#c1121f]
                  text-white font-medium
                  transition-colors
                "
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Subcomponente toggle ──────────────────────────────────────────

interface CookieToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (val: boolean) => void;
}

function CookieToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieToggleProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded bg-white/5 border border-white/10">
      <div className="flex-1">
        <label
          htmlFor={id}
          className={`text-sm font-medium ${disabled ? "text-white/40" : "text-white"}`}
        >
          {label}
          {disabled && (
            <span className="ml-2 text-xs text-white/30 font-normal">
              (siempre activas)
            </span>
          )}
        </label>
        <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Toggle switch */}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative shrink-0 mt-0.5
          w-10 h-6 rounded-full transition-colors duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63946]
          ${
            disabled
              ? "bg-white/10 cursor-not-allowed"
              : checked
                ? "bg-[#e63946]"
                : "bg-white/20 hover:bg-white/30"
          }
        `}
      >
        <span
          className={`
            absolute top-1 left-1
            w-4 h-4 rounded-full bg-white shadow
            transition-transform duration-200
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
