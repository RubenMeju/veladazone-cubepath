import Link from "next/link";
import { ProfileData } from "../types";

interface Props {
  leagues_created: ProfileData["leagues_created"];
  leagues_joined: ProfileData["leagues_joined"];
}

export function ProfileLeagues({ leagues_created, leagues_joined }: Props) {
  const isEmpty = leagues_created.length === 0 && leagues_joined.length === 0;

  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 md:col-span-2">
      <h2 className="font-bebas text-xl text-white tracking-wider mb-4">
        🏆 Ligas
      </h2>

      {isEmpty ? (
        <p className="text-gray-600 text-sm text-center py-4">
          No estás en ninguna liga todavía
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {leagues_created.length > 0 && (
            <>
              <h3 className="text-gray-400 text-xs uppercase mb-1">Creadas</h3>
              {leagues_created.map((league) => (
                <Link
                  key={league.id}
                  href={`/fantasy/${league.id}`}
                  className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3 flex justify-between items-center hover:border-white/10 transition-colors"
                >
                  <span className="text-white text-sm">{league.name}</span>
                  {league.is_private && (
                    <span className="text-xs text-gray-500">Privada</span>
                  )}
                </Link>
              ))}
            </>
          )}

          {leagues_joined.length > 0 && (
            <>
              <h3 className="text-gray-400 text-xs uppercase mt-3 mb-1">
                Unidas
              </h3>
              {leagues_joined.map((league) => (
                <Link
                  key={league.id}
                  href={`/fantasy/${league.id}`}
                  className="bg-[#0a0a0a] border border-white/5 rounded-lg p-3 flex justify-between items-center hover:border-white/10 transition-colors"
                >
                  <span className="text-white text-sm">{league.name}</span>
                  {league.is_private && (
                    <span className="text-xs text-gray-500">Privada</span>
                  )}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
