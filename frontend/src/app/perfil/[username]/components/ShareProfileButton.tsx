"use client";

interface Props {
  username: string;
  displayName: string;
}

export function ShareProfileButton({ username, displayName }: Props) {
  const handleShare = () => {
    const url = `${window.location.origin}/perfil/${username}`;
    const text = `🥊 Mira las predicciones de ${displayName} para La Velada del Año 6 en VeladaZone #VeladaDelAño6`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    );
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-white/5 hover:border-white/10 text-gray-400 hover:text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
    >
      𝕏 Compartir perfil
    </button>
  );
}
