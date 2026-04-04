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
        <div className="relative z-10 w-full max-w-3xl flex items-center justify-between gap-4">
          {/* ME */}
          <div className="flex-1 flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#f4a261] to-[#e63946] opacity-40 blur-md" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#f4a261]/60 overflow-hidden bg-[#111]">
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
              <div className="absolute -bottom-1 -right-1 bg-[#f4a261] text-black text-[9px] font-black px-1.5 py-0.5 rounded font-bebas tracking-wider">
                TÚ
              </div>
            </div>
            <div>
              <h2 className="font-bebas text-2xl md:text-3xl text-white tracking-wide leading-none">
                {me.username}
              </h2>
              <p className="text-[#f4a261]/60 text-xs font-bebas tracking-widest mt-1">
                ESQUINA ROJA
              </p>
            </div>
          </div>

          {/* VS + scoreboard */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e63946] blur-xl opacity-50 rounded-full scale-150" />
              <div className="relative bg-[#e63946] text-white font-bebas text-3xl md:text-4xl px-4 py-2 rounded-xl border-2 border-white/10 shadow-[0_0_40px_rgba(230,57,70,0.5)]">
                VS
              </div>
            </div>
            <div className="flex items-center gap-2 text-center">
              <div className="flex flex-col items-center">
                <span className="font-bebas text-2xl text-[#f4a261] leading-none">
                  {equalVotes}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bebas">
                  iguales
                </span>
              </div>
              <span className="text-white/10 font-bebas text-lg">·</span>
              <div className="flex flex-col items-center">
                <span className="font-bebas text-2xl text-white/40 leading-none">
                  {noData}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bebas">
                  sin rival
                </span>
              </div>
              <span className="text-white/10 font-bebas text-lg">·</span>
              <div className="flex flex-col items-center">
                <span className="font-bebas text-2xl text-[#e63946] leading-none">
                  {diffVotes}
                </span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest font-bebas">
                  difieren
                </span>
              </div>
            </div>
          </div>

          {/* RIVAL */}
          <div className="flex-1 flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-gray-600 to-gray-800 opacity-40 blur-md" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/20 overflow-hidden bg-[#111]">
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
              <div className="absolute -bottom-1 -right-1 bg-white/10 text-white/60 text-[9px] font-black px-1.5 py-0.5 rounded font-bebas tracking-wider border border-white/10">
                RIVAL
              </div>
            </div>
            <div>
              <h2 className="font-bebas text-2xl md:text-3xl text-white tracking-wide leading-none">
                {opponent.display_name ?? opponent.username}
              </h2>
              <p className="text-white/30 text-xs font-bebas tracking-widest mt-1">
                {opponent.stats?.accuracy != null
                  ? `${opponent.stats.accuracy}% ACIERTO · ${opponent.stats.badge?.emoji} ${opponent.stats.badge?.label}`
                  : "ESQUINA AZUL"}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de concordancia */}
        <div className="relative z-10 w-full max-w-xl mt-10">
          <div className="flex justify-between text-[10px] font-bebas tracking-widest text-white/30 uppercase mb-2">
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
          <span className="text-[10px] font-bebas tracking-[0.2em] text-[#f4a261]/60 uppercase">
            Tu predicción
          </span>
          <span className="text-[10px] font-bebas tracking-[0.2em] text-white/20 uppercase text-center w-28">
            Combate
          </span>
          <span className="text-[10px] font-bebas tracking-[0.2em] text-white/30 uppercase text-right">
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
                  relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 rounded-2xl border transition-colors
                  ${
                    isMain
                      ? "border-[#f4a261]/20 bg-gradient-to-r from-[#f4a261]/5 via-transparent to-transparent"
                      : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035]"
                  }
                `}
              >
                {/* Acento main event */}
                {isMain && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f4a261]/0 via-[#f4a261]/60 to-[#f4a261]/0 rounded-full" />
                )}

                {/* MI PICK */}
                <div className="flex flex-col items-start gap-0.5">
                  <span
                    className={`text-xs md:text-sm font-bebas tracking-wide ${
                      isDifferent
                        ? "text-[#f4a261]"
                        : !oppPred
                          ? "text-white/50"
                          : "text-white"
                    }`}
                  >
                    {pred.predicted_winner.country_flag}{" "}
                    {pred.predicted_winner.name}
                  </span>
                  {pred.is_correct != null && (
                    <span
                      className={`text-[9px] font-bebas tracking-widest ${pred.is_correct ? "text-emerald-400" : "text-red-400/70"}`}
                    >
                      {pred.is_correct ? "✓ correcto" : "✗ incorrecto"}
                    </span>
                  )}
                </div>

                {/* CENTRO */}
                <div className="flex flex-col items-center w-28 gap-1">
                  <span
                    className={`text-[9px] font-bebas tracking-widest uppercase ${isMain ? "text-[#f4a261]/80" : "text-white/25"}`}
                  >
                    {isMain
                      ? "★ Main Event"
                      : `Fight ${pred.fight.order ?? idx + 1}`}
                  </span>
                  {!oppPred ? (
                    <Minus className="w-3.5 h-3.5 text-white/15" />
                  ) : isDifferent ? (
                    <XCircle className="w-4 h-4 text-[#e63946]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/70" />
                  )}
                  <span className="text-[8px] text-white/15 font-bebas tracking-wide text-center leading-tight">
                    {pred.fight.fighter1.name} vs {pred.fight.fighter2.name}
                  </span>
                </div>

                {/* PICK RIVAL */}
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`text-xs md:text-sm font-bebas tracking-wide text-right ${
                      !oppPred
                        ? "text-white/20 italic"
                        : isDifferent
                          ? "text-white/60"
                          : "text-white"
                    }`}
                  >
                    {oppPred
                      ? `${oppPred.pick_flag} ${oppPred.pick}`
                      : "Sin datos"}
                  </span>
                  {oppPred?.is_correct != null && (
                    <span
                      className={`text-[9px] font-bebas tracking-widest ${oppPred.is_correct ? "text-emerald-400" : "text-red-400/70"}`}
                    >
                      {oppPred.is_correct ? "✓ correcto" : "✗ incorrecto"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        {myPredictions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[10px] font-bebas tracking-widest text-white/25 uppercase">
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
