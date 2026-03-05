export function NewsCardSkeleton() {
  return (
    <div className="bg-dark-900/50 rounded-xl overflow-hidden border border-dark-800 animate-pulse">
      <div className="aspect-[16/10] bg-dark-800" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-dark-800 rounded" />
          <div className="h-4 w-16 bg-dark-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-dark-800 rounded w-full" />
          <div className="h-5 bg-dark-800 rounded w-3/4" />
        </div>
        <div className="h-4 bg-dark-800 rounded w-full" />
        <div className="h-4 bg-dark-800 rounded w-2/3" />
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark-900 animate-pulse">
      <div className="aspect-[16/9] md:aspect-[21/9] bg-dark-800" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-dark-700 rounded-full" />
          <div className="h-4 w-20 bg-dark-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-dark-700 rounded w-3/4" />
          <div className="h-8 bg-dark-700 rounded w-1/2" />
        </div>
        <div className="h-5 bg-dark-700 rounded w-full max-w-2xl" />
      </div>
    </div>
  );
}
