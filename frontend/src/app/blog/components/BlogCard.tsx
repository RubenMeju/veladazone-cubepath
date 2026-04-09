import { useState } from "react";
import { BlogPost } from "../types";

interface Props {
  post: BlogPost;
}

const TAG_LABELS: Record<string, string> = {
  entrenamiento: "🏋️ Entrenamiento",
  trash_talk: "🔥 Trash talk",
  cara_a_cara: "👊 Cara a cara",
  rueda_de_prensa: "🎙️ Rueda de prensa",
  reaccion: "😲 Reacción",
  documental: "🎬 Documental",
  weigh_in: "⚖️ Pesaje",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return "hace menos de 1h";
  if (h < 24) return `hace ${h}h`;
  return `hace ${d}d`;
}

export function BlogCard({ post }: Props) {
  const [play, setPlay] = useState(false);

  const relevanceColor =
    post.relevance_score >= 0.85
      ? "text-green-400"
      : post.relevance_score >= 0.7
        ? "text-yellow-400"
        : "text-gray-500";

  return (
    <div className="group flex flex-col bg-[#0d0d0d] border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-colors">
      {/* Video lazy-load */}
      <div
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={() => setPlay(true)}
      >
        {play ? (
          <iframe
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${post.youtube_id}?autoplay=1`}
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Badge peleador */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
          {post.fighter.name}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {post.ai_tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5"
            >
              {TAG_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>

        {/* Título */}
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#e63946] transition-colors">
          {post.title}
        </h3>

        {/* Resumen IA */}
        {post.ai_summary && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {post.ai_summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-gray-600 text-xs">
            {timeAgo(post.published_at)}
          </span>
          <span className={`text-xs font-medium ${relevanceColor}`}>
            {Math.round(post.relevance_score * 100)}% relevancia
          </span>
        </div>
      </div>
    </div>
  );
}
