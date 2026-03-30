export default function StatsSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      <SectionSkeleton rows={3} height="h-28" />
      <SectionSkeleton rows={6} height="h-40" />
    </div>
  );
}

function SectionSkeleton({ rows, height }: { rows: number; height: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-6 w-32 bg-gray-700 rounded"></div>
      </div>
      <div
        className={
          rows > 1
            ? "flex flex-col gap-4"
            : "grid md:grid-cols-3 lg:grid-cols-4 gap-6"
        }
      >
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className={`${height} bg-[#0d0d0d] border border-white/5 rounded-2xl`}
          />
        ))}
      </div>
    </div>
  );
}
