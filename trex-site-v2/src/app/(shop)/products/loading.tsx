export default function ProductsLoading() {
  return (
    <div>
      {/* Dark hero skeleton */}
      <section className="bg-[#080808] pt-32 pb-16">
        <div className="site-container-wide">
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-20 w-64 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Light grid skeleton */}
      <section className="bg-[#F5F5F0] py-16">
        <div className="site-container-wide">
          <div className="flex gap-2 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 bg-trex-card rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-square bg-trex-card rounded-xl mb-4 animate-pulse" />
                <div className="h-3 w-16 bg-trex-card rounded animate-pulse mb-2" />
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-trex-card rounded animate-pulse" />
                  <div className="h-4 w-16 bg-trex-card rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
