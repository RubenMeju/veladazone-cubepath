// app/mi-cartel/[username]/page.tsx
import type { Metadata } from "next";
import { MiCartelPublicoContent } from "./MiCartelPublicoContent";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const title = `Cartel de @${username} — VeladaZone`;
  const description = `Estas son las predicciones de @${username} para La Velada del Año 6. ¿Acertará?`;
  const ogImageUrl = `https://laveladazone.com/mi-cartel/${username}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://laveladazone.com/mi-cartel/${username}`,
      siteName: "VeladaZone",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MiCartelPublicoPage({ params }: Props) {
  const { username } = await params;
  return <MiCartelPublicoContent username={username} />;
}
