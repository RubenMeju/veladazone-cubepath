import { Edition, Fighter } from "@/types";
import { FighterCard } from "./components/FighterCard";
import { FightRow } from "./components/FightRow";
import { EditionInfo } from "./components/EditionInfo";
import EditionTabs from "./components/EditionTabs";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const edition = (await searchParams).edition;
  const selectedEdition = Number(edition) || 6;

  const [editions, fighters] = await Promise.all([
    fetch(`${BACKEND_URL}/api/v1/fighters/editions/`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
    fetch(`${BACKEND_URL}/api/v1/fighters/list/?edition=${selectedEdition}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  ]);

  const currentEdition = editions.find(
    (e: Edition) => e.number === selectedEdition,
  );

  return (
    <div className="page-container">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_65%)] opacity-5" />
      </div>

      <div className="relative">
        <div className="mb-10">
          <div className="text-sm text-[#e63946]/60 tracking-[0.4em] uppercase mb-3 font-medium">
            Velada del Año · 2021 — 2026
          </div>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-wider leading-none mb-2">
            STATS & <span className="text-[#e63946]">HISTORIA</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Historial completo de las 6 ediciones
          </p>
        </div>

        <EditionTabs selectedEdition={selectedEdition} />

        {currentEdition && <EditionInfo edition={currentEdition} />}

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bebas text-3xl text-white tracking-wider">
              COMBATES
            </h2>
            {selectedEdition === 6 ? (
              <span className="text-[10px] text-[#e63946]/70 border border-[#e63946]/20 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                Pendientes
              </span>
            ) : (
              <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                {currentEdition?.fights.length} combates
              </span>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {currentEdition?.fights.map((fight) => (
              <FightRow key={fight.id} fight={fight} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bebas text-3xl text-white tracking-wider">
              LUCHADORES
            </h2>
            {fighters && (
              <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
                {fighters.length} participantes
              </span>
            )}
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fighters.map((fighter: Fighter) => (
              <FighterCard key={fighter.id} fighter={fighter} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
