// frontend/src/app/blog/components/BlogFilters.tsx
"use client";

const FIGHTERS = [
  { slug: null, label: "Todos" },
  { slug: "thegrefg", label: "TheGrefg" },
  { slug: "illojuan", label: "IlloJuan" },
  { slug: "yosoyplex", label: "YoSoyPlex" },
  { slug: "fernanfloo", label: "Fernanfloo" },
  { slug: "marta-diaz", label: "Marta Díaz" },
  { slug: "tatiana-kaer", label: "Tatiana Kaer" },
  { slug: "rivers", label: "Rivers" },
  { slug: "roro", label: "Roro" },
  { slug: "gero-arias", label: "Gero Arias" },
  { slug: "viruzz", label: "Viruzz" },
  { slug: "angie-velasco", label: "Angie Velasco" },
  { slug: "alondrissa", label: "Alondrissa" },
  { slug: "lit-killah", label: "Lit Killah" },
  { slug: "kidd-keo", label: "Kidd Keo" },
  { slug: "clerss", label: "Clerss" },
  { slug: "natalia-mx", label: "Natalia MX" },
  { slug: "fabiana-sevillano", label: "Fabiana Sevillano" },
  { slug: "la-parce", label: "La Parce" },
  { slug: "edu-aguirre", label: "Edu Aguirre" },
  { slug: "gaston-edul", label: "Gastón Edul" }
];

const TAGS = [
  { value: null, label: "Todo" },
  { value: "entrenamiento", label: "🏋️ Entrenamiento" },
  { value: "trash_talk", label: "🔥 Trash talk" },
  { value: "cara_a_cara", label: "👊 Cara a cara" },
  { value: "rueda_de_prensa", label: "🎙️ Rueda de prensa" },
  { value: "reaccion", label: "😲 Reacción" },
  { value: "documental", label: "🎬 Documental" },
  { value: "weigh_in", label: "⚖️ Pesaje" },
];

const ORDERINGS = [
  { value: "-published_at", label: "Más reciente" },
  { value: "-relevance_score", label: "Más relevante" },
  { value: "-view_count", label: "Más visto" },
];

interface Props {
  activeFighter: string | null;
  activeTag: string | null;
  activeOrdering: string;
  onFighterChange: (v: string | null) => void;
  onTagChange: (v: string | null) => void;
  onOrderingChange: (v: string) => void;
}

export function BlogFilters({
  activeFighter,
  activeTag,
  activeOrdering,
  onFighterChange,
  onTagChange,
  onOrderingChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Filtro peleador */}
 <div className="hidden md:flex gap-2 flex-wrap">
  {FIGHTERS.map((f) => (
    <button
      key={`fighter-${f.slug ?? "all"}`}
      onClick={() => onFighterChange(f.slug)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        activeFighter === f.slug
          ? "bg-[#e63946] border-[#e63946] text-white"
          : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
      }`}
    >
      {f.label}
    </button>
  ))}
</div>

      {/* Filtro tag + ordenación */}
      <div className="flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {TAGS.map((t) => (
            <button
              key={t.value ?? "todo"}
              onClick={() => onTagChange(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                activeTag === t.value
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={activeOrdering}
          onChange={(e) => onOrderingChange(e.target.value)}
          className="bg-transparent border border-white/10 text-gray-400 text-xs rounded px-2 py-1.5 hover:border-white/30 transition-colors"
        >
          {ORDERINGS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}