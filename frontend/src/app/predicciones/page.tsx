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

      {/* Texto indexable para SEO */}
      <section className="mb-8 text-gray-500 text-sm leading-relaxed max-w-2xl">
        <p>
          La <strong className="text-gray-400">Velada del Año 6</strong> llega
          el{" "}
          <strong className="text-gray-400">
            25 de julio de 2026 a Sevilla
          </strong>
          . El cartel incluye combates como{" "}
          <strong className="text-gray-400">IlloJuan vs TheGrefg</strong>,{" "}
          <strong className="text-gray-400">Plex vs Fernanfloo</strong>,{" "}
          <strong className="text-gray-400">Viruzz vs Gero Arias</strong> y{" "}
          <strong className="text-gray-400">Samy Rivers vs Roro</strong>. Elige
          tus ganadores, defiende tus predicciones y compite en el ranking
          global.
        </p>
      </section>

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
            name: "La Velada del Año 6",
            startDate: "2026-07-25T20:00:00+02:00",
            endDate: "2026-07-26T00:00:00+02:00",
            location: {
              "@type": "Place",
              name: "Estadio de La Cartuja",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sevilla",
                addressCountry: "ES",
              },
            },
            description:
              "La Velada del Año 6 es el evento de boxeo de creadores de contenido organizado por Ibai Llanos. Haz tus predicciones en VeladaZone y compite con la comunidad.",
            url: "https://laveladazone.com/predicciones",
            organizer: {
              "@type": "Person",
              name: "Ibai Llanos",
              url: "https://www.twitch.tv/ibai",
            },
            performer: [
              { "@type": "Person", name: "IlloJuan" },
              { "@type": "Person", name: "TheGrefg" },
              { "@type": "Person", name: "Plex" },
              { "@type": "Person", name: "Fernanfloo" },
              { "@type": "Person", name: "Viruzz" },
              { "@type": "Person", name: "Gero Arias" },
              { "@type": "Person", name: "Samy Rivers" },
              { "@type": "Person", name: "Roro" },
              { "@type": "Person", name: "Marta Díaz" },
              { "@type": "Person", name: "Tatiana Kaer" },
              { "@type": "Person", name: "Lit Killah" },
              { "@type": "Person", name: "Kidd Keo" },
              { "@type": "Person", name: "Alondrissa" },
              { "@type": "Person", name: "Angie Velasco" },
              { "@type": "Person", name: "Clersss" },
              { "@type": "Person", name: "Natalia MX" },
              { "@type": "Person", name: "Fabiana Sevillano" },
              { "@type": "Person", name: "La Parce" },
              { "@type": "Person", name: "Edu Aguirre" },
              { "@type": "Person", name: "Gastón Edul" },
            ],
            subEvent: [
              {
                "@type": "Event",
                name: "IlloJuan vs TheGrefg — Main Event",
                description: "Main event masculino. Peso: 67 kg.",
                performer: [
                  { "@type": "Person", name: "IlloJuan" },
                  { "@type": "Person", name: "TheGrefg" },
                ],
              },
              {
                "@type": "Event",
                name: "Samy Rivers vs Roro — Main Event Femenino",
                description: "Main event femenino. Peso: 52 kg.",
                performer: [
                  { "@type": "Person", name: "Samy Rivers" },
                  { "@type": "Person", name: "Roro" },
                ],
              },
              {
                "@type": "Event",
                name: "Plex vs Fernanfloo",
                description:
                  "Ambos con victorias previas en ediciones anteriores.",
                performer: [
                  { "@type": "Person", name: "Plex" },
                  { "@type": "Person", name: "Fernanfloo" },
                ],
              },
              {
                "@type": "Event",
                name: "Viruzz vs Gero Arias",
                description:
                  "Combate sin casco. Gero Arias aspira a los Juegos Olímpicos.",
                performer: [
                  { "@type": "Person", name: "Viruzz" },
                  { "@type": "Person", name: "Gero Arias" },
                ],
              },
              {
                "@type": "Event",
                name: "Lit Killah vs Kidd Keo",
                description: "Duelo de raperos. Peso: 78 kg.",
                performer: [
                  { "@type": "Person", name: "Lit Killah" },
                  { "@type": "Person", name: "Kidd Keo" },
                ],
              },
              {
                "@type": "Event",
                name: "Marta Díaz vs Tatiana Kaer",
                performer: [
                  { "@type": "Person", name: "Marta Díaz" },
                  { "@type": "Person", name: "Tatiana Kaer" },
                ],
              },
              {
                "@type": "Event",
                name: "Alondrissa vs Angie Velasco",
                description: "Streamers amigas que se enfrentan en el ring.",
                performer: [
                  { "@type": "Person", name: "Alondrissa" },
                  { "@type": "Person", name: "Angie Velasco" },
                ],
              },
              {
                "@type": "Event",
                name: "Clersss vs Natalia MX",
                performer: [
                  { "@type": "Person", name: "Clersss" },
                  { "@type": "Person", name: "Natalia MX" },
                ],
              },
              {
                "@type": "Event",
                name: "Fabiana Sevillano vs La Parce",
                performer: [
                  { "@type": "Person", name: "Fabiana Sevillano" },
                  { "@type": "Person", name: "La Parce" },
                ],
              },
              {
                "@type": "Event",
                name: "Edu Aguirre vs Gastón Edul",
                description:
                  "Periodistas defensores de Cristiano Ronaldo y Lionel Messi.",
                performer: [
                  { "@type": "Person", name: "Edu Aguirre" },
                  { "@type": "Person", name: "Gastón Edul" },
                ],
              },
            ],
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
          }),
        }}
      />
    </div>
  );
}
