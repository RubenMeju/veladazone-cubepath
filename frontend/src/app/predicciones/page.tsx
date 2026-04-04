export const dynamic = "force-dynamic";

import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Fight, CommunityStats } from "@/types";
import { serverFetch } from "@/lib/api.server";
import { PrediccionesClient } from "./Prediccionesclient";
import PrediccionesSkeleton from "./components/PrediccionesSkeleton";

// ── SEO ──────────────────────────────────────────────────────────
import { PrediccionesJsonLd } from "@/app/predicciones/components/PrediccionesJsonLd";
export { generateMetadata } from "@/app/predicciones/seo/metadata";

// ─────────────────────────────────────────────────────────────────
// Server Component — prefetch de datos
// ─────────────────────────────────────────────────────────────────
async function PrediccionesData() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30 * 1000 } },
  });

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PrediccionesClient />
    </HydrationBoundary>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────────
export default function PrediccionesPage() {
  return (
    <div className="page-container">
      {/* JSON-LD — SSR */}
      <PrediccionesJsonLd />

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

      {/*
        Texto indexable SSR — Google lo indexa antes de ejecutar JS.
        Incluye los nombres oficiales de todos los combates.
      */}
      <section
        aria-label="Sobre La Velada del Año 6"
        className="mb-8 text-gray-500 text-sm leading-relaxed max-w-2xl"
      >
        <p>
          La <strong className="text-gray-400">Velada del Año 6</strong> llega
          el{" "}
          <strong className="text-gray-400">
            25 de julio de 2026 al Estadio de La Cartuja, Sevilla
          </strong>
          , con 10 combates de boxeo entre creadores de contenido organizado por
          Ibai Llanos. El cartel incluye el main event{" "}
          <strong className="text-gray-400">IlloJuan vs TheGrefg</strong> (67
          kg), el main event femenino{" "}
          <strong className="text-gray-400">Samy Rivers vs RoRo</strong>, y
          combates como{" "}
          <strong className="text-gray-400">YoSoyPlex vs Fernanfloo</strong>,{" "}
          <strong className="text-gray-400">Gero Arias vs ByViruzz</strong>,{" "}
          <strong className="text-gray-400">Marta Díaz vs Tatiana Kaer</strong>,{" "}
          <strong className="text-gray-400">Lit Killah vs Kidd Keo</strong>,{" "}
          <strong className="text-gray-400">Alondrissa vs Angie Velasco</strong>
          , <strong className="text-gray-400">Clersss vs Natalia MX</strong>,{" "}
          <strong className="text-gray-400">
            Fabiana Sevillano vs La Parce
          </strong>{" "}
          y{" "}
          <strong className="text-gray-400">Edu Aguirre vs Gastón Edul</strong>.
          Elige tus ganadores, defiende tus predicciones y compite en el ranking
          global.
        </p>
      </section>

      {/* Datos con Suspense */}
      <Suspense fallback={<PrediccionesSkeleton />}>
        <PrediccionesData />
      </Suspense>
    </div>
  );
}
