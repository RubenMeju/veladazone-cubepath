export function ProfileSkeleton() {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="h-7 w-40 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-xl p-4 text-center"
          >
            <div className="h-8 w-12 bg-white/5 rounded animate-pulse mx-auto mb-2" />
            <div className="h-3 w-16 bg-white/5 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5"
          >
            <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-4" />
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-12 bg-white/5 rounded-lg animate-pulse mb-2"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
