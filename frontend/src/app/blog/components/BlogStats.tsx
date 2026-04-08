// frontend/src/app/blog/components/BlogStats.tsx

import { BlogPost } from "../types";

interface Props {
  posts: BlogPost[];
}

export function BlogStats({ posts }: Props) {
  if (posts.length === 0) return null;

  const avgRelevance =
    posts.reduce((acc, p) => acc + p.relevance_score, 0) / posts.length;

  const fighters = new Set(posts.map((p) => p.fighter.slug)).size;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: "vídeos publicados", value: posts.length },
        { label: "peleadores", value: fighters },
        {
          label: "relevancia media",
          value: `${Math.round(avgRelevance * 100)}%`,
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-[#0d0d0d] border border-white/5 rounded-xl p-3 text-center"
        >
          <p className="text-white text-xl font-bebas tracking-wide">
            {s.value}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
