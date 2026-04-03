export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Fight, CommunityStats } from "@/types";
import { serverFetch } from "@/lib/api.server";
import { PrediccionesClient } from "./Prediccionesclient";
import PrediccionesSkeleton from "./components/PrediccionesSkeleton";

// ---------------------------------------------------------------------------
// Metadata dinámica + SEO
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const title = "Predicciones · La Velada del Año 6";
  const description =
    "Predicciones de La Velada del Año 6: elige ganadores, compite con la comunidad y sube en el ranking global.";
  const url = "https://laveladazone.com/predicciones";
  const image = "https://laveladazone.com/og-image.png";

  return {
    title,
    description,

    keywords: [
      "predicciones velada 2026",
      "velada del año 6 predicciones",
      "quien gana velada ibai",
      "ranking velada del año",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "VeladaZone",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Predicciones La Velada del Año 6",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// ---------------------------------------------------------------------------
// Server Component que hace el prefetch y entrega el HydrationBoundary
// ---------------------------------------------------------------------------
async function PrediccionesData() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30 * 1000 } },
  });

  // Prefetch simultáneo
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["fights", 6],
      queryFn: () =>
        serverFetch<Fight[]>("/fighters/fights/?edition=6", {
          next: { revalidate: 300 },
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["community-stats"],
      queryFn: () =>
        serverFetch<CommunityStats[]>("/predictions/community_stats/", {
          next: { revalidate: 30 },
        }),
    }),
  ]);

  // Datos precargados → cliente React Query
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PrediccionesClient />
    </HydrationBoundary>
  );
}

// ---------------------------------------------------------------------------
// Page Component — SSR + Suspense
// ---------------------------------------------------------------------------
export default function PrediccionesPage() {
  return (
    <div className="page-container">
      {/* Header estático SSR */}
      <header className="mb-6 sm:mb-8">
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
      </header>

      {/* Streaming de datos con skeleton */}
      <Suspense fallback={<PrediccionesSkeleton />}>
        <PrediccionesData />
      </Suspense>

      {/* Structured Data JSON-LD para combates */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Predicciones La Velada del Año 6",
            startDate: "2026-07-25T20:00:00+02:00",
            endDate: "2026-07-25T23:00:00+02:00", // ejemplo de fin
            location: {
              "@type": "Place",
              name: "VeladaZone",
              address: "España",
            },
            description:
              "Haz tus predicciones de los combates de La Velada del Año 6 y compite con la comunidad.",
            url: "https://laveladazone.com/predicciones",
            performer: [
              { "@type": "Person", name: "Luchador 1" },
              { "@type": "Person", name: "Luchador 2" },
            ],
            organizer: {
              "@type": "Organization",
              name: "VeladaZone",
              url: "https://laveladazone.com",
            },

            eventStatus: "https://schema.org/EventScheduled",
          }),
        }}
      />
    </div>
  );
}
