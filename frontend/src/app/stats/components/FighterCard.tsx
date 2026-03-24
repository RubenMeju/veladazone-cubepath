// "use client";

// import { useState } from "react";
// import { api } from "@/lib/api";
// import { Fighter } from "@/types";

// export function FighterCard({ fighter }: { fighter: Fighter }) {
//   const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleAnalysis = async () => {
//     if (analysis) {
//       setAnalysis(null);
//       return;
//     }
//     setLoading(true);
//     try {
//       const data = await api.get<{ analysis: string }>(
//         `/fighters/${fighter.id}/analysis/`,
//       );
//       setAnalysis(data.analysis);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalFights = fighter.record.wins + fighter.record.losses;
//   const winRate =
//     totalFights > 0 ? Math.round((fighter.record.wins / totalFights) * 100) : 0;

//   return (
//     <div className="group relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-xl hover:border-white/10 transition-all duration-200">
//       {/* Hover glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />

//       <div className="relative p-4">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-4">
//           <div className="relative flex-shrink-0">
//             <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-2xl group-hover:border-[#e63946]/20 transition-colors">
//               {fighter.country_flag}
//             </div>
//             {fighter.record.wins > 0 && (
//               <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
//                 <span className="text-[8px] text-green-400 font-bold">
//                   {fighter.record.wins}
//                 </span>
//               </div>
//             )}
//           </div>
//           <div className="min-w-0">
//             <h3 className="font-bebas text-lg text-white tracking-wide leading-tight truncate group-hover:text-[#e63946] transition-colors">
//               {fighter.name}
//             </h3>
//             <p className="text-[11px] text-gray-600 tracking-widest uppercase">
//               {fighter.country}
//             </p>
//           </div>
//         </div>

//         {/* Stats */}
//         {totalFights > 0 ? (
//           <div className="flex gap-2 mb-3">
//             <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-green-500/10">
//               <div className="font-bebas text-xl text-green-400 leading-tight">
//                 {fighter.record.wins}
//               </div>
//               <div className="text-[9px] text-gray-600 uppercase tracking-widest">
//                 Victorias
//               </div>
//             </div>
//             <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-[#e63946]/10">
//               <div className="font-bebas text-xl text-[#e63946] leading-tight">
//                 {fighter.record.losses}
//               </div>
//               <div className="text-[9px] text-gray-600 uppercase tracking-widest">
//                 Derrotas
//               </div>
//             </div>
//             <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
//               <div className="font-bebas text-xl text-[#f4a261] leading-tight">
//                 {winRate}%
//               </div>
//               <div className="text-[9px] text-gray-600 uppercase tracking-widest">
//                 Win rate
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5 mb-3">
//             <div className="text-[11px] text-gray-600">
//               Sin combates registrados
//             </div>
//           </div>
//         )}

//         {/* Win rate bar */}
//         {totalFights > 0 && (
//           <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mb-3">
//             <div
//               className="h-full bg-gradient-to-r from-green-500 to-[#f4a261] rounded-full transition-all duration-500"
//               style={{ width: `${winRate}%` }}
//             />
//           </div>
//         )}

//         {/* Bio */}
//         {fighter.bio && (
//           <p className="text-[11px] text-gray-600 mb-3 leading-relaxed line-clamp-2">
//             {fighter.bio}
//           </p>
//         )}

//         {/* AI Button */}
//         <button
//           onClick={handleAnalysis}
//           disabled={loading}
//           className={`w-full text-[11px] py-2 rounded-lg transition-all duration-200 border tracking-widest uppercase disabled:opacity-50 ${
//             analysis
//               ? "border-[#e63946]/30 bg-[#e63946]/5 text-[#e63946]/70 hover:bg-[#e63946]/10"
//               : "border-white/5 bg-transparent text-gray-600 hover:border-white/10 hover:text-gray-400"
//           }`}
//         >
//           {loading ? (
//             <span className="animate-pulse">Analizando...</span>
//           ) : analysis ? (
//             "✕ Cerrar análisis"
//           ) : (
//             "🤖 Análisis IA"
//           )}
//         </button>

//         {/* Analysis result */}
//         {analysis && (
//           <div className="mt-3 relative overflow-hidden bg-[#0a0a0a] border border-[#e63946]/15 rounded-lg p-3">
//             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/25 to-transparent" />
//             <div className="text-[9px] text-[#e63946]/60 tracking-[0.3em] uppercase mb-1.5">
//               Análisis IA
//             </div>
//             <p className="text-[11px] text-gray-400 leading-relaxed italic">
//               {analysis}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

////////////////////////////////////////////////
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Fighter } from "@/types";

export function FighterCard({ fighter }: { fighter: Fighter }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ analysis: string }>(
        `/fighters/${fighter.id}/analysis/`,
      );
      setAnalysis(data.analysis);
      setShowModal(true); // Abrimos el modal con el análisis
    } finally {
      setLoading(false);
    }
  };

  const totalFights = fighter.record.wins + fighter.record.losses;
  const winRate =
    totalFights > 0 ? Math.round((fighter.record.wins / totalFights) * 100) : 0;

  return (
    <>
      <div className="group relative overflow-hidden bg-[#0d0d0d] border border-white/5 rounded-xl hover:border-white/10 transition-all duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#e63946_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />

        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-2xl group-hover:border-[#e63946]/20 transition-colors">
                {fighter.country_flag}
              </div>
              {fighter.record.wins > 0 && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <span className="text-[8px] text-green-400 font-bold">
                    {fighter.record.wins}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bebas text-lg text-white tracking-wide leading-tight truncate group-hover:text-[#e63946] transition-colors">
                {fighter.name}
              </h3>
              <p className="text-[11px] text-gray-600 tracking-widest uppercase">
                {fighter.country}
              </p>
            </div>
          </div>

          {/* Stats */}
          {totalFights > 0 ? (
            <div className="flex gap-2 mb-3">
              <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-green-500/10">
                <div className="font-bebas text-xl text-green-400 leading-tight">
                  {fighter.record.wins}
                </div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                  Victorias
                </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-[#e63946]/10">
                <div className="font-bebas text-xl text-[#e63946] leading-tight">
                  {fighter.record.losses}
                </div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                  Derrotas
                </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
                <div className="font-bebas text-xl text-[#f4a261] leading-tight">
                  {winRate}%
                </div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                  Win rate
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5 mb-3">
              <div className="text-[11px] text-gray-600">
                Sin combates registrados
              </div>
            </div>
          )}

          {/* Win rate bar */}
          {totalFights > 0 && (
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-[#f4a261] rounded-full transition-all duration-500"
                style={{ width: `${winRate}%` }}
              />
            </div>
          )}

          {/* Bio */}
          {fighter.bio && (
            <p className="text-[11px] text-gray-600 mb-3 leading-relaxed line-clamp-2">
              {fighter.bio}
            </p>
          )}

          {/* AI Button */}
          <button
            onClick={handleAnalysis}
            disabled={loading}
            className={`w-full text-[11px] py-2 rounded-lg transition-all duration-200 border tracking-widest uppercase disabled:opacity-50 border-white/5 bg-transparent text-gray-600 hover:border-white/10 hover:text-gray-400`}
          >
            {loading ? (
              <span className="animate-pulse">Analizando...</span>
            ) : (
              "🤖 Análisis IA"
            )}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] rounded-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[#e63946]"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className="text-[9px] text-[#e63946]/60 tracking-[0.3em] uppercase mb-2">
              Análisis IA
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed italic">
              {analysis}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
