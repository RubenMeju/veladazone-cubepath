export function DNACard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#f4a261]/20 rounded-2xl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f4a261]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[radial-gradient(ellipse_at_top,_#f4a261_0%,_transparent_70%)] opacity-10 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🧬</span>
          <h3 className="font-bebas text-lg text-white tracking-wider">
            TU ADN DE PREDICTOR
          </h3>
        </div>

        <p className="text-sm text-gray-600 tracking-wide mb-4">
          La IA analiza tus picks y revela tu personalidad
        </p>

        {children}
      </div>
    </div>
  );
}
