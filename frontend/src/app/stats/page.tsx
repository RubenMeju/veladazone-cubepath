import { Suspense } from "react";
import EditionTabs from "./components/EditionTabs";
import { StatsData } from "./StatsData";
import { Edition } from "@/types";
import Header from "./components/Header";
import StatsSkeleton from "./components/StatsSkeleton";

type SearchParams = { edition?: string | string[] };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const editionNumber = Number(params.edition) || 6;

  let editionLabel = `Edición ${editionNumber}`;

  try {
    const editions = await fetch(
      `${process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/fighters/editions/`,
    ).then((res) => res.json());

    const current = editions.find((e: Edition) => e.number === editionNumber);
    if (current) editionLabel = `Edición ${current.number}`;
  } catch {
    // fallback al label por defecto
  }

  const title = `Stats & Historia · ${editionLabel}`;
  const description = `Historial completo de la Velada del Año ${editionNumber}: combates, luchadores y resultados.`;
  const url = `https://laveladazone.com/stats?edition=${editionNumber}`;
  const image = "https://laveladazone.com/og-image.png";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "VeladaZone",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const edition = Number(params.edition) || 6;

  return (
    <div className="page-container">
      <Header />
      <EditionTabs selectedEdition={edition} />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsData edition={edition} />
      </Suspense>
    </div>
  );
}
