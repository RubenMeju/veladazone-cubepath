import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import type {
  MyAchievementsResponse,
  Achievement,
} from "@/components/achievements/types";
import { LogrosClient } from "./LogrosClient";
import { LogrosSkeleton } from "./components/LogrosSkeleton";

// ── SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Logros y Medallas La Velada del Año 6 | VeladaZone",
  description:
    "Desbloquea logros y medallas prediciendo combates, debatiendo y compitiendo en VeladaZone. Sistema de logros exclusivo para La Velada del Año 6 con rankings, badges y recompensas.",
  keywords: [
    "logros velada del año 6",
    "medallas velada 6",
    "badges veladazone",
    "ranking predicciones velada",
    "logros boxeo streamers",
    "achievements velada 6",
    "recompensas predicciones",
    "IlloJuan TheGrefg logros",
  ],
  openGraph: {
    title: "Logros y Medallas — La Velada del Año 6 | VeladaZone",
    description:
      "Desbloquea logros prediciendo combates, debatiendo y compitiendo. ¿Puedes llegar a Oráculo en La Velada del Año 6?",
    url: "https://laveladazone.com/logros",
    siteName: "VeladaZone",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://laveladazone.com/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Logros y Medallas — La Velada del Año 6",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Logros y Medallas — La Velada del Año 6 | VeladaZone",
    description:
      "Desbloquea logros prediciendo combates y compitiendo en VeladaZone.",
    images: ["https://laveladazone.com/og-image.webp"],
  },
  alternates: {
    canonical: "https://laveladazone.com/logros",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────
function LogrosJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Logros y Medallas — La Velada del Año 6 | VeladaZone",
    description:
      "Sistema de logros y medallas de VeladaZone para La Velada del Año 6. Desbloquea badges prediciendo combates, debatiendo y compitiendo en el ranking global.",
    url: "https://laveladazone.com/logros",
    inLanguage: "es",
    isPartOf: {
      "@type": "WebSite",
      name: "VeladaZone",
      url: "https://laveladazone.com",
    },
    about: {
      "@type": "Event",
      name: "La Velada del Año 6",
      description:
        "Evento de boxeo entre creadores de contenido organizado por Ibai Llanos.",
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
      organizer: {
        "@type": "Person",
        name: "Ibai Llanos",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "VeladaZone",
          item: "https://laveladazone.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Logros",
          item: "https://laveladazone.com/logros",
        },
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

// ── Server fetches ────────────────────────────────────────────────
const SERVER_API_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/v1`
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

async function getCatalog(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/achievements/catalog/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getMyAchievements(): Promise<MyAchievementsResponse | null> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (isDev) {
      headers["x-dev-user"] = "devuser";
    } else {
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();
      if (cookieString) headers["Cookie"] = cookieString;
    }
    const res = await fetch(`${SERVER_API_URL}/achievements/`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function LogrosData() {
  const [catalog, userData] = await Promise.all([
    getCatalog(),
    getMyAchievements(),
  ]);
  return <LogrosClient catalog={catalog} userData={userData} />;
}

// ── Page ─────────────────────────────────────────────────────────
export default function LogrosPage() {
  return (
    <div className="page-container">
      <LogrosJsonLd />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>

      <header className="mb-6 sm:mb-8">
        <div className="text-sm text-[#e63946]/60 tracking-[0.4em] uppercase mb-2 font-medium">
          Velada del Año 6 · Logros
        </div>
        <h1
          className="font-bebas text-white tracking-wide leading-none mb-2"
          style={{ fontSize: "clamp(2.5rem, 12vw, 6rem)" }}
        >
          LOG<span className="text-[#e63946]">ROS</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Desbloquea medallas prediciendo combates, debatiendo y compitiendo en
          el ranking global
        </p>
      </header>

      {/* Texto indexable SSR */}
      <section
        aria-label="Sobre los logros de La Velada del Año 6"
        className="mb-8 text-gray-500 text-sm leading-relaxed max-w-2xl"
      >
        <p>
          El sistema de{" "}
          <strong className="text-gray-400">logros de VeladaZone</strong> te
          recompensa por participar en{" "}
          <strong className="text-gray-400">La Velada del Año 6</strong>.
          Desbloquea badges desde{" "}
          <strong className="text-gray-400">Novato 🥊</strong> hasta{" "}
          <strong className="text-gray-400">Oráculo 🔮</strong> acertando
          predicciones de combates como{" "}
          <strong className="text-gray-400">IlloJuan vs TheGrefg</strong>,{" "}
          <strong className="text-gray-400">YoSoyPlex vs Fernanfloo</strong> o{" "}
          <strong className="text-gray-400">Samy Rivers vs RoRo</strong>.
          Compite en el ranking global, debate en el modo arena y consigue
          logros exclusivos del evento del{" "}
          <strong className="text-gray-400">25 de julio de 2026</strong> en el{" "}
          <strong className="text-gray-400">Estadio de La Cartuja</strong>.
        </p>
      </section>

      <Suspense fallback={<LogrosSkeleton />}>
        <LogrosData />
      </Suspense>
    </div>
  );
}
