export default function ProductsLoading() {
  return (
    <div className="site-container py-24">
      <div className="h-4 w-12 bg-trex-card rounded animate-pulse mb-2" />
      <div className="h-10 w-48 bg-trex-card rounded animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="site-card">
            <div className="aspect-square bg-trex-card rounded-xl mb-4 animate-pulse" />
            <div className="flex justify-between">
              <div>
                <div className="h-5 w-32 bg-trex-card rounded animate-pulse" />
                <div className="h-4 w-20 bg-trex-card rounded animate-pulse mt-2" />
              </div>
              <div className="h-5 w-16 bg-trex-card rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
