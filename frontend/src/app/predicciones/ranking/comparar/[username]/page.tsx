export const dynamic = "force-dynamic";

import { getMyPredictions, getUserProfile } from "@/lib/api.server";
import { Fight, OpponentProfile, Prediction } from "@/types";
import {
  User as UserIcon,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Formato que devuelve /users/profile/:username/
interface OpponentPrediction {
  fight: string; // "Edu Aguirre vs Gastón Edul"
  pick: string; // "Edu Aguirre"
  pick_flag: string; // "🇪🇸"
  is_correct: boolean | null;
}

// ── Helper de matching ────────────────────────────────────────────
// El rival devuelve "Edu Aguirre vs Gastón Edul" (string).
// Mis predicciones tienen fight.fighter1.name y fight.fighter2.name.
// Buscamos si el string del rival contiene alguno de los dos nombres.

function findOpponentPred(
  myFight: Fight,
  opponentPredictions: OpponentPrediction[],
): OpponentPrediction | undefined {
  const f1 = myFight.fighter1.name.toLowerCase();
  const f2 = myFight.fighter2.name.toLowerCase();

  return opponentPredictions.find((p) => {
    const fightStr = p.fight.toLowerCase();
    return fightStr.includes(f1) || fightStr.includes(f2);
  });
}

// ── Page ──────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function CompararPage({ params }: PageProps) {
  const { username } = await params;

  const [meData, opponentRaw] = await Promise.all([
    getMyPredictions(),
    getUserProfile(username),
  ]);

  if (!meData) {
    redirect(`/api/auth/login?next=/predicciones/ranking/comparar/${username}`);
  }
  if (!opponentRaw) {
    redirect("/predicciones/ranking");
  }

  const { user: me, predictions: myPredictions } = meData as {
    user: { username: string; avatar_url: string | null };
    predictions: Prediction[];
  };
  const opponent = opponentRaw as OpponentProfile;
  const opponentPredictions = opponent.predictions ?? [];

  // ── Calcular stats ─────────────────────────────────────────────
  let equalVotes = 0,
    diffVotes = 0,
    noData = 0;

  const rows = myPredictions.map((pred, idx) => {
    const oppPred = findOpponentPred(pred.fight, opponentPredictions);
    const isDifferent =
      !!oppPred && oppPred.pick !== pred.predicted_winner.name;

    if (!oppPred) noData++;
    else if (isDifferent) diffVotes++;
    else equalVotes++;

    return { pred, oppPred, isDifferent, idx };
  });

  const total = myPredictions.length || 1;
  const equalPct = Math.round((equalVotes / total) * 100);
  const diffPct = Math.round((diffVotes / total) * 100);

  return (
    <div className="page-container ">
      {/* ── BACK ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 pt-8">
        <Link
          href="/predicciones/ranking"
          className="inline-flex items-center gap-2 text-white/30 hover:text-[#f4a261] transition-colors font-bebas tracking-widest uppercase text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Ranking
        </Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center pt-8 pb-20 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f4a261]/10 rounded-full blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e63946]/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_40px,rgba(255,255,255,0.012)_40px,rgba(255,255,255,0.012)_41px)]" />
        </div>

        <p className="relative z-10 font-bebas tracking-[0.4em] text-[#e63946] text-xs uppercase mb-10">
          La Velada del Año VI · Duelo de Oráculos
        </p>

        {/* Fighters row */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-6 px-4 md:px-0">
          {/* ME */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#f4a261] to-[#e63946] opacity-40 blur-md" />
              <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-[#f4a261]/60 overflow-hidden bg-[#111]">
                {me.avatar_url ? (
                  <img
                    src={me.avatar_url}
                    alt={me.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-white/20" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#f4a261] text-black text-md font-black px-1.5 py-0.5 rounded font-bebas tracking-wider">
                TÚ
              </div>
            </div>
            <div>
              <h2 className="font-bebas text-xl md:text-3xl text-white tracking-wide leading-none">
                {me.username}
              </h2>
              <p className="text-[#f4a261]/60 text-xs md:text-xs font-bebas tracking-widest mt-1">
                ESQUINA ROJA
              </p>
            </div>
          </div>

          {/* VS + scoreboard */}
          <div className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e63946] blur-xl opacity-50 rounded-full scale-125" />
              <div className="relative bg-[#e63946] text-white font-bebas text-2xl md:text-4xl px-3 md:px-4 py-1.5 md:py-2 rounded-xl border-2 border-white/10 shadow-[0_0_40px_rgba(230,57,70,0.5)]">
                VS
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 text-center mt-1">
              <div className="flex flex-col items-center">
                <span className="font-bebas text-xl md:text-2xl text-[#f4a261] leading-none">
                  {equalVotes}
                </span>
                <span className="text-[8px] md:text-md text-white/20 uppercase tracking-widest font-bebas">
                  iguales
                </span>
              </div>
              <span className="text-white/10 font-bebas text-lg hidden md:inline">
                ·
              </span>
              <div className="flex flex-col items-center">
                <span className="font-bebas text-xl md:text-2xl text-white/40 leading-none">
                  {noData}
                </span>
                <span className="text-[8px] md:text-md text-white/20 uppercase tracking-widest font-bebas">
                  sin rival
                </span>
              </div>
              <span className="text-white/10 font-bebas text-lg hidden md:inline">
                ·
              </span>
              <div className="flex flex-col items-center">
                <span className="font-bebas text-xl md:text-2xl text-[#e63946] leading-none">
                  {diffVotes}
                </span>
                <span className="text-[8px] md:text-md text-white/20 uppercase tracking-widest font-bebas">
                  difieren
                </span>
              </div>
            </div>
          </div>

          {/* RIVAL */}
          <div className="flex-1 flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-gray-600 to-gray-800 opacity-40 blur-md" />
              <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-white/20 overflow-hidden bg-[#111]">
                {opponent.avatar ? (
                  <img
                    src={opponent.avatar}
                    alt={opponent.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-white/20" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white/10 text-white/60 text-md font-black px-1.5 py-0.5 rounded font-bebas tracking-wider border border-white/10">
                RIVAL
              </div>
            </div>
            <div>
              <h2 className="font-bebas text-xl md:text-3xl text-white tracking-wide leading-none">
                {opponent.display_name ?? opponent.username}
              </h2>
              <p className="text-white/30 text-xs md:text-xs font-bebas tracking-widest mt-1">
                {opponent.stats?.accuracy != null
                  ? `${opponent.stats.accuracy}% ACIERTO · ${opponent.stats.badge?.emoji} ${opponent.stats.badge?.label}`
                  : "ESQUINA AZUL"}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de concordancia */}
        <div className="relative z-10 w-full max-w-xl mt-10">
          <div className="flex justify-between text-xs font-bebas tracking-widest text-white/30 uppercase mb-2">
            <span>Votos iguales {equalPct}%</span>
            <span>Votos diferentes {diffPct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-[#f4a261] to-[#e6813a] transition-all duration-700"
              style={{ width: `${equalPct}%` }}
            />
            <div className="flex-1 bg-gradient-to-r from-[#e63946]/60 to-[#e63946]" />
          </div>
        </div>
      </section>

      {/* ── TABLA ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-3 px-4">
          <span className="text-xs font-bebas tracking-[0.2em] text-[#f4a261]/60 uppercase">
            Tu predicción
          </span>
          <span className="text-xs font-bebas tracking-[0.2em] text-white/20 uppercase text-center w-28">
            Combate
          </span>
          <span className="text-xs font-bebas tracking-[0.2em] text-white/30 uppercase text-right">
            Rival
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {myPredictions.length === 0 && (
            <div className="py-20 text-center text-white/20 font-bebas text-xl tracking-wider">
              Sin predicciones registradas
            </div>
          )}

          {rows.map(({ pred, oppPred, isDifferent, idx }) => {
            const isMain = pred.fight.is_main_event;

            return (
              <div
                key={pred.id ?? idx}
                className={`
    relative overflow-hidden rounded-3xl border transition-all duration-300
    ${
      isMain
        ? "border-[#f4a261]/50 bg-gradient-to-br from-[#f4a261]/15 via-zinc-950 to-black shadow-2xl shadow-[#f4a261]/20"
        : "border-white/10 bg-zinc-950 hover:border-white/20 hover:shadow-xl"
    }
  `}
              >
                {/* Glow y barra accent para Main Event */}
                {isMain && (
                  <div className="absolute -inset-px bg-gradient-to-br from-[#f4a261]/20 via-transparent to-transparent rounded-3xl -z-10" />
                )}
                {isMain && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#f4a261] via-[#f4a261] to-transparent" />
                )}

                <div className="p-6 md:p-8">
                  {/* TU PICK */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono tracking-[2px] text-[#f4a261] uppercase font-bold">
                        Tú
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-5xl md:text-6xl flex-shrink-0 drop-shadow-md">
                        {pred.predicted_winner.country_flag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-bebas text-2xl md:text-3xl leading-none tracking-wider
            ${isDifferent ? "text-[#f4a261]" : "text-white"}`}
                        >
                          {pred.predicted_winner.name}
                        </p>
                        {pred.is_correct !== null && (
                          <p
                            className={`mt-2 text-sm font-bold tracking-[2px] uppercase
              ${pred.is_correct ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {pred.is_correct ? "✓ CORRECTO" : "✗ INCORRECTO"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CENTRO - VS */}
                  <div className="flex flex-col items-center mb-8">
                    <div
                      className={`font-bebas text-sm tracking-[4px] uppercase mb-4
        ${isMain ? "text-[#f4a261] drop-shadow" : "text-white/40"}`}
                    >
                      {isMain
                        ? "★ MAIN EVENT ★"
                        : `Fight ${pred.fight.order ?? idx + 1}`}
                    </div>

                    <div className="flex items-center gap-6">
                      {!oppPred ? (
                        <Minus className="w-9 h-9 text-white/30" />
                      ) : isDifferent ? (
                        <XCircle className="w-11 h-11 text-[#e63946] drop-shadow-[0_0_15px_#e63946]" />
                      ) : (
                        <CheckCircle2 className="w-11 h-11 text-emerald-400 drop-shadow-[0_0_15px_#10b981]" />
                      )}

                      <div className="text-4xl font-black text-white/30 tracking-widest">
                        VS
                      </div>

                      {!oppPred ? (
                        <Minus className="w-9 h-9 text-white/30" />
                      ) : isDifferent ? (
                        <XCircle className="w-11 h-11 text-[#e63946] drop-shadow-[0_0_15px_#e63946]" />
                      ) : (
                        <CheckCircle2 className="w-11 h-11 text-emerald-400 drop-shadow-[0_0_15px_#10b981]" />
                      )}
                    </div>

                    <p className="text-center text-white/60 text-sm md:text-base mt-5 font-medium leading-tight max-w-[300px]">
                      {pred.fight.fighter1.name}{" "}
                      <span className="text-white/30">VS</span>{" "}
                      {pred.fight.fighter2.name}
                    </p>
                  </div>

                  {/* PICK DEL RIVAL */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono tracking-[2px] text-white/60 uppercase font-bold">
                        {oppPred?.user?.username
                          ? `@${oppPred.user.username}`
                          : "Rival"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0 text-right">
                        {oppPred ? (
                          <>
                            <p
                              className={`font-bebas text-2xl md:text-3xl leading-none tracking-wider
                ${isDifferent ? "text-white/70" : "text-white"}`}
                            >
                              {oppPred.pick}
                            </p>
                            {oppPred.is_correct !== null && (
                              <p
                                className={`mt-2 text-sm font-bold tracking-[2px] uppercase
                  ${oppPred.is_correct ? "text-emerald-400" : "text-red-400"}`}
                              >
                                {oppPred.is_correct
                                  ? "✓ CORRECTO"
                                  : "✗ INCORRECTO"}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-white/40 italic text-base">
                            Sin predicción
                          </p>
                        )}
                      </div>

                      {oppPred && (
                        <div className="text-5xl md:text-6xl flex-shrink-0 drop-shadow-md">
                          {oppPred.pick_flag}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Línea glow inferior para Main Event */}
                {isMain && (
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f4a261]/60 to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        {myPredictions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs font-bebas tracking-widest text-white/25 uppercase">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400/50" /> Mismo
              voto
            </span>
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3 h-3 text-[#e63946]/70" /> Votos distintos
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="w-3 h-3 text-white/20" /> Sin predicción del
              rival
            </span>
          </div>
        )}

        {opponentPredictions.length === 0 && myPredictions.length > 0 && (
          <div className="mt-6 px-4 py-3 rounded-xl border border-[#e63946]/20 bg-[#e63946]/5 text-center">
            <p className="text-[11px] text-[#e63946]/70 font-bebas tracking-wider">
              {opponent.username} no tiene predicciones públicas registradas.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
