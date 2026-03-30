// ---------------------------------------------------------------------------
// Skeleton mientras se cargan los datos
// ---------------------------------------------------------------------------
export default function PrediccionesSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-40 animate-pulse"
            role="status"
            aria-label="Cargando combate"
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-32 animate-pulse"
            role="status"
            aria-label="Cargando estadísticas de comunidad"
          />
        ))}
      </div>
    </div>
  );
}
