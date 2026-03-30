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

  const editions = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/fighters/editions/`,
  ).then((res) => res.json());

  const currentEdition = editions.find(
    (e: Edition) => e.number === editionNumber,
  );

  const description = currentEdition
    ? `Historial completo de la Velada del Año ${currentEdition.number} con combates y luchadores`
    : "Historial completo de todas las ediciones de La Velada del Año";

  return {
    title: currentEdition
      ? `Stats & Historia | VeladaZone ${currentEdition.number}`
      : "Stats & Historia | VeladaZone",
    description,
    openGraph: {
      title: currentEdition
        ? `VeladaZone - Edición ${currentEdition.number}`
        : "VeladaZone",
      description,
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
