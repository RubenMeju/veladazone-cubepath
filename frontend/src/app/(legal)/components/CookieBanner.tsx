"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#0d0d0d] border-t border-white/10 p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
        <p className="max-w-xl">
          Usamos cookies para mejorar tu experiencia. Puedes aceptar o rechazar
          su uso.{" "}
          <a href="/cookies" className="underline hover:text-white">
            Más info
          </a>
        </p>

        <div className="flex gap-3">
          <button
            onClick={reject}
            className="px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:text-white"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 bg-[#e63946] text-white rounded-lg hover:opacity-90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
