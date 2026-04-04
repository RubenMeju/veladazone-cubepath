/**
 * consent-store.ts
 * ─────────────────────────────────────────────────────────────────
 * Estado de consentimiento RGPD.
 * - Sin dependencias externas
 * - SSR-safe (no accede a window/localStorage en servidor)
 * - Persiste en localStorage con clave versionada
 * ─────────────────────────────────────────────────────────────────
 */

export type ConsentCategory = "analytics" | "marketing";

export interface ConsentState {
  /** true = el usuario ya respondió al banner */
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  /** timestamp ISO del momento en que decidió */
  decidedAt?: string;
}

const STORAGE_KEY = "vz_consent_v1";

const DEFAULT_STATE: ConsentState = {
  decided: false,
  analytics: false,
  marketing: false,
};

// ── Lectura ──────────────────────────────────────────────────────

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) } as ConsentState;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

// ── Escritura ────────────────────────────────────────────────────

export function writeConsent(
  state: Omit<ConsentState, "decided" | "decidedAt">,
): ConsentState {
  const next: ConsentState = {
    ...state,
    decided: true,
    decidedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function acceptAll(): ConsentState {
  return writeConsent({ analytics: true, marketing: true });
}

export function rejectAll(): ConsentState {
  return writeConsent({ analytics: false, marketing: false });
}

export function acceptCustom(
  categories: Partial<Record<ConsentCategory, boolean>>,
): ConsentState {
  return writeConsent({ analytics: false, marketing: false, ...categories });
}

export function clearConsent(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
