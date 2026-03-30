import { Edition, Fight, Fighter } from "@/types";
import { EditionInfo } from "./components/EditionInfo";
import { FightRow } from "./components/FightRow";
import { FighterCard } from "./components/FighterCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function StatsData({ edition }: { edition: number }) {
  const [editions, fighters] = await Promise.all([
    fetch(`${BACKEND_URL}/api/v1/fighters/editions/`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
    fetch(`${BACKEND_URL}/api/v1/fighters/list/?edition=${edition}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),
  ]);

  const currentEdition = editions.find((e: Edition) => e.number === edition);

  return (
    <div className="relative">
      {currentEdition && <EditionInfo edition={currentEdition} />}

      {/* Combates */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-bebas text-3xl text-white tracking-wider">
            COMBATES
          </h2>
          <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
            {currentEdition?.fights.length ?? 0} combates
          </span>
        </div>
        <div className="flex flex-col gap-6">
          {currentEdition?.fights.map((fight: Fight) => (
            <FightRow key={fight.id} fight={fight} />
          ))}
        </div>
      </div>

      {/* Luchadores */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-bebas text-3xl text-white tracking-wider">
            LUCHADORES
          </h2>
          <span className="text-[10px] text-gray-600 border border-white/5 rounded-full px-2.5 py-0.5 tracking-widest uppercase">
            {fighters.length} participantes
          </span>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fighters.map((fighter: Fighter) => (
            <FighterCard key={fighter.id} fighter={fighter} />
          ))}
        </div>
      </div>
    </div>
  );
}
