import { Metadata } from "next";
import { PosterCard } from "../components/PosterCard";
import { ShareButtons } from "../components/ShareButtons";
import { Prediction } from "@/types";
import Link from "next/link";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ?? "https://laveladazone.com/api/v1";

async function getPredictions(username: string): Promise<Prediction[]> {
  try {
    const res = await fetch(`${BACKEND}/predictions/cartel/${username}/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── OG Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { username } = params;
  const ogImage = `https://laveladazone.com/api/og/cartel/${username}`;

  return {
    title: `Predicciones de @${username} — VeladaZone`,
    description: `Mira las predicciones de @${username} para La Velada del Año 6. ¿Acertará?`,
    openGraph: {
      title: `Predicciones de @${username} — Velada del Año 6`,
      description: `¿Acertará @${username}? Haz tus propias predicciones en VeladaZone.`,
      url: `https://laveladazone.com/mi-cartel/${username}`,
      siteName: "VeladaZone",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Cartel de predicciones de @${username}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Predicciones de @${username} — Velada del Año 6`,
      description: `¿Acertará @${username}? Haz tus propias predicciones en VeladaZone.`,
      images: [ogImage],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CartelPublicoPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const predictions = await getPredictions(username);

  return (
    <div className="page-container">
      <div className="mb-10 text-center">
        <h1 className="font-bebas text-5xl md:text-7xl text-white tracking-wider mb-2">
          CARTEL DE{" "}
          <span className="text-[#e63946]">@{username.toUpperCase()}</span>
        </h1>
        <p className="text-gray-400">
          Predicciones para La Velada del Año 6 · 25 Jul 2026
        </p>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🥊</div>
          <h3 className="font-bebas text-2xl text-white mb-2">
            @{username} aún no tiene predicciones
          </h3>
          <p className="text-gray-500 mb-6">¿Y tú? Haz las tuyas.</p>
          <Link
            href="/predicciones"
            className="inline-block bg-[#e63946] hover:bg-[#c1121f] text-white font-medium px-8 py-3 rounded transition-colors"
          >
            Hacer Predicciones →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <PosterCard predictions={predictions} username={username} />
          <ShareButtons
            username={username}
            shareUrl={`https://laveladazone.com/mi-cartel/${username}`}
          />
          <Link
            href="/predicciones"
            className="text-gray-500 text-sm hover:text-[#e63946] transition-colors"
          >
            ¿Quieres hacer tus propias predicciones? →
          </Link>
        </div>
      )}
    </div>
  );
}
