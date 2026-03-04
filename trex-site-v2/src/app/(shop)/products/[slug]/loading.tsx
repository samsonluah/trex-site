export default function ProductDetailLoading() {
  return (
    <div className="bg-[#F5F5F0] min-h-screen">
      {/* Dark header strip skeleton */}
      <div className="bg-[#080808] pt-28 pb-8">
        <div className="site-container-wide">
          <div className="h-3 w-40 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      <div className="site-container-wide py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-trex-card rounded-xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-3 w-20 bg-trex-card rounded animate-pulse" />
            <div className="h-12 w-64 bg-trex-card rounded animate-pulse" />
            <div className="h-8 w-32 bg-trex-card rounded animate-pulse" />
            <div className="h-24 w-full bg-trex-card rounded animate-pulse mt-4" />
            <div className="h-14 w-full bg-trex-card rounded-lg animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
