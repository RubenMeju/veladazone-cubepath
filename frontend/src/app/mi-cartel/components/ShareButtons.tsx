"use client";

export function ShareButtons() {
  const handleShare = (platform: string) => {
    const url = "https://vps22370.cubepath.net";
    const text = `🥊 Mis predicciones para La Velada del Año 6 están listas. ¿Las tuyas? #VeladaZone #VeladaDelAño6`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      );
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => handleShare("twitter")}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#e63946]/50 text-white px-5 py-2.5 rounded-lg transition-colors"
      >
        𝕏 Compartir en Twitter
      </button>
      <button
        onClick={() => handleShare("whatsapp")}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/50 text-white px-5 py-2.5 rounded-lg transition-colors"
      >
        💬 Compartir en WhatsApp
      </button>
    </div>
  );
}
