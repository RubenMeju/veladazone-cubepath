"use client";

interface ShareButtonsProps {
  username?: string;
  shareUrl?: string; // La URL pública del cartel con OG
}

export function ShareButtons({ username, shareUrl }: ShareButtonsProps) {
  const url =
    shareUrl ??
    (username
      ? `https://laveladazone.com/mi-cartel/${username}`
      : "https://laveladazone.com");

  const text = username
    ? `🥊 Estas son mis predicciones para La Velada del Año 6. ¿Acertaré? #VeladaZone #VeladaDelAño6`
    : `🥊 VeladaZone — Predice los ganadores de La Velada del Año 6. #VeladaZone`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "VeladaZone", text, url });
      } catch {
        // Usuario canceló — no hacer nada
      }
      return;
    }
    // Fallback si no hay Web Share API
    handleTwitter();
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      "_blank",
    );
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    // Podrías añadir un toast aquí
  };

  // En móvil con Web Share API — un solo botón
  const isMobile = typeof navigator !== "undefined" && navigator.share;

  if (isMobile) {
    return (
      <div className="flex justify-center">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 bg-[#e63946] hover:bg-[#ff4d5a] text-white font-bold px-6 py-3 rounded-xl transition-colors active:scale-95"
        >
          ↗️ Compartir cartel
        </button>
      </div>
    );
  }

  // En desktop — botones individuales
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={handleTwitter}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-white/30 text-white px-5 py-2.5 rounded-lg transition-colors"
      >
        𝕏 Twitter
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/50 text-white px-5 py-2.5 rounded-lg transition-colors"
      >
        💬 WhatsApp
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#e63946]/50 text-white px-5 py-2.5 rounded-lg transition-colors"
      >
        🔗 Copiar enlace
      </button>
    </div>
  );
}
