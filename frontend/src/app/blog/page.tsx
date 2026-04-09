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
import type { Metadata } from "next";

// ── SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog IA La Velada del Año 6 | VeladaZone",
  description:
    "Últimas noticias, entrenamientos, trash talk y ruedas de prensa de La Velada del Año 6. Seguimiento automático con IA de los canales de IlloJuan, TheGrefg, Fernanfloo, YoSoyPlex, Samy Rivers, Perxitaa y más peleadores.",
  keywords: [
    "La Velada del Año 6",
    "Velada 6",
    "IlloJuan boxeo",
    "TheGrefg Velada",
    "Fernanfloo pelea",
    "YoSoyPlex boxeo",
    "Samy Rivers Velada",
    "Perxitaa boxeo",
    "Ibai Llanos boxeo",
    "velada del año 2026",
    "boxeo streamers",
    "noticias velada 6",
    "entrenamiento peleadores velada",
  ],
  openGraph: {
    title: "Blog IA — La Velada del Año 6 | VeladaZone",
    description:
      "Todos los vídeos sobre La Velada del Año 6 detectados automáticamente por IA. Entrenamientos, cara a cara, trash talk y ruedas de prensa de los peleadores.",
    url: "https://laveladazone.com/blog",
    siteName: "VeladaZone",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://laveladazone.com/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Blog IA — La Velada del Año 6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog IA — La Velada del Año 6 | VeladaZone",
    description:
      "Todos los vídeos sobre La Velada del Año 6 detectados automáticamente por IA.",
    images: ["https://laveladazone.com/og-image.webp"],
  },
  alternates: {
    canonical: "https://laveladazone.com/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────
function BlogJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog IA La Velada del Año 6 — VeladaZone",
    description:
      "Seguimiento automático con IA de todos los vídeos de los peleadores de La Velada del Año 6.",
    url: "https://laveladazone.com/blog",
    inLanguage: "es",
    publisher: {
      "@type": "Organization",
      name: "VeladaZone",
      url: "https://laveladazone.com",
      logo: {
        "@type": "ImageObject",
        url: "https://laveladazone.com/og-image.webp",
      },
    },
    about: {
      "@type": "Event",
      name: "La Velada del Año 6",
      description:
        "Evento de boxeo entre creadores de contenido organizado por Ibai Llanos. 10 combates en el Estadio de La Cartuja, Sevilla.",
      startDate: "2026-07-25T20:00:00+02:00",
      endDate: "2026-07-26T00:00:00+02:00",
      eventStatus: "https://schema.org/EventScheduled",
      image: "https://laveladazone.com/og-image.webp",
      location: {
        "@type": "Place",
        name: "Estadio de La Cartuja",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Sevilla",
          addressCountry: "ES",
        },
      },
      offers: {
        "@type": "Offer",
        url: "https://laveladazone.com/predicciones",
        availability: "https://schema.org/InStock",
        priceCurrency: "EUR",
      },
      organizer: {
        "@type": "Person",
        name: "Ibai Llanos",
      },
      performer: [
        { "@type": "Person", name: "IlloJuan" },
        { "@type": "Person", name: "TheGrefg" },
        { "@type": "Person", name: "Fernanfloo" },
        { "@type": "Person", name: "YoSoyPlex" },
        { "@type": "Person", name: "Samy Rivers" },
        { "@type": "Person", name: "Perxitaa" },
        { "@type": "Person", name: "Marta Díaz" },
        { "@type": "Person", name: "Lit Killah" },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Data ─────────────────────────────────────────────────────────
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

// ── Page ─────────────────────────────────────────────────────────
export default function BlogPage() {
  return (
    <div className="page-container">
      <BlogJsonLd />

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

      {/*
        Texto indexable SSR — Google lo indexa antes de ejecutar JS.
        Mismo patrón que predicciones/page.tsx
      */}
      <section
        aria-label="Sobre el Blog IA de La Velada del Año 6"
        className="mb-8 text-gray-500 text-sm leading-relaxed max-w-2xl"
      >
        <p>
          El <strong className="text-gray-400">Blog IA de VeladaZone</strong>{" "}
          rastrea automáticamente los canales de YouTube de los peleadores de{" "}
          <strong className="text-gray-400">La Velada del Año 6</strong> —{" "}
          <strong className="text-gray-400">IlloJuan</strong>,{" "}
          <strong className="text-gray-400">TheGrefg</strong>,{" "}
          <strong className="text-gray-400">Fernanfloo</strong>,{" "}
          <strong className="text-gray-400">YoSoyPlex</strong>,{" "}
          <strong className="text-gray-400">Samy Rivers</strong>,{" "}
          <strong className="text-gray-400">Perxitaa</strong> y más — y detecta
          con inteligencia artificial todo el contenido relacionado con el
          evento: entrenamientos de boxeo, ruedas de prensa, cara a cara, trash
          talk y documentales de preparación. La{" "}
          <strong className="text-gray-400">Velada del Año 6</strong> se celebra
          el{" "}
          <strong className="text-gray-400">
            25 de julio de 2026 en el Estadio de La Cartuja, Sevilla
          </strong>
          , organizada por{" "}
          <strong className="text-gray-400">Ibai Llanos</strong>.
        </p>
      </section>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogData />
      </Suspense>
    </div>
  );
}
