// frontend/src/app/blog/BlogClient.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BlogCard } from "./components/BlogCard";
import { BlogStats } from "./components/BlogStats";
import { BlogPost } from "./types";
import { BlogFilters } from "./components/BlogFilters";

export function BlogClient() {
  const [fighter, setFighter] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [ordering, setOrdering] = useState("-published_at");

  const params = new URLSearchParams({ ordering });
  if (fighter) params.append("fighter", fighter);
  if (tag) params.append("tag", tag);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts", fighter, tag, ordering],
    queryFn: () => api.get<BlogPost[]>(`/blog/posts/?${params.toString()}`),
    staleTime: 60 * 1000,
  });

  return (
    <>
      <BlogStats posts={posts} />

      <BlogFilters
        activeFighter={fighter}
        activeTag={tag}
        activeOrdering={ordering}
        onFighterChange={setFighter}
        onTagChange={setTag}
        onOrderingChange={setOrdering}
      />

      {isLoading ? (
        <div className="text-gray-500 text-sm text-center py-12">
          Cargando vídeos...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-12">
          No hay vídeos con estos filtros todavía
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
