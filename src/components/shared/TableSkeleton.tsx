interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-xs animate-pulse">
      {/* Table Header Skeleton */}
      <div className="h-11 bg-muted/40 border-b border-border flex items-center px-5 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-muted rounded-md"
            style={{ width: `${Math.max(15, 90 / columns)}%` }}
          />
        ))}
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-15 flex items-center px-5 gap-4 bg-card">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-3.5 bg-muted/70 rounded-md"
                style={{
                  width: `${Math.max(20, (80 / columns) - (c === 0 ? 0 : 5))}%`,
                  opacity: 1 - (r * 0.08),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
