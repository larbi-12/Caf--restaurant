export function EmptyState({ title = "Aucune donnée", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-20 px-6">
      <p className="text-neutral-900 font-medium">{title}</p>
      {description && <p className="text-neutral-500 text-sm max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-20 px-6">
      <p className="text-red-600 font-medium">Une erreur est survenue</p>
      <p className="text-neutral-500 text-sm max-w-sm">{message || "Veuillez réessayer dans quelques instants."}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-neutral-100 rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
