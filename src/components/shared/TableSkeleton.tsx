interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full bg-card rounded-2xl border border-border/60 overflow-hidden animate-pulse">
      <div className="h-12 bg-muted/40 border-b border-border/50 flex items-center px-6 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted/80 rounded"
            style={{ width: `${100 / columns}%` }}
          />
        ))}
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-16 flex items-center px-6 gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-muted/60 rounded"
                style={{ width: `${Math.max(30, (100 / columns) - (c * 10))}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
