// Se muestra automáticamente durante navegaciones lentas (Next.js App Router).
// El Suspense inline en page.tsx cubre el caso normal (primera carga).
export default function Loading() {
  return (
    <div className="page-container">
      <div className="mb-6 sm:mb-8">
        <div className="h-3 w-44 bg-white/5 rounded animate-pulse mb-3" />
        <div className="h-14 w-72 bg-white/5 rounded animate-pulse mb-3" />
        <div className="h-3 w-64 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-40 animate-pulse"
            />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0d0d0d] border border-white/5 rounded-2xl h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
