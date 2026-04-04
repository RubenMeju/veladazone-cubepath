"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  readConsent,
  acceptAll as storeAcceptAll,
  rejectAll as storeRejectAll,
  acceptCustom as storeAcceptCustom,
  type ConsentState,
  type ConsentCategory,
} from "@/lib/consent/consent-store";

// ── Fuera del componente → referencias estables ───────────────────

const DEFAULT_CONSENT: ConsentState = {
  decided: false,
  analytics: false,
  marketing: false,
};

// React compara subscribe por referencia en cada render.
// Si es inline (() => () => {}) crea una función nueva → bucle infinito.
const noopSubscribe = () => () => {};

let _snapshot: ConsentState | null = null;

const getClientSnapshot = (): ConsentState => {
  if (_snapshot === null) _snapshot = readConsent();
  return _snapshot;
};

const getServerSnapshot = (): ConsentState => DEFAULT_CONSENT;

// ── Context ───────────────────────────────────────────────────────

interface ConsentContextValue {
  consent: ConsentState;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  acceptCustom: (categories: Partial<Record<ConsentCategory, boolean>>) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────

export function ConsentProvider({ children }: { children: ReactNode }) {
  const storedConsent = useSyncExternalStore(
    noopSubscribe, // ← referencia fija, sin recrearse
    getClientSnapshot, // ← cachea en _snapshot, referencia estable
    getServerSnapshot, // ← constante en SSR/hidratación
  );

  const [actionConsent, setActionConsent] = useState<ConsentState | null>(null);
  const consent = actionConsent ?? storedConsent;

  const acceptAll = useCallback(() => {
    _snapshot = storeAcceptAll();
    setActionConsent(_snapshot);
  }, []);

  const rejectAll = useCallback(() => {
    _snapshot = storeRejectAll();
    setActionConsent(_snapshot);
  }, []);

  const acceptCustom = useCallback(
    (categories: Partial<Record<ConsentCategory, boolean>>) => {
      _snapshot = storeAcceptCustom(categories);
      setActionConsent(_snapshot);
    },
    [],
  );

  return (
    <ConsentContext.Provider
      value={{
        consent,
        showBanner: !consent.decided,
        acceptAll,
        rejectAll,
        acceptCustom,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
