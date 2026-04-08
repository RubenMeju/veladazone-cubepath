// frontend/src/app/blog/components/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white/5 rounded-xl animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-video bg-white/5 rounded-xl animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}