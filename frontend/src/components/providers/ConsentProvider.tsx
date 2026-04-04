"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
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

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === "undefined") {
      return { decided: false, analytics: false, marketing: false };
    }
    return readConsent();
  });

  const acceptAll = useCallback(() => setConsent(storeAcceptAll()), []);
  const rejectAll = useCallback(() => setConsent(storeRejectAll()), []);
  const acceptCustom = useCallback(
    (categories: Partial<Record<ConsentCategory, boolean>>) =>
      setConsent(storeAcceptCustom(categories)),
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
