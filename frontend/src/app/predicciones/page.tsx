import { Suspense } from "react";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Fight, CommunityStats } from "@/types";
import { serverFetch } from "@/lib/api.server";
import { PrediccionesClient } from "./Prediccionesclient";

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Predicciones · VeladaZone",
  description:
    "Elige tu ganador en cada combate de La Velada del Año 6 y compite con la comunidad.",
  openGraph: {
    title: "Predicciones · VeladaZone",
    description: "¿Quién ganará en La Velada del Año 6? Haz tus predicciones.",
    url: "https://laveladazone.duckdns.org/predicciones",
    siteName: "VeladaZone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Predicciones · VeladaZone",
    description: "¿Quién ganará en La Velada del Año 6? Haz tus predicciones.",
  },
};

export const revalidate = 30;

// ---------------------------------------------------------------------------
// Skeleton — se muestra mientras los fetches resuelven
// ---------------------------------------------------------------------------
function PrediccionesSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-40 animate-pulse"
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-32 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Server Component interno — espera los fetches y entrega el cache hidratado
// Suspense lo aisla: el header llega al browser mientras este resuelve
// ---------------------------------------------------------------------------
async function PrediccionesData() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30 * 1000 } },
  });

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["fights", 6],
      queryFn: () =>
        serverFetch<Fight[]>("/fighters/fights/?edition=6", {
          next: { revalidate: 300 }, // combates: cache 5 min
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["community-stats"],
      queryFn: () =>
        serverFetch<CommunityStats[]>("/predictions/community_stats/", {
          next: { revalidate: 30 }, // termómetro: cache 30s
        }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PrediccionesClient />
    </HydrationBoundary>
  );
}

// ---------------------------------------------------------------------------
// Page — Server Component 
// El header se streamea al browser INMEDIATAMENTE.
// Suspense muestra el skeleton mientras PrediccionesData resuelve los fetches.
// ---------------------------------------------------------------------------
export default function PrediccionesPage() {
  return (
    <div className="page-container">
      {/* SSR puro — llega al browser antes de que empiecen los fetches */}
      <div className="mb-6 sm:mb-8">
        <div className="text-sm text-[#e63946]/60 tracking-[0.4em] uppercase mb-2 font-medium">
          Velada del Año 6 · 25 Julio 2026
        </div>
        <h1
          className="font-bebas text-white tracking-wide leading-none mb-2"
          style={{ fontSize: "clamp(2.5rem, 12vw, 6rem)" }}
        >
          PREDIC<span className="text-[#e63946]">CIONES</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Elige tu ganador en cada combate y compite por ser el mejor predictor
        </p>
      </div>

      {/* Streaming: skeleton → datos reales en cuanto resuelven los fetches */}
      <Suspense fallback={<PrediccionesSkeleton />}>
        <PrediccionesData />
      </Suspense>
    </div>
  );
}
