// frontend/src/app/blog/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverFetch } from "@/lib/api.server";
import BlogSkeleton from "./components/BlogSkeleton";
import { BlogPost } from "./types";
import { BlogClient } from "./BlogClient";

export const metadata = {
  title: "Blog IA | VeladaZone",
  description:
    "La IA vigila los canales de los peleadores de La Velada del Año 6 y trae automáticamente todo el contenido relevante.",
  openGraph: {
    title: "Blog IA — VeladaZone",
    description:
      "Vídeos, entrenamientos, trash talk y ruedas de prensa de La Velada 6, detectados automáticamente por IA.",
  },
};

async function BlogData() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  await queryClient.prefetchQuery({
    queryKey: ["blog-posts"],
    queryFn: () =>
      serverFetch<BlogPost[]>("/blog/posts/?ordering=-published_at", {
        next: { revalidate: 60 },
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogClient />
    </HydrationBoundary>
  );
}

export default function BlogPage() {
  return (
    <div className="page-container">
      <header className="mb-6 sm:mb-8">
        <div className="text-sm text-[#e63946]/60 tracking-[0.4em] uppercase mb-2 font-medium">
          Velada del Año 6 · Blog IA
        </div>
        <h1
          className="font-bebas text-white tracking-wide leading-none mb-2"
          style={{ fontSize: "clamp(2.5rem, 12vw, 6rem)" }}
        >
          BLOG <span className="text-[#e63946]">IA</span>
        </h1>
        <p className="text-gray-500 text-sm">
          La IA vigila los canales de los peleadores y publica automáticamente
          todo lo relacionado con La Velada
        </p>
      </header>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogData />
      </Suspense>
    </div>
  );
}
