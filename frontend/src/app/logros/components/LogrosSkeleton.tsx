export function LogrosSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-48 bg-white/10 rounded mb-2" />
      <div className="h-4 w-64 bg-white/5 rounded mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white/5 rounded-2xl border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
