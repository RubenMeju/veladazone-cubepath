import { Suspense } from "react";
import { Metadata } from "next";
import { serverFetch } from "@/lib/api.server";
import { ProfileClient } from "./ProfileClient";
import type { ProfileData } from "./types";
import Link from "next/link";
import { ProfileSkeleton } from "./components/ProfileSkeleton";

// ---------------------------------------------------------------------------
// Metadata dinámica — Open Graph con datos reales del usuario
// Esto hace que el preview al compartir en X/WhatsApp muestre nombre y stats
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  try {
    const data = await serverFetch<ProfileData>(`/users/profile/${username}/`);
    const title = `${data.display_name} · VeladaZone`;
    const description = `${data.stats.badge.emoji} ${data.stats.badge.label} · ${data.stats.total} predicciones · ${data.stats.accuracy}% de acierto`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://laveladazone.duckdns.org/perfil/${username}`,
        siteName: "VeladaZone",
        type: "profile",
        ...(data.avatar && {
          images: [{ url: data.avatar, width: 400, height: 400 }],
        }),
      },
      twitter: {
        card: "summary",
        title,
        description,
        ...(data.avatar && { images: [data.avatar] }),
      },
    };
  } catch {
    return {
      title: "Perfil · VeladaZone",
      description: "Perfil de predictor en VeladaZone",
    };
  }
}

// ---------------------------------------------------------------------------
// Server Component interno — fetchea el perfil y lo pasa al Client
// Aislado en Suspense para que el skeleton aparezca inmediatamente
// ---------------------------------------------------------------------------
async function ProfileData({ username }: { username: string }) {
  let data: ProfileData | null = null;

  try {
    data = await serverFetch<ProfileData>(`/users/profile/${username}/`);
  } catch (error) {
    console.error("Profile fetch failed:", error);
  }

  if (!data) return <ProfileNotFound />;

  return <ProfileClient data={data} username={username} />;
}

function ProfileNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🥊</div>
        <h2 className="font-bebas text-3xl text-white mb-2">
          Usuario no encontrado
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Este luchador no existe en VeladaZone
        </p>
        <Link href="/" className="text-[#e63946] hover:underline text-sm">
          Volver al inicio →
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page — el skeleton aparece inmediatamente mientras fetchea el perfil
// ---------------------------------------------------------------------------
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="page-container">
      {/* Background decorativo — SSR puro, llega inmediatamente */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileData username={username} />
      </Suspense>
    </div>
  );
}
