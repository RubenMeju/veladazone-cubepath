export function DNASkeleton() {
  return (
    <div className="space-y-2 py-2">
      <div className="h-6 w-32 bg-[#f4a261]/10 rounded animate-pulse mx-auto" />
      <div className="h-3 bg-white/5 rounded animate-pulse" />
      <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
      <div className="h-3 bg-white/5 rounded animate-pulse w-3/5" />
    </div>
  );
}
